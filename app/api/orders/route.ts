import {env} from 'cloudflare:workers';
import {catalog,canOrder} from '../../catalog';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request) {
  if(request.headers.get('origin') !== new URL(request.url).origin) return reply({error:'Please submit your order from this store.'},403);
  if(!request.headers.get('content-type')?.includes('application/json')) return reply({error:'Please send a valid order.'},415);
  const raw=await request.text(); if(raw.length>8000) return reply({error:'Order details are too long.'},413);
  let b; try {b=JSON.parse(raw)} catch {return reply({error:'Please send a valid order.'},400)}
  if(!b || typeof b!=='object') return reply({error:'Please send a valid order.'},400);
  const errors:Record<string,string>={};
  for(const [key,min,max] of [['fullName',2,100],['mobile',7,25],['city',2,100],['address',10,500]] as const) {
    if(typeof b[key]!=='string'||b[key].trim().length<min||b[key].length>max) errors[key]=`Please enter a valid ${key==='fullName'?'full name':key}.`;
  }
  if(typeof b.mobile==='string' && (!/^[+\d\s()-]+$/.test(b.mobile)||b.mobile.replace(/\D/g,'').length<7||b.mobile.replace(/\D/g,'').length>15)) errors.mobile='Enter a mobile number with 7–15 digits.';
  if(!Number.isInteger(b.quantity)||b.quantity<1||b.quantity>10) errors.quantity='Choose 1–10 heaters.';
  const p=catalog.products.find(x=>x.id===b.productId); if(!p) errors.productId='Choose a model.';
  if(Object.keys(errors).length) return reply({error:'Please check the highlighted fields.',errors},422);
  const key=request.headers.get('idempotency-key'); if(!key||! /^[a-zA-Z0-9-]{20,80}$/.test(key)) return reply({error:'Refresh this page and try again.'},400);
  if(!canOrder()) return reply({error:'Orders are not open yet. Prices, model details and delivery policies are awaiting confirmation.'},503);
  if(!env.DB) return reply({error:'Orders are temporarily unavailable. Please try again later.'},503);
  const clean={productId:p!.id,quantity:b.quantity,fullName:b.fullName.trim(),mobile:b.mobile.trim(),city:b.city.trim(),address:b.address.trim()};
  const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(clean))))).map(x=>x.toString(16).padStart(2,'0')).join('');
  const id='RH-'+crypto.randomUUID().toUpperCase();
  const total=p!.price!*b.quantity+catalog.delivery!;
  try {
    await env.DB.prepare('INSERT INTO orders (id,idempotency_key,payload_hash,product_id,product_name,quantity,unit_price,delivery,total,currency,full_name,mobile,city,address,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(idempotency_key) DO NOTHING').bind(id,key,hash,p!.id,p!.name,b.quantity,p!.price,catalog.delivery,total,catalog.currency,clean.fullName,clean.mobile,clean.city,clean.address,'received',new Date().toISOString()).run();
    const row=await env.DB.prepare('SELECT id,payload_hash,product_name,quantity,total,currency FROM orders WHERE idempotency_key=?').bind(key).first();
    if(!row) throw new Error('No saved order');
    if(row.payload_hash!==hash) return reply({error:'This request was already used for another order. Refresh before placing a new order.'},409);
    return reply({reference:row.id,product:row.product_name,quantity:row.quantity,total:row.total,currency:row.currency},201);
  } catch {return reply({error:'We could not confirm your order. Please retry; the same order will not be saved twice.'},503)}
}
