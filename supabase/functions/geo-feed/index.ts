import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating GEO feed...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch all products with images in single query
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        *,
        product_images (
          id,
          image_url,
          alt_text,
          display_order
        )
      `)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }

    console.log(`✅ Found ${products?.length || 0} products for GEO feed`);

    const baseUrl = 'https://stakerpol.pl';
    const now = new Date().toISOString();

    // Application areas for AI understanding
    const applicationAreas = [
      "Magazyny i centra dystrybucyjne",
      "Zakłady produkcyjne", 
      "Handel detaliczny i supermarkety",
      "Gospodarstwa rolne",
      "Magazyny wysokiego składowania",
      "Logistyka magazynowa",
      "Zakłady przemysłowe",
      "Hurtownie i hipermarkety"
    ];
    
    // Generate AI-optimized Schema.org Product data
    const geoFeed = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Stakerpol - Profesjonalne Wózki Widłowe Elektryczne",
      "description": "Kompleksowa oferta wózków widłowych elektrycznych (akumulatorowych) - sprzedaż, wynajem, serwis. Specjalizacja w obsłudze magazynów, zakładów produkcyjnych, centrów dystrybucyjnych i logistycznych. Wózki paletowe, wysokiego składowania, reach trucki.",
      "url": `${baseUrl}/products`,
      "dateModified": now,
      "publisher": {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        "name": "Stakerpol",
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/lovable-uploads/cba7623d-e272-43d2-9cb1-c4864cb74fde.png`
        },
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "PL",
          "addressLocality": "Poznań"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+48-61-847-98-07",
          "contactType": "sales"
        }
      },
      "numberOfItems": products?.length || 0,
      "itemListElement": (products || []).map((product, index) => {
        const productImages = product.product_images
          ?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
          ?.map(img => ({
            "@type": "ImageObject",
            "url": img.image_url,
            "description": img.alt_text || `${product.name} - wózek widłowy elektryczny`
          })) || [];

        return {
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Product",
            "@id": `${baseUrl}/products/${product.id}`,
            "name": product.name,
            "description": product.detailed_description || product.short_description || `Wózek widłowy elektryczny ${product.name}`,
            "url": `${baseUrl}/products/${product.id}`,
            "image": productImages.length > 0 ? productImages : (product.image_url ? [{
              "@type": "ImageObject",
              "url": product.image_url,
              "description": product.name
            }] : []),
            "brand": {
              "@type": "Brand",
              "name": "Stakerpol"
            },
            "model": product.name,
            "serialNumber": product.serial_number,
            "productID": product.serial_number,
            "gtin": product.serial_number,
            "category": "Wózki widłowe elektryczne",
            "fuelType": "Electric",
            "vehicleEngine": {
              "@type": "EngineSpecification",
              "fuelType": "Electric"
            },
            "applicationArea": applicationAreas,
            "condition": product.condition === "używany" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
            "additionalProperty": [
              ...(product.lift_height ? [{
                "@type": "PropertyValue",
                "name": "Wysokość podnoszenia",
                "value": `${product.lift_height} mm`,
                "unitCode": "MMT"
              }] : []),
              ...(product.lift_capacity_initial ? [{
                "@type": "PropertyValue", 
                "name": "Udźwig początkowy",
                "value": `${product.lift_capacity_initial} kg`,
                "unitCode": "KGM"
              }] : []),
              ...(product.lift_capacity_mast ? [{
                "@type": "PropertyValue", 
                "name": "Udźwig na maszt",
                "value": `${product.lift_capacity_mast} kg`,
                "unitCode": "KGM"
              }] : []),
              ...(product.free_lift ? [{
                "@type": "PropertyValue", 
                "name": "Wolny skok",
                "value": `${product.free_lift} mm`,
                "unitCode": "MMT"
              }] : []),
              ...(product.production_year ? [{
                "@type": "PropertyValue",
                "name": "Rok produkcji", 
                "value": product.production_year.toString()
              }] : []),
              ...(product.working_hours ? [{
                "@type": "PropertyValue",
                "name": "Motogodziny",
                "value": `${product.working_hours} h`
              }] : []),
              ...(product.drive_type ? [{
                "@type": "PropertyValue",
                "name": "Typ napędu",
                "value": product.drive_type
              }] : []),
              ...(product.mast ? [{
                "@type": "PropertyValue",
                "name": "Maszt",
                "value": product.mast
              }] : []),
              ...(product.battery ? [{
                "@type": "PropertyValue",
                "name": "Bateria",
                "value": product.battery
              }] : []),
              ...(product.dimensions ? [{
                "@type": "PropertyValue",
                "name": "Wymiary",
                "value": product.dimensions
              }] : [])
            ],
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "PLN",
              "priceSpecification": {
                "@type": "PriceSpecification",
                "priceCurrency": "PLN",
                "valueAddedTaxIncluded": true
              },
              "seller": {
                "@type": "Organization",
                "name": "Stakerpol",
                "@id": `${baseUrl}/#organization`
              },
              "itemCondition": product.condition === "używany" ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition"
            }
          }
        };
      })
    };

    console.log(`✅ Generated GEO feed with ${geoFeed.numberOfItems} products`);

    return new Response(JSON.stringify(geoFeed, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/ld+json',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('GEO feed generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate GEO feed' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});