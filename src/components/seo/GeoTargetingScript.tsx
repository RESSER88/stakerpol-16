import { useEffect } from 'react';

interface GeoTargetingScriptProps {
  enabled?: boolean;
  onLocationDetected?: (location: { city: string; country: string; latitude: number; longitude: number }) => void;
}

const GeoTargetingScript = ({ enabled = true, onLocationDetected }: GeoTargetingScriptProps) => {
  useEffect(() => {
    if (!enabled) return;

    // Simple geolocation detection
    const detectLocation = async () => {
      try {
        // Try to get user's location using browser API
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              // Reverse geocoding to get city name
              try {
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pl`
                );
                const data = await response.json();
                
                const location = {
                  city: data.city || data.locality || 'Unknown',
                  country: data.countryName || 'Unknown',
                  latitude,
                  longitude
                };

                // Store location in localStorage for future use
                localStorage.setItem('user-location', JSON.stringify(location));
                
                // Call callback if provided
                if (onLocationDetected) {
                  onLocationDetected(location);
                }
                
                // Personalize content based on location
                personalizeContent(location);
                
              } catch (error) {
                console.log('Reverse geocoding failed:', error);
              }
            },
            (error) => {
              console.log('Geolocation error:', error);
              // Fallback to IP-based location
              fallbackToIPLocation();
            },
            { timeout: 10000, maximumAge: 600000 } // 10 minutes cache
          );
        } else {
          fallbackToIPLocation();
        }
      } catch (error) {
        console.log('Location detection failed:', error);
      }
    };

    const fallbackToIPLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        const location = {
          city: data.city || 'Unknown',
          country: data.country_name || 'Unknown',
          latitude: data.latitude || 0,
          longitude: data.longitude || 0
        };

        localStorage.setItem('user-location', JSON.stringify(location));
        
        if (onLocationDetected) {
          onLocationDetected(location);
        }
        
        personalizeContent(location);
      } catch (error) {
        console.log('IP location detection failed:', error);
      }
    };

    const personalizeContent = (location: any) => {
      // Add geo-specific classes to body
      document.body.classList.add(`geo-${location.city.toLowerCase().replace(/\s+/g, '-')}`);
      document.body.classList.add(`geo-${location.country.toLowerCase().replace(/\s+/g, '-')}`);
      
      // Create geo-specific meta tags
      const metaGeoRegion = document.createElement('meta');
      metaGeoRegion.name = 'geo.region';
      metaGeoRegion.content = location.country === 'Poland' ? 'PL' : location.country;
      document.head.appendChild(metaGeoRegion);
      
      const metaGeoPlacename = document.createElement('meta');
      metaGeoPlacename.name = 'geo.placename';
      metaGeoPlacename.content = location.city;
      document.head.appendChild(metaGeoPlacename);
      
      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('geo-location-detected', {
        detail: location
      }));
    };

    // Check if we already have location data
    const savedLocation = localStorage.getItem('user-location');
    if (savedLocation) {
      try {
        const location = JSON.parse(savedLocation);
        personalizeContent(location);
        if (onLocationDetected) {
          onLocationDetected(location);
        }
      } catch (error) {
        console.log('Failed to parse saved location:', error);
        detectLocation();
      }
    } else {
      detectLocation();
    }

    // Cleanup function
    return () => {
      // Remove geo-specific classes
      document.body.classList.forEach(className => {
        if (className.startsWith('geo-')) {
          document.body.classList.remove(className);
        }
      });
    };
  }, [enabled, onLocationDetected]);

  return null; // This component doesn't render anything
};

export default GeoTargetingScript;