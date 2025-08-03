import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOMetrics {
  pageLoadTime: number;
  redirectCount: number;
  errorCount: number;
  slug404Errors: string[];
  uuid404Errors: string[];
  lastError?: string;
  performanceScore: number;
}

interface ErrorLog {
  url: string;
  error: string;
  timestamp: string;
  type: 'slug' | 'uuid' | 'general';
}

export const useSEOMonitoring = () => {
  const [metrics, setMetrics] = useState<SEOMetrics>({
    pageLoadTime: 0,
    redirectCount: 0,
    errorCount: 0,
    slug404Errors: [],
    uuid404Errors: [],
    performanceScore: 100
  });
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Monitor page load performance
    const startTime = performance.now();
    
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({
        ...prev,
        pageLoadTime: loadTime,
        performanceScore: calculatePerformanceScore(loadTime)
      }));
    };

    window.addEventListener('load', handleLoad);
    return () => window.removeEventListener('load', handleLoad);
  }, [location.pathname]);

  const calculatePerformanceScore = (loadTime: number): number => {
    // Performance scoring: < 1s = 100, < 2s = 90, < 3s = 80, etc.
    if (loadTime < 1000) return 100;
    if (loadTime < 2000) return 90;
    if (loadTime < 3000) return 80;
    if (loadTime < 4000) return 70;
    return Math.max(50, 100 - Math.floor(loadTime / 100));
  };

  const logError = (url: string, error: string, type: 'slug' | 'uuid' | 'general' = 'general') => {
    const errorLog: ErrorLog = {
      url,
      error,
      timestamp: new Date().toISOString(),
      type
    };

    setErrorLogs(prev => [...prev.slice(-99), errorLog]); // Keep last 100 errors
    
    setMetrics(prev => {
      const newMetrics = {
        ...prev,
        errorCount: prev.errorCount + 1,
        lastError: error
      };

      if (type === 'slug' && error.includes('404')) {
        newMetrics.slug404Errors = [...prev.slug404Errors.slice(-49), url]; // Keep last 50
      } else if (type === 'uuid' && error.includes('404')) {
        newMetrics.uuid404Errors = [...prev.uuid404Errors.slice(-49), url]; // Keep last 50
      }

      return newMetrics;
    });

    // Log to console for debugging
    console.error(`SEO Monitoring - ${type.toUpperCase()} Error:`, {
      url,
      error,
      timestamp: errorLog.timestamp
    });
  };

  const logRedirect = (from: string, to: string) => {
    setMetrics(prev => ({
      ...prev,
      redirectCount: prev.redirectCount + 1
    }));

    console.log('SEO Monitoring - Redirect logged:', {
      from,
      to,
      timestamp: new Date().toISOString()
    });
  };

  const getHealthReport = () => {
    const recent404s = errorLogs.filter(log => 
      log.error.includes('404') && 
      new Date(log.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24h
    ).length;

    const healthScore = Math.max(0, 100 - (recent404s * 5) - (metrics.errorCount * 2));

    return {
      healthScore,
      recent404s,
      totalErrors: metrics.errorCount,
      averageLoadTime: metrics.pageLoadTime,
      performanceScore: metrics.performanceScore,
      redirectCount: metrics.redirectCount,
      recommendations: generateRecommendations(healthScore, recent404s, metrics.performanceScore)
    };
  };

  const generateRecommendations = (healthScore: number, recent404s: number, performanceScore: number): string[] => {
    const recommendations: string[] = [];

    if (healthScore < 80) {
      recommendations.push('System health is below optimal. Check error logs.');
    }

    if (recent404s > 10) {
      recommendations.push('High number of 404 errors detected. Review URL structure.');
    }

    if (performanceScore < 70) {
      recommendations.push('Page load performance is slow. Consider image optimization.');
    }

    if (metrics.slug404Errors.length > 5) {
      recommendations.push('Multiple slug-based 404 errors. Check slug generation.');
    }

    if (metrics.redirectCount > 100) {
      recommendations.push('High redirect count. Consider direct slug implementation.');
    }

    return recommendations;
  };

  const clearLogs = () => {
    setErrorLogs([]);
    setMetrics(prev => ({
      ...prev,
      errorCount: 0,
      slug404Errors: [],
      uuid404Errors: [],
      lastError: undefined
    }));
  };

  return {
    metrics,
    errorLogs,
    logError,
    logRedirect,
    getHealthReport,
    clearLogs
  };
};