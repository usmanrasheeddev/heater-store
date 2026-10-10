export type Product = { id: string; name: string; description: string; price: number; originalPrice: number; image: string; watts: string | null; confirmed: boolean };
export const catalog = {
  currency: 'PKR', delivery: 25000, policiesConfirmed: true,
  products: [
    {id:'small',name:'12 inch RB dish heater',description:'Compact comfort, with two ways to warm up.',price:119900,originalPrice:139900,image:'white',watts:'300W / 600W',confirmed:true},
    {id:'second',name:'Panasonic pedestal',description:'A taller design, with a light panel and moving function.',price:650000,originalPrice:800000,image:'pedestal',watts:null,confirmed:true},
  ] as Product[]
};
export function canOrder() { return Boolean(catalog.currency && Number.isSafeInteger(catalog.delivery) && catalog.delivery>=0 && catalog.policiesConfirmed && catalog.products.every(p=>p.confirmed && Number.isSafeInteger(p.price) && p.price>0 && p.image)); }
