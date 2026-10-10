import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:5173';
const valid={productId:'small',quantity:2,fullName:'TEST ORDER — DO NOT FULFILL',mobile:'03000000000',city:'Test city',address:'Test-only local delivery address. Do not fulfill.'};
const post=async(body,key=crypto.randomUUID(),origin=base)=>{const r=await fetch(base+'/api/orders',{method:'POST',headers:{'Content-Type':'application/json','Idempotency-Key':key,Origin:origin},body:JSON.stringify(body)});const text=await r.text();let data;try{data=JSON.parse(text)}catch{data={error:text}}return {status:r.status,body:data}};
const missing=await post({});assert.equal(missing.status,422);assert.ok(missing.body.errors.fullName);assert.ok(missing.body.errors.mobile);
assert.equal((await post({...valid,quantity:0})).status,422);
assert.equal((await post({...valid,quantity:1.5})).status,422);
assert.equal((await post({...valid,quantity:11})).status,422);
assert.equal((await post({...valid,productId:'fake'})).status,422);
assert.equal((await post({...valid,mobile:'not a number'})).status,422);
assert.equal((await post(valid,crypto.randomUUID(),'https://unrelated.example')).status,403);
const key=crypto.randomUUID();const [first,retry]=await Promise.all([post({...valid,price:1,total:1},key),post({...valid,price:1,total:1},key)]);
assert.equal(first.status,201,JSON.stringify(first));assert.equal(retry.status,201,JSON.stringify(retry));assert.equal(first.body.reference,retry.body.reference);assert.equal(first.body.total,264800);assert.equal(first.body.quantity,2);assert.equal(first.body.currency,'PKR');
assert.equal((await post({...valid,quantity:3},key)).status,409);
const big=await post({...valid,productId:'second',quantity:1});assert.equal(big.status,201);assert.equal(big.body.total,675000);
console.log('PASS: required fields, invalid models/quantities/phone, cross-origin rejection, authoritative totals, durable success, concurrent retry deduplication, conflicting retries, second model total.');
console.log('Test order references:',first.body.reference,big.body.reference);

