#!/bin/bash
# 🚀 Revalidar conteúdo Hygraph instantaneamente
# Use este script sempre que adicionar conteúdo no Hygraph

ENVIRONMENT="${1:-development}"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🔄 Revalidando PRODUÇÃO (primeacademy.ao)..."
    # Substitua o token com o seu token real do Vercel
    curl -X POST "https://primeacademy.ao/api/revalidate?paths=gallery,courses,dashboard&token=YOUR_SECRET_TOKEN" \
        -H "Content-Type: application/json" \
        -w "\nStatus: %{http_code}\n"
else
    echo "🔄 Revalidando LOCAL (localhost:3000)..."
    curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses,dashboard" \
        -H "Content-Type: application/json" \
        -w "\nStatus: %{http_code}\n"
fi

echo ""
echo "✅ Conteúdo revalidado!"
echo "   A próxima vez que você visitar o site, verá o novo conteúdo imediatamente."
