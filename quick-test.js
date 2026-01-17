// Quick inline test - just copy and paste this entire file into your terminal with: node quick-test.js

const https = require('https');

const url = 'https://wsxdiskmxiglwukwctsp.supabase.co/rest/v1/categories?select=*&limit=5';
const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndzeGRpc2tteGlnbHd1a3djdHNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg2NzU2NzUsImV4cCI6MjA4NDI1MTY3NX0.nOnud_G1EUAZaEYRwmxEWLPmGrEQhJkqUJnrO6jGp5Q';

console.log('🔍 Testing Supabase connection...\n');

const options = {
  headers: {
    'apikey': apiKey,
    'Authorization': `Bearer ${apiKey}`
  }
};

https.get(url, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    if (res.statusCode === 200) {
      const categories = JSON.parse(data);
      if (categories.length > 0) {
        console.log('✅ SUCCESS! Database is initialized.');
        console.log(`📖 Found ${categories.length} categories:\n`);
        categories.forEach(cat => {
          console.log(`   ${cat.icon_emoji} ${cat.name}`);
        });
        console.log('\n🎉 Supabase MCP can READ from your database!');
      } else {
        console.log('⚠️  Database is empty. Run FRESH_PROJECT_SETUP.sql first.');
      }
    } else if (res.statusCode === 404) {
      console.log('❌ Tables not found!');
      console.log('📋 You need to run FRESH_PROJECT_SETUP.sql in Supabase SQL Editor first.');
    } else {
      console.log(`❌ Error: HTTP ${res.statusCode}`);
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.error('❌ Connection failed:', err.message);
});
