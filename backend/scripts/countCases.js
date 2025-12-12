import https from 'https';

https.get('https://askjury-production.up.railway.app/api/cases?limit=100&sort=new', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.cases) {
        console.log(`✅ Total cases: ${json.cases.length}`);
        if (json.cases.length > 0) {
          console.log(`\nRecent cases:`);
          json.cases.slice(0, 10).forEach((c, i) => {
            console.log(`${i + 1}. "${c.title.substr(0, 65)}..." - by ${c.user.username}`);
          });
        }
      } else {
        console.log('❌ Error:', json.error || 'Unknown error');
      }
    } catch (e) {
      console.log('Parse error:', e.message);
      console.log('Data length:', data.length);
    }
    process.exit(0);
  });
});
