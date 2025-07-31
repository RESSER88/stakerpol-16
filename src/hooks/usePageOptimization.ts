
import { useEffect } from 'react';

interface PageOptimizationOptions {
  enableImageLazyLoading?: boolean;
  enablePrefetching?: boolean;
  enableCriticalResourceHints?: boolean;
  preloadImages?: string[]; // Added missing property
  prefetchRoutes?: string[]; // Added missing property
}

export const usePageOptimization = (options: PageOptimizationOptions = {}) => {
  const {
    enableImageLazyLoading = true,
    enablePrefetching = true,
    enableCriticalResourceHints = true,
    preloadImages = [],
    prefetchRoutes = []
  } = options;

  useEffect(() => {
    // Preload critical images
    if (preloadImages.length > 0) {
      preloadImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    }

    // Enable native lazy loading for images
    if (enableImageLazyLoading && 'loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img:not([loading])');
      images.forEach((img) => {
        if (img instanceof HTMLImageElement) {
          img.loading = 'lazy';
        }
      });
    }

    // Prefetch critical page resources
    if (enablePrefetching) {
      const defaultPrefetchLinks = ['/products', '/contact', '/testimonials', '/faq'];
      const linksToFetch = prefetchRoutes.length > 0 ? prefetchRoutes : defaultPrefetchLinks;

      linksToFetch.forEach(link => {
        const linkElement = document.createElement('link');
        linkElement.rel = 'prefetch';
        linkElement.href = link;
        document.head.appendChild(linkElement);
      });
    }

    // Add resource hints for external domains
    if (enableCriticalResourceHints) {
      const resourceHints = [
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'preconnect', href: 'https://www.google-analytics.com' }
      ];

      resourceHints.forEach(hint => {
        const existing = document.querySelector(`link[href="${hint.href}"]`);
        if (!existing) {
          const linkElement = document.createElement('link');
          linkElement.rel = hint.rel;
          linkElement.href = hint.href;
          if (hint.rel === 'preconnect') {
            linkElement.crossOrigin = '';
          }
          document.head.appendChild(linkElement);
        }
      });
    }

    // Intersection Observer for animations
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [enableImageLazyLoading, enablePrefetching, enableCriticalResourceHints, preloadImages, prefetchRoutes]);

  // Performance monitoring
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'largest-contentful-paint') {
            console.log('LCP:', entry.startTime);
            // Track to analytics if needed
            if ((window as any).gtag) {
              (window as any).gtag('event', 'web_vitals', {
                metric_name: 'LCP',
                metric_value: Math.round(entry.startTime),
                metric_delta: Math.round(entry.startTime)
              });
            }
          }
        });
      });

      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observation not supported');
      }

      return () => {
        lcpObserver.disconnect();
      };
    }
  }, []);
};
