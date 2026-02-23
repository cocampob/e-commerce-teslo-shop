'use client';

import { Footer, Sidebar, TopMenu } from '@/components';

export default function ShopLayout({children}: {
 children: React.ReactNode;
}) {
  return (
  <div className="min-h-screen px-5">
        
        <TopMenu />
        <Sidebar />
        
        <div className='px-o sm:px-10'>
          {children}
        </div>
        <Footer />
  </div>
  );
}