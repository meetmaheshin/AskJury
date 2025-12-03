// Quick script to check what's running on Railway backend
import https from 'https';

const backendUrl = 'https://askjury-production.up.railway.app';

console.log('🔍 Checking Railway Backend...\n');

// Test 1: Check /health endpoint
console.log('Test 1: Checking /health endpoint');
https.get(`${backendUrl}/health`, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Response (first 200 chars): ${data.substring(0, 200)}`);

    if (res.headers['content-type']?.includes('application/json')) {
      console.log('✅ Backend is serving API (JSON response)');
    } else if (res.headers['content-type']?.includes('text/html')) {
      console.log('❌ Backend is serving HTML (frontend UI) - WRONG!');
    }
    console.log('\n---\n');

    // Test 2: Check /api/health endpoint
    console.log('Test 2: Checking /api/health endpoint');
    https.get(`${backendUrl}/api/health`, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        console.log(`Status: ${res2.statusCode}`);
        console.log(`Content-Type: ${res2.headers['content-type']}`);
        console.log(`Response: ${data2.substring(0, 200)}`);

        if (res2.headers['content-type']?.includes('application/json')) {
          console.log('✅ API endpoint working correctly');
          try {
            const json = JSON.parse(data2);
            console.log('✅ Valid JSON:', json);
          } catch (e) {
            console.log('❌ Invalid JSON response');
          }
        } else {
          console.log('❌ Not returning JSON');
        }
      });
    }).on('error', err => console.error('Error:', err.message));
  });
}).on('error', err => console.error('Error:', err.message));
