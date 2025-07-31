
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import { usePageOptimization } from '@/hooks/usePageOptimization';
import GeoTargetingScript from '@/components/seo/GeoTargetingScript';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useScrollToTop();
  useMobileOptimization({
    enableServiceWorker: true,
    enableTouchOptimization: true,
    enableProgressiveLoading: true
  });
  usePageOptimization({
    enableImageLazyLoading: true,
    enablePrefetching: true,
    enableCriticalResourceHints: true
  });

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
