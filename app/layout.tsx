import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'RB Heaters | A warmer kind of everyday', description: 'Explore portable electric room heaters at RB Heaters and choose your model. Cash on Delivery checkout.', icons: {icon:'/rb-favicon.png',apple:'/images/rb-logo.webp'}, robots: { index: false, follow: false } };
export default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html> }
