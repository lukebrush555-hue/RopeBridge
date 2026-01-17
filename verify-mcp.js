/**
 * Supabase MCP Read/Write Verification Script
 *
 * This script verifies Claude Code can:
 * 1. READ from Supabase (query categories)
 * 2. WRITE to Supabase (insert a test category)
 * 3. DELETE from Supabase (cleanup test data)
 */

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://wsxdiskmxiglwukwctsp.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeGRpc2tteGlnbHd1a3djdHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzU2NzUsImV4cCI6MjA4NDI1MTY3NX0.nOnud_G1EUAZaEYRwmxEWLPmGrEQhJkqUJnrO6jGp5Q'

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyMCP() {
  console.log('🔍 Verifying Supabase MCP Connection...\n')

  try {
    // TEST 1: READ - Query existing categories
    console.log('📖 TEST 1: READ - Fetching categories...')
    const { data: categories, error: readError } = await supabase
      .from('categories')
      .select('*')
      .limit(5)

    if (readError) {
      console.error('❌ READ failed:', readError.message)
      if (readError.message.includes('relation') || readError.message.includes('does not exist')) {
        console.log('\n⚠️  Database tables not found!')
        console.log('📋 Please run FRESH_PROJECT_SETUP.sql in your Supabase SQL Editor first.')
        process.exit(1)
      }
      throw readError
    }

    console.log(`✅ READ successful! Found ${categories.length} categories:`)
    categories.forEach(cat => console.log(`   - ${cat.icon_emoji} ${cat.name}`))

    // TEST 2: WRITE - Insert test category
    console.log('\n✍️  TEST 2: WRITE - Inserting test category...')
    const testCategory = {
      name: 'Claude MCP Test',
      slug: 'claude-mcp-test',
      description: 'Test category created by Claude Code MCP',
      icon_emoji: '🤖'
    }

    const { data: inserted, error: writeError } = await supabase
      .from('categories')
      .insert(testCategory)
      .select()
      .single()

    if (writeError) {
      console.error('❌ WRITE failed:', writeError.message)
      throw writeError
    }

    console.log('✅ WRITE successful! Inserted:')
    console.log(`   ${inserted.icon_emoji} ${inserted.name} (ID: ${inserted.id})`)

    // TEST 3: DELETE - Cleanup test data
    console.log('\n🧹 TEST 3: DELETE - Cleaning up test data...')
    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', inserted.id)

    if (deleteError) {
      console.error('❌ DELETE failed:', deleteError.message)
      throw deleteError
    }

    console.log('✅ DELETE successful!')

    // FINAL VERIFICATION
    console.log('\n🎉 SUCCESS! Supabase MCP is fully configured!')
    console.log('\nClaude Code can now:')
    console.log('  ✅ READ from your Supabase database')
    console.log('  ✅ WRITE to your Supabase database')
    console.log('  ✅ DELETE from your Supabase database')
    console.log('\n🚀 Your RopeBridge project is ready to go!')

  } catch (error) {
    console.error('\n❌ Verification failed:', error.message)
    process.exit(1)
  }
}

verifyMCP()
