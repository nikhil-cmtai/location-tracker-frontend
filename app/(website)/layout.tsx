import React from 'react';
import Header from '@/components/website/Header';
import Footer from '@/components/website/Footer';
import Topbar from '@/components/website/Tobar';
import FloatingButton from '@/components/website/FloatingButtons';


export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Topbar />
      <Header />
      <FloatingButton />
      {children}
      <Footer />
    </div>
  )
}