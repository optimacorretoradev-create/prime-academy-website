'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  Loader2,
  Upload,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  BookOpen,
  DollarSign,
  Banknote,
  ChevronRight,
  ChevronLeft,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/lib/hygraph'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { createInscricao } from '@/lib/enrollments-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { createNotificationViaApi } from '@/lib/admin-api'
import emailjs from '@emailjs/browser'

interface EnrollmentCheckoutFormProps {
  courses: Course[]
  whatsappNumber?: string
}

interface BankInfo {
  banco: string
  conta: string
  iban: string
  titular: string
}

interface UserProfile {
  nome: string
  email: string
}

export function EnrollmentCheckoutForm({
  courses,
  whatsappNumber = '+244921394946',
}: EnrollmentCheckoutFormProps) {
  const searchParams = useSearchParams()
  const preselectedCourse = searchParams.get('course')
  const router = useRouter()

  const [formData, setFormData] = useState({
    course: '',
    modalidade: 'online' as 'online' | 'presencial',
    comprovativo: null as File | null,
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userAuthId, setUserAuthId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { user, isLoading } = useAuth()
  const { toast } = useToast()

  const bankInfo: BankInfo = {
    banco: 'BAI - Banco Angolano de Investimentos',
    conta: '1436.2851.1016.0',
    iban: 'AO06.0040.0000.1436.2851.1016.0',
    titular: 'Prime Academy Formação Técnica Serv LDA',
  }

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectPath = `/enroll${preselectedCourse ? `?course=${encodeURIComponent(preselectedCourse)}` : ''}`
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [isLoading, user, preselectedCourse, router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user?.id) {
          setUserAuthId(authData.user.id)
          const { data, error } = await supabase
            .from('perfis')
            .select('nome, email')
            .eq('id', authData.user.id)
            .single()

          if (data && !error) {
            setUserProfile(data)
          }
        }
      } catch (err) {
        console.error('[checkout] Erro ao buscar perfil:', err)
      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (preselectedCourse) {
      const match = courses.find(
        (c) => c.id === preselectedCourse || c.name === preselectedCourse
      )
      setFormData((prev) => ({
        ...prev,
        course: match ? match.id : preselectedCourse,
      }))
    }
  }, [preselectedCourse, courses])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFileName(file.name)
      setFormData((prev) => ({ ...prev, comprovativo: file }))
    }
  }

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const buildWhatsAppMessage = (courseName: string, email: string): string => {
    const message = `Olá! Acabei de realizar a minha inscrição no curso *${courseName}*. O meu e-mail é *${email}* e aqui está o meu comprovativo de pagamento.`
    return encodeURIComponent(message)
  }

  const uploadComprovatvoToStorage = async (file: File, inscricaoId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `comprovativos/${fileName}`

      const { data, error } = await supabase.storage
        .from('inscricoes')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        })

      if (error) {
        throw new Error(`Erro ao fazer upload: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('inscricoes')
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (err) {
      console.error('[checkout] Erro ao fazer upload:', err)
      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.course) {
        throw new Error('Por favor, selecione um curso')
      }
      
      if (!formData.comprovativo) {
        toast({
          title: "Atenção",
          description: "Por favor, faça o upload do seu comprovativo bancário para concluir a inscrição.",
          variant: "destructive"
        })
        setIsSubmitting(false)
        return
      }

      if (!userProfile) {
        throw new Error('Perfil do utilizador não encontrado')
      }

      const matchedCourse = courses.find((c) => c.id === formData.course)
      if (!matchedCourse) {
        throw new Error('Curso não encontrado')
      }

      const tempInscricaoId = crypto.randomUUID()
      const comprovativoUrl = await uploadComprovatvoToStorage(formData.comprovativo, tempInscricaoId)

      const inscricaoResult = await createInscricao({
        nome: userProfile.nome,
        email: userProfile.email,
        curso_id: formData.course,
        curso_nome: matchedCourse.name,
        modalidade: formData.modalidade,
        comprovativo_url: comprovativoUrl,
      })

      if (!inscricaoResult.ok) {
        throw new Error(inscricaoResult.error || 'Erro ao criar inscrição')
      }

      // Enviar e-mail de notificação via EmailJS
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_ENROLL_TEMPLATE_ID || process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      console.log('[checkout] Variáveis EmailJS:', { serviceId, templateId, publicKey: publicKey ? '✓ definida' : '✗ em falta' })

      if (!serviceId || !templateId || !publicKey) {
        console.error('[checkout] ERRO: Variáveis do EmailJS em falta no .env!')
        toast({ title: 'Aviso', description: 'Configuração de e-mail em falta. Contacte o suporte.', variant: 'destructive' })
      } else {
        try {
          const result = await emailjs.send(
            serviceId,
            templateId,
            {
              to_email: 'comercialprimeacademy@gmail.com',
              name: userProfile.nome,
              email: userProfile.email,
              phone: 'N/A',
              course: matchedCourse.name,
              message: `Modalidade: ${formData.modalidade === 'presencial' ? 'Presencial' : 'Online'}. Comprovativo: ${comprovativoUrl}`,
            },
            publicKey
          )
          console.log('[checkout] E-mail enviado! Status:', result.status, result.text)
        } catch (emailErr) {
          console.error('[checkout] ERRO ao enviar e-mail:', emailErr)
          toast({ title: 'Aviso de e-mail', description: `Erro: ${emailErr instanceof Error ? emailErr.message : String(emailErr)}`, variant: 'destructive' })
        }
      }

      try {
        await createNotificationViaApi({
          perfilId: userAuthId ?? '',
          tipo: 'inscricao_pendente_pagamento',
          titulo: 'Aviso de Pagamento Pendente',
          descricao: `O utilizador ${userProfile.nome} iniciou o processo de inscrição no curso "${matchedCourse.name}" (${formData.modalidade === 'presencial' ? 'Presencial' : 'Online'}). Comprovativo de pagamento enviado.`,
          metadata: {
            aluno_nome: userProfile.nome,
            aluno_email: userProfile.email,
            curso_nome: matchedCourse.name,
            curso_id: formData.course,
            modalidade: formData.modalidade,
            comprovativo_url: comprovativoUrl,
            inscricao_id: inscricaoResult.inscricao?.id,
          },
        })
      } catch (notificationErr) {
        console.warn('[checkout] Aviso: Notificação de admins não enviada, continuando...', notificationErr)
      }

      try {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user?.id) {
          await createNotificationViaApi({
            perfilId: authData.user.id,
            tipo: 'inscricao_em_analise',
            titulo: 'Inscrição Enviada',
            descricao: `A sua inscrição no curso "${matchedCourse.name}" foi recebida e está sendo analisada. A equipa entrará em contacto em breve.`,
            metadata: {
              curso_nome: matchedCourse.name,
              curso_id: formData.course,
              inscricao_id: inscricaoResult.inscricao?.id,
            },
          })
        }
      } catch (userNotifErr) {
        console.warn('[checkout] Aviso: Notificação do utilizador não enviada, continuando...', userNotifErr)
      }

      setIsSuccess(true)

      toast({
        title: '✓ Inscrição confirmada!',
        description: 'Redirecionando para WhatsApp para enviar o comprovativo...',
      })

      const whatsappMessage = buildWhatsAppMessage(matchedCourse.name, userProfile.email)
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/[^0-9]/g, '')}&text=${whatsappMessage}`

      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar inscrição')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <span className="text-sm text-muted-foreground">Carregando dados...</span>
        </div>
      </div>
    )
  }

  const selectedCourse = courses.find((c) => c.id === formData.course)

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header Fixed com Breadcrumbs */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-2 md:px-8 md:py-3">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <Link
            href={selectedCourse ? `/courses/${selectedCourse.id}` : '/dashboard?tab=explore'}
            className="text-slate-600 hover:text-[#312455] transition-colors font-semibold whitespace-nowrap"
          >
            Voltar ao Curso
          </Link>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-500 truncate">
            {selectedCourse ? selectedCourse.name : 'Inscrição'}
          </span>
        </div>
      </header>

      {/* Main Grid com Padding Superior */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 pt-[56px] md:pt-[60px]">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-first flex flex-col justify-between p-4 md:p-6 lg:p-8 bg-gradient-to-br from-primary via-[#312455] to-[#1d1533] relative overflow-hidden"
      >
        <div className="absolute -right-32 -top-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          <div className="mb-4 md:mb-8">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-2 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Checkout de Inscrição
              </span>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-2xl font-bold text-white mb-1">Complete a sua Inscrição</h2>
            <p className="text-white/70 text-xs">Preencha os dados e proceda ao pagamento</p>
          </div>

          <div className="mb-4 md:mb-6 space-y-4">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 md:p-4 lg:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-2">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                      Curso Selecionado
                    </p>
                    <h3 className="text-base md:text-lg lg:text-lg font-bold text-white">{selectedCourse.name}</h3>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-white/60 text-sm">Selecione um curso para ver o resumo</p>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-3 md:p-4 lg:p-4 bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/50 rounded-2xl"
            >
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-1">
                Investimento
              </p>
              {selectedCourse ? (
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl md:text-3xl lg:text-3xl font-bold text-accent">
                    {getCoursePriceDisplay(selectedCourse.id, selectedCourse.price)}
                  </span>
                </div>
              ) : (
                <p className="text-white/50 text-sm italic">Selecione um curso para ver o valor</p>
              )}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 md:p-4 lg:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl space-y-3"
          >
            <h3 className="text-white font-bold text-base flex items-center gap-2">
              <Banknote className="h-5 w-5 text-accent" />
              Dados Bancários
            </h3>

            <div className="pb-3 border-b border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">Banco</p>
              <p className="text-sm text-white/90">{bankInfo.banco}</p>
            </div>

            <div>
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">IBAN</p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-mono font-semibold text-white/90 flex-1 break-all">
                  {bankInfo.iban}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(bankInfo.iban, 'iban')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  <AnimatePresence mode="wait">
                    {copiedField === 'iban' ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check className="h-4 w-4 text-green-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Copy className="h-4 w-4 text-white/60" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-1">Titular</p>
              <p className="text-sm text-white/90">{bankInfo.titular}</p>
            </div>

            <div className="mt-2 p-2 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-white/80 leading-tight">
                <strong>Nota:</strong> Efetue o pagamento e guarde o comprovativo para validação.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-last flex flex-col justify-center p-4 md:p-6 lg:p-8 bg-background"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="w-full space-y-4">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Informações Pessoais
            </h3>

            <div className="space-y-1">
              <Label htmlFor="name" className="text-foreground font-medium text-sm">
                Nome Completo
              </Label>
              <Input
                id="name"
                type="text"
                value={userProfile.nome}
                disabled
                readOnly
                className="rounded-xl bg-muted/50 cursor-not-allowed border border-border"
              />
              <p className="text-[10px] text-muted-foreground">
                Campo preenchido automaticamente do seu perfil
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="email" className="text-foreground font-medium text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={userProfile.email}
                disabled
                readOnly
                className="rounded-xl bg-muted/50 cursor-not-allowed border border-border"
              />
              <p className="text-[10px] text-muted-foreground">
                Campo preenchido automaticamente do seu perfil
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Curso Pretendido
            </h3>

            <div className="space-y-1">
              <Label htmlFor="course" className="text-foreground font-medium text-sm">
                Curso Selecionado
              </Label>
              {selectedCourse ? (
                <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{selectedCourse.name}</p>
                    <p className="text-xs text-muted-foreground">Curso confirmado para inscrição</p>
                  </div>
                  <Check className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Carregando curso...</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Formato de Aprendizagem
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modalidade: 'online' }))}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1 group ${
                  formData.modalidade === 'online'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <div className="relative w-5 h-5 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors">
                  {formData.modalidade === 'online' && (
                    <div className="absolute inset-1 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  formData.modalidade === 'online' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Online
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modalidade: 'presencial' }))}
                className={`relative p-3 rounded-xl border-2 transition-all duration-300 flex flex-col items-center gap-1 group ${
                  formData.modalidade === 'presencial'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <div className="relative w-5 h-5 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors">
                  {formData.modalidade === 'presencial' && (
                    <div className="absolute inset-1 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  formData.modalidade === 'presencial' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Presencial
                </span>
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Comprovativo de Pagamento
            </h3>

            <div className="space-y-1">
              <Label htmlFor="file" className="text-foreground font-medium text-sm">
                Upload do comprovativo bancário (obrigatório)
              </Label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-5 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-muted/20">
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-xs font-medium text-foreground">
                    {uploadFileName || 'Clique para fazer upload'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    PDF, JPG ou PNG (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.course}
            className="w-full h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Confirmar Inscrição
                <ArrowRight className="h-3 w-3" />
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            A sua inscrição será processada após o pagamento ser validado
          </p>
        </form>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}
