
async function testApi() {
  const baseUrl = 'http://localhost:5174';
  const endpoints = [
    '/api/public/content?type=program',
    '/api/public/registrations',
  ];

  console.log('Testing Pegasus API...');

  for (const endpoint of endpoints) {
    try {
      console.log(`\nChecking ${endpoint}...`);
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: endpoint.includes('registrations') ? 'POST' : 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: endpoint.includes('registrations') ? JSON.stringify({ data: { playerName: 'Test' } }) : undefined,
      });
      console.log(`Status: ${res.status} ${res.statusText}`);
      const text = await res.text();
      console.log(`Response: ${text.slice(0, 100)}...`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testApi();
