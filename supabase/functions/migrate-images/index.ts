
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting image migration process...')

    // Fetch all product images with base64 data
    const { data: images, error: fetchError } = await supabaseClient
      .from('product_images')
      .select('*')
      .like('image_url', 'data:%')

    if (fetchError) {
      console.error('Error fetching images:', fetchError)
      throw fetchError
    }

    console.log(`Found ${images?.length || 0} base64 images to migrate`)

    const migrationResults = []

    // Helper function for exponential backoff delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Enhanced migration with 6-try retry loop and exponential backoff
    const migrateImageWithRetry = async (image: any, retryCount = 0): Promise<any> => {
      const maxRetries = 6
      const backoffDelays = [1000, 2000, 4000, 8000, 16000, 32000] // 1s, 2s, 4s, 8s, 16s, 32s
      
      try {
        console.log(`Processing image ${image.id} (attempt ${retryCount + 1}/${maxRetries})...`)

        // Extract base64 data and convert to blob
        const base64Data = image.image_url.split(',')[1]
        const mimeType = image.image_url.match(/data:([^;]+)/)?.[1] || 'image/webp'
        
        // Convert base64 to bytes
        const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))
        
        // Generate unique filename with UUID and timestamp to avoid collisions
        const uuid = crypto.randomUUID()
        const timestamp = new Date().getTime()
        const extension = mimeType.split('/')[1] || 'webp'
        const filename = `product-${image.product_id}-${uuid}-${timestamp}.${extension}`

        // Upload to Supabase Storage with retry logic
        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('product-images')
          .upload(filename, bytes, {
            contentType: mimeType,
            cacheControl: '3600',
            upsert: true
          })

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = supabaseClient.storage
          .from('product-images')
          .getPublicUrl(filename)

        // Update database with new URL
        const { error: updateError } = await supabaseClient
          .from('product_images')
          .update({ 
            image_url: publicUrl,
            migrated_at: new Date().toISOString(),
            retry_count: retryCount
          })
          .eq('id', image.id)

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`)
        }

        console.log(`✅ Successfully migrated image ${image.id} to ${publicUrl} on attempt ${retryCount + 1}`)
        return {
          imageId: image.id,
          status: 'success',
          newUrl: publicUrl,
          attempts: retryCount + 1
        }

      } catch (error) {
        console.error(`❌ Attempt ${retryCount + 1} failed for image ${image.id}:`, error.message)
        
        if (retryCount < maxRetries - 1) {
          const delayMs = backoffDelays[retryCount]
          console.log(`⏳ Retrying in ${delayMs}ms (attempt ${retryCount + 2}/${maxRetries})...`)
          await delay(delayMs)
          return migrateImageWithRetry(image, retryCount + 1)
        } else {
          console.error(`🚨 All ${maxRetries} attempts failed for image ${image.id}. Marking for manual review.`)
          
          // Mark image as failed after all retries
          await supabaseClient
            .from('product_images')
            .update({ 
              migration_failed: true,
              retry_count: maxRetries,
              last_error: error.message,
              failed_at: new Date().toISOString()
            })
            .eq('id', image.id)

          return {
            imageId: image.id,
            status: 'error',
            error: `Failed after ${maxRetries} attempts: ${error.message}`,
            attempts: maxRetries
          }
        }
      }
    }

    // Process images with enhanced retry logic
    for (const image of images || []) {
      const result = await migrateImageWithRetry(image)
      migrationResults.push(result)
    }

    const successCount = migrationResults.filter(r => r.status === 'success').length
    const errorCount = migrationResults.filter(r => r.status === 'error').length

    console.log(`Migration completed: ${successCount} success, ${errorCount} errors`)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Migration completed: ${successCount} images migrated successfully, ${errorCount} errors`,
        results: migrationResults,
        stats: {
          total: migrationResults.length,
          success: successCount,
          errors: errorCount
        }
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Migration error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})
