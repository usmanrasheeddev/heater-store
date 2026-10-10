import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Room Heaters | A warmer kind of everyday', description: 'Explore portable electric room heaters and choose your model. Cash on Delivery checkout.', icons: {icon:'/favicon.svg'}, robots: { index: false, follow: false } };
export default function Layout({children}: {children: React.ReactNode}) { return <html lang="en"><body>{children}</body></html> }
