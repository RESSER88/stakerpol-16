import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

interface RequestBody {
  platform: string;
  action: 'get_product' | 'log_post' | 'get_stats' | 'reset_platform';
  product_id?: string;
  post_id?: string;
  auto_reset?: boolean;
  debug?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log(`[${new Date().toISOString()}] Social media rotation request received`);
    
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const body: RequestBody = await req.json();
    console.log(`[${new Date().toISOString()}] Request body:`, JSON.stringify(body, null, 2));

    const { platform, action, product_id, post_id, auto_reset = true, debug = false } = body;

    if (!platform) {
      throw new Error('Platform parameter is required');
    }

    if (!action) {
      throw new Error('Action parameter is required');
    }

    let result;

    switch (action) {
      case 'get_product':
        console.log(`[${new Date().toISOString()}] Getting unposted product for platform: ${platform}`);
        
        // Use debug function if requested
        const functionName = debug ? 'get_unposted_product_debug' : 'get_unposted_product';
        
        const { data: productData, error: productError } = await supabase.rpc(
          functionName, 
          { 
            platform_name: platform,
            auto_reset: auto_reset 
          }
        );

        if (productError) {
          console.error(`[${new Date().toISOString()}] Product fetch error:`, productError);
          throw productError;
        }

        console.log(`[${new Date().toISOString()}] Product retrieved:`, productData ? 'YES' : 'NO');
        if (debug && productData?.debug_info) {
          console.log(`[${new Date().toISOString()}] Debug info:`, JSON.stringify(productData.debug_info, null, 2));
        }

        result = {
          success: true,
          action: 'get_product',
          platform,
          timestamp: new Date().toISOString(),
          data: productData,
          cache_bust: Date.now()
        };
        break;

      case 'log_post':
        if (!product_id) {
          throw new Error('product_id is required for log_post action');
        }

        console.log(`[${new Date().toISOString()}] Logging post for product: ${product_id}, platform: ${platform}`);

        const { data: logData, error: logError } = await supabase.rpc('log_social_post', {
          product_uuid: product_id,
          platform_name: platform,
          external_post_id: post_id || null
        });

        if (logError) {
          console.error(`[${new Date().toISOString()}] Log post error:`, logError);
          throw logError;
        }

        console.log(`[${new Date().toISOString()}] Post logged successfully:`, logData);

        result = {
          success: true,
          action: 'log_post',
          platform,
          product_id,
          timestamp: new Date().toISOString(),
          data: logData
        };
        break;

      case 'get_stats':
        console.log(`[${new Date().toISOString()}] Getting rotation stats`);

        const { data: statsData, error: statsError } = await supabase.rpc('get_rotation_stats');

        if (statsError) {
          console.error(`[${new Date().toISOString()}] Stats error:`, statsError);
          throw statsError;
        }

        console.log(`[${new Date().toISOString()}] Stats retrieved:`, statsData);

        result = {
          success: true,
          action: 'get_stats',
          timestamp: new Date().toISOString(),
          data: statsData
        };
        break;

      case 'reset_platform':
        console.log(`[${new Date().toISOString()}] Resetting platform: ${platform}`);

        const { data: resetData, error: resetError } = await supabase.rpc('reset_platform_rotation', {
          platform_name: platform
        });

        if (resetError) {
          console.error(`[${new Date().toISOString()}] Reset error:`, resetError);
          throw resetError;
        }

        console.log(`[${new Date().toISOString()}] Platform reset completed:`, resetData);

        result = {
          success: true,
          action: 'reset_platform',
          platform,
          timestamp: new Date().toISOString(),
          data: resetData
        };
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    console.log(`[${new Date().toISOString()}] Request completed successfully`);

    return new Response(JSON.stringify(result, null, 2), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`[${new Date().toISOString()}] Social media rotation error:`, error);
    
    const errorResponse = {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      cache_bust: Date.now()
    };

    return new Response(JSON.stringify(errorResponse, null, 2), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});