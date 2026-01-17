/**
 * Quick Supabase Connection Test
 *
 * This script tests the Supabase connection by:
 * 1. Connecting to your Supabase project
 * 2. Inserting a test category
 * 3. Retrieving it to verify the connection works
 * 4. Cleaning up the test data
 *
 * Usage:
 * NEXT_PUBLIC_SUPABASE_URL=your-url NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key node test-supabase-connection.js
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing environment variables')
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🧪 Testing Supabase MCP connection...\n')

  try {
    // Test 1: Insert a test category
    console.log('📝 Step 1: Inserting test category...')
    const testCategory = {
      name: 'MCP Test Category',
      slug: 'mcp-test-category',
      description: 'This is a test category created to verify Supabase MCP connection',
      icon_emoji: '🧪'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
      .single()

    if (insertError) {
      throw new Error(`Insert failed: ${insertError.message}`)
    }

    console.log('✅ Test category inserted successfully!')
    console.log('   ID:', insertData.id)
    console.log('   Name:', insertData.name)
    console.log('   Emoji:', insertData.icon_emoji)

    // Test 2: Retrieve the category to verify
    console.log('\n📖 Step 2: Retrieving test category...')
    const { data: retrieveData, error: retrieveError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', 'mcp-test-category')
      .single()

    if (retrieveError) {
      throw new Error(`Retrieve failed: ${retrieveError.message}`)
    }

    console.log('✅ Test category retrieved successfully!')

    // Test 3: Clean up - delete the test category
    console.log('\n🧹 Step 3: Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', insertData.id)

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`)
    }

    console.log('✅ Test category deleted successfully!')

    // Final success message
    console.log('\n🎉 SUCCESS! Supabase MCP connection is working perfectly!')
    console.log('   - ✅ Insert operation')
    console.log('   - ✅ Select operation')
    console.log('   - ✅ Delete operation')

  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    process.exit(1)
  }
}

testConnection()
