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

    // Fetch all products
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, updated_at')
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

    // Product pages
    const productPages = (products || []).map(product => ({
      url: `/products/${product.id}`,
      lastmod: product.updated_at || now,
      changefreq: 'weekly',
      priority: '0.8'
    }));

    const allPages = [...staticPages, ...productPages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
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