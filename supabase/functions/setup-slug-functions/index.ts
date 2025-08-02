import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const { method } = req

  if (method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    console.log('Setting up database functions for slug support...')

    // Create function to get product by slug
    const createFunctionSQL = `
      -- Function to get product by slug
      CREATE OR REPLACE FUNCTION get_product_by_slug(slug_param TEXT)
      RETURNS TABLE (
        id TEXT,
        name TEXT,
        slug TEXT,
        image_url TEXT,
        short_description TEXT,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        production_year INTEGER,
        serial_number TEXT,
        lift_capacity_mast NUMERIC,
        lift_capacity_initial NUMERIC,
        working_hours NUMERIC,
        lift_height NUMERIC,
        min_height NUMERIC,
        initial_lift TEXT,
        battery TEXT,
        condition TEXT,
        drive_type TEXT,
        mast TEXT,
        free_lift NUMERIC,
        dimensions TEXT,
        wheels TEXT,
        foldable_platform TEXT,
        additional_options TEXT,
        detailed_description TEXT
      ) AS $$
      BEGIN
        RETURN QUERY
        SELECT 
          p.id,
          p.name,
          p.slug,
          p.image_url,
          p.short_description,
          p.created_at,
          p.updated_at,
          p.production_year,
          p.serial_number,
          p.lift_capacity_mast,
          p.lift_capacity_initial,
          p.working_hours,
          p.lift_height,
          p.min_height,
          p.initial_lift,
          p.battery,
          p.condition,
          p.drive_type,
          p.mast,
          p.free_lift,
          p.dimensions,
          p.wheels,
          p.foldable_platform,
          p.additional_options,
          p.detailed_description
        FROM products p
        WHERE p.slug = slug_param;
      END;
      $$ LANGUAGE plpgsql;
    `

    const { error: functionError } = await supabaseClient.rpc('exec_sql', {
      sql: createFunctionSQL
    })

    if (functionError) {
      console.error('Error creating function:', functionError)
      return new Response(JSON.stringify({ error: 'Failed to create function' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Successfully created database functions for slug support'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Setup error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})