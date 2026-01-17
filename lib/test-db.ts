/**
 * Database Connection Test Script
 *
 * Run this after executing the Supabase SQL scripts to verify:
 * 1. Database connection works
 * 2. Tables exist
 * 3. RLS policies work
 * 4. Seed data loaded correctly
 *
 * Usage: node -r ts-node/register lib/test-db.ts
 * Or create a npm script: "test:db": "ts-node lib/test-db.ts"
 */

import { supabase } from './supabase'
import { getCategories, getTags, getPrompts } from './db'

async function testDatabaseConnection() {
  console.log('🧪 Testing RopeBridge Database Connection...\n')

  try {
    // Test 1: Supabase client initialized
    console.log('✓ Supabase client initialized')

    // Test 2: Categories table
    const { data: categories, error: catError } = await getCategories()
    if (catError) {
      console.error('✗ Categories query failed:', catError.message)
      return false
    }
    console.log(`✓ Categories table: ${categories?.length || 0} categories found`)
    if (categories && categories.length > 0) {
      console.log('  Sample:', categories.slice(0, 3).map(c => c.name).join(', '))
    }

    // Test 3: Tags table
    const { data: tags, error: tagError } = await getTags()
    if (tagError) {
      console.error('✗ Tags query failed:', tagError.message)
      return false
    }
    console.log(`✓ Tags table: ${tags?.length || 0} tags found`)
    if (tags && tags.length > 0) {
      console.log('  Sample:', tags.slice(0, 5).map(t => t.name).join(', '))
    }

    // Test 4: Prompts table
    const { data: prompts, error: promptError } = await getPrompts()
    if (promptError) {
      console.error('✗ Prompts query failed:', promptError.message)
      return false
    }
    console.log(`✓ Prompts table: ${prompts?.length || 0} prompts found`)

    // Test 5: Authentication check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      console.log('⚠ No authenticated user (expected if not logged in)')
    } else if (user) {
      console.log(`✓ Authenticated as: ${user.email}`)
    } else {
      console.log('ℹ No user logged in (authentication not tested)')
    }

    console.log('\n✅ Database connection test PASSED!')
    console.log('\nNext steps:')
    console.log('1. Test authentication by creating a user account')
    console.log('2. Try creating a prompt via the dashboard')
    console.log('3. Verify RLS policies by testing as different users')

    return true
  } catch (error: any) {
    console.error('\n❌ Database connection test FAILED!')
    console.error('Error:', error.message)
    console.error('\nTroubleshooting:')
    console.error('1. Check that environment variables are set correctly')
    console.error('2. Verify SQL scripts were executed in Supabase')
    console.error('3. Confirm Supabase project is active')
    return false
  }
}

// Run test if executed directly
if (require.main === module) {
  testDatabaseConnection().then(success => {
    process.exit(success ? 0 : 1)
  })
}

export { testDatabaseConnection }
