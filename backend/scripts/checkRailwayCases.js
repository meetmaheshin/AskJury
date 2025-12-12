import https from 'https';

const url = 'https://askjury-production.up.railway.app/api/cases?limit=100';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(`\n📊 Total cases on Railway: ${json.cases.length}\n`);

      if (json.cases.length > 0) {
        console.log('Recent cases:');
        json.cases.slice(0, 10).forEach((c, i) => {
          console.log(`${i + 1}. ${c.title.substring(0, 70)}...`);
        });
      }

      process.exit(0);
    } catch (error) {
      console.error('Error parsing response:', error.message);
      console.log('Response:', data);
      process.exit(1);
    }
  });
}).on('error', (error) => {
  console.error('Request error:', error.message);
  process.exit(1);
});
