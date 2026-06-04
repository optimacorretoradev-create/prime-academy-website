import { NextRequest, NextResponse } from 'next/server'

// This is a placeholder API route for handling form submissions
// You can integrate with:
// 1. Resend (recommended for production)
// 2. EmailJS (client-side alternative)
// 3. Nodemailer (if you have SMTP access)

interface EnrollmentData {
  type: 'enrollment'
  name: string
  email: string
  phone: string
  course: string
  message?: string
}

interface ContactData {
  type: 'contact'
  name: string
  email: string
  phone?: string
  message: string
}

type FormData = EnrollmentData | ContactData

export async function POST(request: NextRequest) {
  try {
    const data: FormData = await request.json()

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Nome e email são obrigatórios' },
        { status: 400 }
      )
    }

    // Log the submission (for development)
    console.log('Form submission received:', data)

    // Option 1: Using Resend (recommended)
    // Uncomment and configure if you have RESEND_API_KEY set
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    
    await resend.emails.send({
      from: 'Prime Academy <noreply@primeacademy.ao>',
      to: ['geral@primeacademy.ao'],
      subject: data.type === 'enrollment' 
        ? `Nova Inscrição: ${(data as EnrollmentData).course}`
        : 'Nova Mensagem de Contacto',
      html: generateEmailHtml(data),
    })
    */

    // Option 2: Simulate success for development
    // In production, replace with actual email sending
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay

    return NextResponse.json({ 
      success: true, 
      message: data.type === 'enrollment' 
        ? 'Inscrição recebida com sucesso!' 
        : 'Mensagem enviada com sucesso!'
    })
  } catch (error) {
    console.error('Error processing form submission:', error)
    return NextResponse.json(
      { error: 'Erro ao processar o pedido. Tente novamente.' },
      { status: 500 }
    )
  }
}

// Helper function to generate email HTML
function generateEmailHtml(data: FormData): string {
  if (data.type === 'enrollment') {
    const enrollData = data as EnrollmentData
    return `
      <h2>Nova Inscrição na Prime Academy</h2>
      <p><strong>Nome:</strong> ${enrollData.name}</p>
      <p><strong>Email:</strong> ${enrollData.email}</p>
      <p><strong>Telefone:</strong> ${enrollData.phone}</p>
      <p><strong>Curso:</strong> ${enrollData.course}</p>
      ${enrollData.message ? `<p><strong>Mensagem:</strong> ${enrollData.message}</p>` : ''}
    `
  }

  const contactData = data as ContactData
  return `
    <h2>Nova Mensagem de Contacto</h2>
    <p><strong>Nome:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    ${contactData.phone ? `<p><strong>Telefone/WhatsApp:</strong> ${contactData.phone}</p>` : ''}
    <p><strong>Mensagem:</strong></p>
    <p>${contactData.message}</p>
  `
}
