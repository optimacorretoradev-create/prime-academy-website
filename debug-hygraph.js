const fs = require('fs');

// Load environment variables
function loadEnv() {
  try {
    const content = fs.readFileSync('.env.local', 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let value = (match[2] || '').trim().replace(/^["']|["']$/g, '');
        process.env[match[1]] = value;
      }
    });
    console.log('✓ Variáveis de ambiente carregadas');
  } catch (error) {
    console.error('✗ Erro ao carregar .env.local:', error.message);
  }
}

loadEnv();

const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const token = process.env.HYGRAPH_API_TOKEN || process.env.HYGRAPH_PROD_AUTH_TOKEN;

console.log('\n═══════════════════════════════════════════');
console.log('🔍 DIAGNÓSTICO HYGRAPH');
console.log('═══════════════════════════════════════════\n');

// 1. Check configuration
console.log('📋 CONFIGURAÇÃO:');
console.log('  Endpoint:', endpoint ? '✓' : '✗ AUSENTE');
console.log('  Token:', token ? '✓ Configurado' : '✗ AUSENTE');
console.log('');

if (!endpoint) {
  console.error('✗ ERRO: Endpoint não configurado!');
  process.exit(1);
}

// 2. Test connection
async function testConnection() {
  console.log('🔗 TESTANDO CONEXÃO:');
  
  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
  };

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: '{ __typename }'
      })
    });

    console.log(`  Status: ${response.status}`);
    const json = await response.json();
    
    if (json.errors) {
      console.error('  ✗ Erros GraphQL:', json.errors);
      return false;
    }
    
    console.log('  ✓ Conexão bem-sucedida\n');
    return true;
  } catch (error) {
    console.error('  ✗ Erro de conexão:', error.message, '\n');
    return false;
  }
}

// 3. Get schema
async function getSchema() {
  console.log('📊 SCHEMA HYGRAPH:\n');
  
  const schemaQuery = `
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

  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
  };

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: schemaQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.error('✗ Erro ao obter schema:', json.errors);
      return null;
    }

    if (!json.data?.__type) {
      console.log('⚠️  Tipo "Curso" não encontrado no schema');
      return null;
    }

    console.log('  Campos disponíveis em "Curso":');
    json.data.__type.fields.forEach(field => {
      const typeName = field.type.ofType?.name || field.type.name;
      console.log(`    • ${field.name}: ${typeName}`);
    });
    console.log('');

    return json.data.__type.fields;
  } catch (error) {
    console.error('✗ Erro:', error.message);
    return null;
  }
}

// 4. Test queries
async function testQueries() {
  console.log('🧪 TESTANDO QUERIES:\n');

  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
  };

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  // Test Cursos
  console.log('  1. Query GET_CURSOS:');
  const getCursosQuery = `
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
      body: JSON.stringify({ query: getCursosQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('    ✗ Erros:', json.errors.map(e => e.message).join(', '));
    } else {
      const count = json.data?.cursos?.length || 0;
      console.log(`    ✓ Retornou ${count} cursos`);
    }
  } catch (error) {
    console.log('    ✗ Erro:', error.message);
  }

  console.log('');
  console.log('  2. Query GET_GALLERY_IMAGES:');
  const getGalleryQuery = `
    query GetGalleryImages {
      galleryImages {
        id
        imageUrl { url handle }
        caption
        category
        destaque
        createdAt
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: getGalleryQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('    ✗ Erros:', json.errors.map(e => e.message).join(', '));
    } else {
      const count = json.data?.galleryImages?.length || 0;
      console.log(`    ✓ Retornou ${count} imagens`);
    }
  } catch (error) {
    console.log('    ✗ Erro:', error.message);
  }

  console.log('');
}

// Run diagnostics
async function runDiagnostics() {
  const connected = await testConnection();
  
  if (connected) {
    await getSchema();
    await testQueries();
  }

  console.log('═══════════════════════════════════════════\n');
}

runDiagnostics().catch(console.error);
