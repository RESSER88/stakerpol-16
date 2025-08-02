import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          serial_number: string
          slug?: string
        }
        Insert: {
          id?: string
          name: string
          serial_number: string
          slug?: string
        }
        Update: {
          id?: string
          name?: string
          serial_number?: string
          slug?: string
        }
      }
    }
  }
}

Deno.serve(async (req) => {
  const { method } = req

  if (method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const supabaseClient = createClient<Database>(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    console.log('Starting database migration to add slug field...')

    // Add slug column to products table
    const { error: addColumnError } = await supabaseClient.rpc('exec_sql', {
      sql: `
        -- Add slug column if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'products' 
            AND column_name = 'slug'
          ) THEN
            ALTER TABLE public.products ADD COLUMN slug TEXT;
            
            -- Add unique constraint
            ALTER TABLE public.products ADD CONSTRAINT products_slug_unique UNIQUE (slug);
            
            -- Create index for faster lookups
            CREATE INDEX idx_products_slug ON public.products(slug);
          END IF;
        END $$;
      `
    })

    if (addColumnError) {
      console.error('Error adding slug column:', addColumnError)
      return new Response(JSON.stringify({ error: 'Failed to add slug column' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate slugs for existing products
    const { data: products, error: fetchError } = await supabaseClient
      .from('products')
      .select('id, name, serial_number, slug')

    if (fetchError) {
      console.error('Error fetching products:', fetchError)
      return new Response(JSON.stringify({ error: 'Failed to fetch products' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`Found ${products?.length || 0} products to process`)

    // Function to generate slug
    const generateSlug = (name: string, serialNumber: string): string => {
      const cleanText = (name + '-' + serialNumber)
        .toLowerCase()
        .replace(/[^a-z0-9\s\-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      
      return cleanText
    }

    // Update products without slugs
    const updates = []
    const existingSlugs = new Set()

    if (products) {
      for (const product of products) {
        if (!product.slug) {
          let baseSlug = generateSlug(product.name, product.serial_number)
          let finalSlug = baseSlug
          let counter = 1

          // Ensure uniqueness
          while (existingSlugs.has(finalSlug)) {
            finalSlug = `${baseSlug}-${counter}`
            counter++
          }

          existingSlugs.add(finalSlug)
          updates.push({
            id: product.id,
            slug: finalSlug
          })
        } else {
          existingSlugs.add(product.slug)
        }
      }
    }

    console.log(`Updating ${updates.length} products with new slugs`)

    // Batch update products
    for (const update of updates) {
      const { error: updateError } = await supabaseClient
        .from('products')
        .update({ slug: update.slug })
        .eq('id', update.id)

      if (updateError) {
        console.error(`Error updating product ${update.id}:`, updateError)
      } else {
        console.log(`Updated product ${update.id} with slug: ${update.slug}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Successfully added slug field and updated ${updates.length} products`,
      updatedProducts: updates.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Migration error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})