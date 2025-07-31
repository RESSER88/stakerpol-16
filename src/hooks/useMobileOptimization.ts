import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizationConfig {
  enableServiceWorker?: boolean;
  enableTouchOptimization?: boolean;
  enableProgressiveLoading?: boolean;
}

export const useMobileOptimization = (config: MobileOptimizationConfig = {}) => {
  const {
    enableServiceWorker = true,
    enableTouchOptimization = true,
    enableProgressiveLoading = true
  } = config;

  const isMobile = useIsMobile();
  const [isServiceWorkerRegistered, setIsServiceWorkerRegistered] = useState(false);

  // Register Service Worker for mobile performance
  useEffect(() => {
    if (enableServiceWorker && isMobile && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
          setIsServiceWorkerRegistered(true);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker is available
                  console.log('New service worker available');
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, [enableServiceWorker, isMobile]);

  // Touch optimization for mobile
  useEffect(() => {
    if (enableTouchOptimization && isMobile) {
      // Prevent zoom on double tap for better UX
      let lastTouchEnd = 0;
      const preventZoom = (e: TouchEvent) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          e.preventDefault();
        }
        lastTouchEnd = now;
      };

      document.addEventListener('touchend', preventZoom, { passive: false });

      // Add touch-friendly classes
      document.body.classList.add('touch-optimized');

      return () => {
        document.removeEventListener('touchend', preventZoom);
        document.body.classList.remove('touch-optimized');
      };
    }
  }, [enableTouchOptimization, isMobile]);

  // Progressive loading for mobile
  useEffect(() => {
    if (enableProgressiveLoading && isMobile) {
      // Intersection Observer for lazy loading
      const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      };

      const loadProgressively = (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('loaded');
          }
        });
      };

      const observer = new IntersectionObserver(loadProgressively, observerOptions);

      // Observe all elements with progressive-load class
      const progressiveElements = document.querySelectorAll('.progressive-load');
      progressiveElements.forEach((el) => observer.observe(el));

      return () => {
        observer.disconnect();
      };
    }
  }, [enableProgressiveLoading, isMobile]);

  // Preload critical resources for mobile
  useEffect(() => {
    if (isMobile) {
      // Preload critical fonts
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = '/fonts/inter-var.woff2';
      document.head.appendChild(link);

      // Preload critical CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'preload';
      cssLink.as = 'style';
      cssLink.href = '/critical.css';
      document.head.appendChild(cssLink);

      return () => {
        document.head.removeChild(link);
        document.head.removeChild(cssLink);
      };
    }
  }, [isMobile]);

  return {
    isMobile,
    isServiceWorkerRegistered,
    isOptimized: isMobile
  };
};