const fs = require('fs');

function loadEnv() {
  const content = fs.readFileSync('.env.local', 'utf8');
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

console.log('\n═══════════════════════════════════════════');
console.log('🔍 VERIFICANDO RESPOSTA REAL DO HYGRAPH');
console.log('═══════════════════════════════════════════\n');

async function testFullResponse() {
  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
  };

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  // Query atual (pode ter problema com categoria)
  console.log('📚 RESPOSTA ATUAL DA QUERY DE CURSOS:\n');
  
  const currentQuery = `
    query GetCursos {
      cursos {
        id
        name
        description
        duration
        price
        level
        highlights
        categoria
        syllabus { html }
        image { url }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: currentQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('❌ ERROS NA QUERY:');
      json.errors.forEach(err => {
        console.log(`  • ${err.message}`);
        if (err.extensions) {
          console.log(`    Detalhes: ${JSON.stringify(err.extensions)}`);
        }
      });
    } else if (json.data?.cursos?.length > 0) {
      const primeiro = json.data.cursos[0];
      console.log('✓ Primeiro curso retornado:');
      console.log(JSON.stringify(primeiro, null, 2));
    }
  } catch (error) {
    console.log('✗ Erro:', error.message);
  }

  console.log('\n───────────────────────────────────────────\n');

  // Query corrigida com categoria { name }
  console.log('🔧 TESTANDO QUERY CORRIGIDA:\n');
  
  const correctedQuery = `
    query GetCursos {
      cursos {
        id
        name
        description
        duration
        price
        level
        highlights
        categoria {
          id
          name
        }
        syllabus { html }
        image { url }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: correctedQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('❌ ERROS NA QUERY CORRIGIDA:');
      json.errors.forEach(err => console.log(`  • ${err.message}`));
    } else if (json.data?.cursos?.length > 0) {
      const primeiro = json.data.cursos[0];
      console.log('✓ Primeiro curso (CORRIGIDO):');
      console.log(JSON.stringify(primeiro, null, 2));
    }
  } catch (error) {
    console.log('✗ Erro:', error.message);
  }

  console.log('\n═══════════════════════════════════════════');
}

testFullResponse().catch(console.error);
