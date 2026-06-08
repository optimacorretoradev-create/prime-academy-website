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

console.log('\n════════════════════════════════════════════════════════');
console.log('✅ TESTE COMPLETO: GALERIA E CURSOS');
console.log('════════════════════════════════════════════════════════\n');

async function testGalleryAndCourses() {
  const headers = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED',
  };

  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    headers['Authorization'] = formattedToken;
  }

  // Test Gallery
  console.log('📸 GALERIA:\n');
  
  const galleryQuery = `
    query GetGalleryImages {
      galleryImages {
        id
        caption
        category
        destaque
        createdAt
        imageUrl { url handle }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: galleryQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('❌ Erros:', json.errors.map(e => e.message).join(', '));
    } else {
      const images = json.data?.galleryImages || [];
      console.log(`✓ Total de imagens: ${images.length}`);
      
      if (images.length > 0) {
        console.log('  Primeiras 3 imagens:');
        images.slice(0, 3).forEach((img, i) => {
          console.log(`    ${i + 1}. ${img.caption || 'Sem título'}`);
          console.log(`       Categoria: ${img.category || 'N/A'}`);
          console.log(`       Destaque: ${img.destaque ? 'SIM' : 'NÃO'}`);
          console.log(`       URL: ${img.imageUrl?.url ? '✓ Tem URL' : '✗ Sem URL'}`);
        });
      } else {
        console.log('⚠️  Nenhuma imagem na galeria!');
        console.log('    → Adicione imagens no Hygraph em: https://hygraph.com/content');
      }
    }
  } catch (error) {
    console.log('✗ Erro:', error.message);
  }

  console.log('\n────────────────────────────────────────────────────────\n');

  // Test Courses
  console.log('📚 CURSOS:\n');
  
  const coursesQuery = `
    query GetCursos {
      cursos {
        id
        name
        description
        duration
        price
        level
        categoria
        image { url }
      }
    }
  `;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: coursesQuery })
    });

    const json = await response.json();

    if (json.errors) {
      console.log('❌ Erros:', json.errors.map(e => e.message).join(', '));
    } else {
      const courses = json.data?.cursos || [];
      console.log(`✓ Total de cursos: ${courses.length}`);
      
      if (courses.length > 0) {
        console.log('  Primeiros 3 cursos:');
        courses.slice(0, 3).forEach((course, i) => {
          console.log(`    ${i + 1}. ${course.name}`);
          console.log(`       Categoria: ${course.categoria || 'N/A'}`);
          console.log(`       Preço: ${course.price}`);
          console.log(`       Imagem: ${course.image?.url ? '✓ Tem imagem' : '✗ Sem imagem'}`);
        });
      } else {
        console.log('⚠️  Nenhum curso na galeria!');
        console.log('    → Adicione cursos no Hygraph em: https://hygraph.com/content');
      }
    }
  } catch (error) {
    console.log('✗ Erro:', error.message);
  }

  console.log('\n════════════════════════════════════════════════════════');
  console.log('💡 PRÓXIMOS PASSOS:');
  console.log('════════════════════════════════════════════════════════\n');
  console.log('1️⃣  Se nenhuma imagem/curso aparece:');
  console.log('    • Aceda a https://hygraph.com/content');
  console.log('    • Adicione pelo menos 1 imagem e 1 curso');
  console.log('    • Clique em "PUBLISH" para cada item');
  console.log('');
  console.log('2️⃣  Se imagens/cursos existem mas não aparecem no site:');
  console.log('    • O cache pode estar antigo (máximo 5 minutos agora)');
  console.log('    • Ou revalidate: curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses"');
  console.log('');
  console.log('3️⃣  Para produção (primeacademy.ao):');
  console.log('    • Configure webhooks: veja HYGRAPH_CACHE_SETUP.md');
  console.log('    • Assim atualizações serão imediatas');
  console.log('\n════════════════════════════════════════════════════════\n');
}

testGalleryAndCourses().catch(console.error);
