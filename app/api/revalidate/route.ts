import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')

  // Segurança: Verifique se o segredo enviado é o mesmo que você configurou
  if (secret !== process.env.MY_SECRET_TOKEN) {
    return NextResponse.json({ message: 'Token inválido' }, { status: 401 })
  }

  // Caminhos que devem ser atualizados
  revalidatePath('/gallery')
  revalidatePath('/courses')

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
