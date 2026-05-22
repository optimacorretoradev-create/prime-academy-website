import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getCourses, getContactInfo } from '@/lib/hygraph'
import { EnrollmentCheckoutForm } from '@/components/enroll/enrollment-checkout-form'

export const metadata: Metadata = {
  title: 'Checkout de Inscrição - Prime Academy',
  description: 'Complete a sua inscrição com checkout fluido e profissional. Dados bancários seguros e validação imediata.',
}

export default async function EnrollPage() {
  const courses = await getCourses()
  const contactInfo = await getContactInfo()

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Suspense
        fallback={
          <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Carregando checkout...</p>
            </div>
          </div>
        }
      >
        <EnrollmentCheckoutForm
          courses={courses}
          whatsappNumber={contactInfo.whatsappNumber}
        />
      </Suspense>
    </div>
  )
}
