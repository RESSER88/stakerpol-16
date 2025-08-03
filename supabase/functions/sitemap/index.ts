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
    console.log('Generating sitemap.xml...');
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Fetch all products with images
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        id, 
        name, 
        updated_at,
        product_images (
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

    console.log(`✅ Found ${products?.length || 0} products for sitemap`);

    // Generate sitemap XML
    const baseUrl = 'https://stakerpol.pl';
    const now = new Date().toISOString();
    
    // Static pages
    const staticPages = [
      { url: '/', lastmod: now, changefreq: 'weekly', priority: '1.0' },
      { url: '/products', lastmod: now, changefreq: 'daily', priority: '0.9' },
      { url: '/contact', lastmod: now, changefreq: 'monthly', priority: '0.8' },
      { url: '/testimonials', lastmod: now, changefreq: 'monthly', priority: '0.7' },
    ];

    // Product pages with images
    const productPages = (products || []).map(product => {
      const productImages = product.product_images
        ?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
        ?.slice(0, 5) // Limit to 5 images per product
        ?.map(img => ({
          url: img.image_url,
          caption: img.alt_text || `${product.name} - wózek widłowy elektryczny Stakerpol`
        })) || [];
      
      // Generate SEO-friendly slug from name
      const slug = product.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      return {
        url: `/products/${slug}`,
        lastmod: product.updated_at || now,
        changefreq: 'weekly',
        priority: '0.8',
        title: product.name,
        images: productImages
      };
    });

    const allPages = [...staticPages, ...productPages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${allPages.map(page => {
  let imageElements = '';
  
  // Add image elements for product pages
  if (page.url.startsWith('/products/') && page.images && page.images.length > 0) {
    imageElements = page.images.map(img => `
    <image:image>
      <image:loc>${img.url}</image:loc>
      <image:caption>${img.caption || `Wózek widłowy elektryczny - ${page.title || 'Stakerpol'}`}</image:caption>
    </image:image>`).join('');
  }
  
  return `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${imageElements}
  </url>`;
}).join('\n')}
</urlset>`;

    console.log(`✅ Generated sitemap with ${allPages.length} URLs`);

    return new Response(sitemapXml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});