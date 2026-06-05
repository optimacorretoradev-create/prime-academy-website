const fs = require('fs');

function loadEnv() {
  const content = fs.readFileSync('c:\\WebProjectos\\prime-academy-website\\.env.local', 'utf8');
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let value = (match[2] || '').trim().replace(/^["']|["']$/g, '');
      process.env[match[1]] = value;
    }
  });
}

loadEnv();

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_API_TOKEN || process.env.HYGRAPH_PROD_AUTH_TOKEN;

const query = `
  query {
    __type(name: "Curso") {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`;

async function run() {
  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
    'Authorization': token?.startsWith('Bearer ') ? token : `Bearer ${token}`
  };

  const response = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify({ query }) });
  const json = await response.json();

  if (json.errors) {

    return;
  }


  json.data.__type.fields.forEach(field => {

  });
}

run().catch(console.error);
