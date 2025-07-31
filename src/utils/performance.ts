
// Performance monitoring utilities
export const measurePerformance = {
  // Measure page load times
  pageLoad: () => {
    if (typeof window !== 'undefined' && window.performance) {
      const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      return {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domContentLoadedEventStart - navigation.responseEnd,
        domComplete: navigation.loadEventStart - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        total: navigation.loadEventEnd - navigation.fetchStart
      };
    }
    return null;
  },

  // Measure component render times
  markStart: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-start`);
    }
  },

  markEnd: (name: string) => {
    if (typeof window !== 'undefined' && window.performance) {
      window.performance.mark(`${name}-end`);
      window.performance.measure(name, `${name}-start`, `${name}-end`);
      
      const measure = window.performance.getEntriesByName(name)[0];
      if (measure) {
        console.log(`Performance [${name}]: ${measure.duration.toFixed(2)}ms`);
      }
    }
  },

  // Lazy load heavy libraries
  loadHtml2Canvas: async () => {
    if (!window.html2canvas) {
      const module = await import('html2canvas');
      return module.default;
    }
    return window.html2canvas;
  }
};

// Web Vitals monitoring
export const trackWebVitals = () => {
  if (typeof window !== 'undefined') {
    // Track Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('LCP:', entry.startTime);
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // Track Interaction to Next Paint (INP) - Core Web Vitals 2024
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const inpEntry = entry as any;
        if (inpEntry.processingStart && inpEntry.processingEnd) {
          const inp = inpEntry.processingEnd - entry.startTime;
          console.log('INP:', inp);
          // Send to analytics if available
          if ((window as any).gtag) {
            (window as any).gtag('event', 'web_vitals', {
              metric_name: 'INP',
              metric_value: Math.round(inp)
            });
          }
        }
      }
    }).observe({ entryTypes: ['event'] });

    // Track Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const clsEntry = entry as any; // Type assertion for CLS specific properties
        if (clsEntry.hadRecentInput !== undefined && !clsEntry.hadRecentInput && clsEntry.value) {
          clsValue += clsEntry.value;
        }
      }
      console.log('CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }
};

declare global {
  interface Window {
    html2canvas?: any;
  }
}
