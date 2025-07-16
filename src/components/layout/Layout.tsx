
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import GeoTargetingScript from '@/components/seo/GeoTargetingScript';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useScrollToTop();

  return (
    <div className="min-h-screen flex flex-col">
      <GeoTargetingScript enabled={true} />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
