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
  course?: string
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


    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    
    // Select the correct template ID based on form type
    let templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
    if (data.type === 'enrollment' && process.env.NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID) {
      templateId = process.env.NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID
    } else if (data.type === 'contact' && process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID) {
      templateId = process.env.NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID
    }

    // If EmailJS keys are set, send the email
    if (serviceId && publicKey && templateId) {

      
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          accessToken: process.env.EMAILJS_PRIVATE_KEY || undefined,
          template_params: {
            to_email: 'comercialprimeacademy@gmail.com',
            type: data.type,
            name: data.name,
            email: data.email,
            phone: data.phone || 'Não fornecido',
            course: data.course || 'N/A',
            message: data.message || 'Sem mensagem adicional',
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()

        return NextResponse.json(
          { error: `EmailJS Error: ${response.status} - ${errorText}` },
          { status: 500 }
        )
      }


    } else {
      console.warn(
        'EmailJS environment variables are not configured. Simulating success in development.'
      )
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return NextResponse.json({ 
      success: true, 
      message: data.type === 'enrollment' 
        ? 'Inscrição recebida com sucesso!' 
        : 'Mensagem enviada com sucesso!'
    })
  } catch (error) {

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar o pedido. Tente novamente.' },
      { status: 500 }
    )
  }
}
