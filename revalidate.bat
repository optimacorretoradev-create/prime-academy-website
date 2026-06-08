@echo off
REM 🚀 Revalidar conteúdo Hygraph instantaneamente
REM Use este script sempre que adicionar conteúdo no Hygraph

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=development

if "%ENVIRONMENT%"=="production" (
    echo 🔄 Revalidando PRODUÇÃO ^(primeacademy.ao^)...
    REM Substitua o token com o seu token real do Vercel
    curl -X POST "https://primeacademy.ao/api/revalidate?paths=gallery,courses,dashboard&token=YOUR_SECRET_TOKEN" ^
        -H "Content-Type: application/json"
) else (
    echo 🔄 Revalidando LOCAL ^(localhost:3000^)...
    curl -X POST "http://localhost:3000/api/revalidate?paths=gallery,courses,dashboard" ^
        -H "Content-Type: application/json"
)

echo.
echo ✅ Conteúdo revalidado!
echo    A próxima vez que você visitar o site, verá o novo conteúdo instantaneamente.
pause
