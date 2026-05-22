'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/lib/hygraph'
import { createInscricao } from '@/lib/enrollments-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { createNotificationViaApi } from '@/lib/admin-api'

interface EnrollmentCheckoutFormProps {
  courses: Course[]
  whatsappNumber?: string
}

interface BankInfo {
  banco: string
  conta: string
  iban: string
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

  // Form state
  const [formData, setFormData] = useState({
    course: '',
    comprovativo: null as File | null,
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { user, isLoading } = useAuth()
  const { toast } = useToast()

  // Bank info
  const bankInfo: BankInfo = {
    banco: 'BCI - Banco de Crédito do Investidor',
    conta: '1234567890',
    iban: 'AO06.0015.0000.1234.5678.9012.3',
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      const redirectPath = `/enroll${preselectedCourse ? `?course=${encodeURIComponent(preselectedCourse)}` : ''}`
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [isLoading, user, preselectedCourse, router])

  // Fetch user profile from Supabase
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user?.id) {
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

  // Set initial course
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.course) {
        throw new Error('Por favor, selecione um curso')
      }

      if (!userProfile) {
        throw new Error('Perfil do utilizador não encontrado')
      }

      const matchedCourse = courses.find((c) => c.id === formData.course)
      if (!matchedCourse) {
        throw new Error('Curso não encontrado')
      }

      // 1. Create enrollment in "inscricoes" table
      const inscricaoResult = await createInscricao({
        nome: userProfile.nome,
        email: userProfile.email,
        curso_id: formData.course,
        curso_nome: matchedCourse.name,
        comprovativo_enviado: !!formData.comprovativo,
      })

      if (!inscricaoResult.ok) {
        throw new Error(inscricaoResult.error || 'Erro ao criar inscrição')
      }

      // 2. Create notification for admins about pending payment
      try {
        await createNotificationViaApi({
          tipo: 'inscricao_pendente_pagamento',
          titulo: 'Aviso de Pagamento Pendente',
          descricao: `O utilizador ${userProfile.nome} iniciou o processo de inscrição no curso "${matchedCourse.name}" e está prestes a efetuar o pagamento. Consulte o WhatsApp para validar o comprovativo.`,
          metadata: {
            aluno_nome: userProfile.nome,
            aluno_email: userProfile.email,
            curso_nome: matchedCourse.name,
            curso_id: formData.course,
            inscricao_id: inscricaoResult.inscricao?.id,
          },
        })
      } catch (notificationErr) {
        console.warn('[checkout] Aviso: Notificação de admins não enviada, continuando...', notificationErr)
      }

      // 3. Create notification for the user about enrollment status
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

      // Show success toast
      toast({
        title: '✓ Inscrição confirmada!',
        description: 'Redirecionando para WhatsApp para enviar o comprovativo...',
        variant: 'default',
      })

      // Build WhatsApp URL with message
      const whatsappMessage = buildWhatsAppMessage(matchedCourse.name, userProfile.email)
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber.replace(/[^0-9]/g, '')}&text=${whatsappMessage}`

      // Redirect to WhatsApp after 2 seconds
      setTimeout(() => {
        window.open(whatsappUrl, '_blank')
        // Also redirect to dashboard
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
    <div className="w-full min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT PANEL - Dark (Informational) */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary via-[#312455] to-[#1d1533] relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute -right-32 -top-32 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-accent/5 rounded-full blur-2xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="mb-12">
            <div className="inline-flex items-center justify-center px-3 py-1 mb-4 rounded-full bg-accent/20 border border-accent/30">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Checkout de Inscrição
              </span>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">Complete a sua Inscrição</h2>
            <p className="text-white/70 text-sm">Preencha os dados e proceda ao pagamento</p>
          </div>

          {/* Course Summary Section */}
          <div className="mb-8 space-y-6">
            {selectedCourse ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-accent/20 rounded-lg">
                    <BookOpen className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-white/60 font-semibold">
                      Curso Selecionado
                    </p>
                    <h3 className="text-lg font-bold text-white">{selectedCourse.name}</h3>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-white/60 text-sm">Selecione um curso para ver o resumo</p>
              </div>
            )}

            {/* Investment Value */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-gradient-to-r from-accent/30 to-accent/10 border border-accent/50 rounded-2xl"
            >
              <p className="text-xs uppercase tracking-wider text-white/60 font-semibold mb-2">
                Investimento
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">AOA</span>
                <span className="text-3xl font-bold text-accent">365.585,00</span>
              </div>
              <p className="text-white/60 text-xs mt-3">AOA 30.465,42 / mês cobrado anualmente</p>
            </motion.div>
          </div>

          {/* Bank Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl space-y-4"
          >
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Banknote className="h-5 w-5 text-accent" />
              Dados Bancários
            </h3>

            {/* Banco */}
            <div className="pb-4 border-b border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">Banco</p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-white/90 flex-1">{bankInfo.banco}</p>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(bankInfo.banco, 'banco')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  <AnimatePresence mode="wait">
                    {copiedField === 'banco' ? (
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

            {/* Conta */}
            <div className="pb-4 border-b border-white/10">
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">
                Número de Conta
              </p>
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-mono font-semibold text-white/90 flex-1">{bankInfo.conta}</p>
                <button
                  type="button"
                  onClick={() => handleCopyToClipboard(bankInfo.conta, 'conta')}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
                  title="Copiar"
                >
                  <AnimatePresence mode="wait">
                    {copiedField === 'conta' ? (
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

            {/* IBAN */}
            <div>
              <p className="text-xs uppercase tracking-wider text-white/50 font-semibold mb-2">IBAN</p>
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

            <div className="mt-4 p-3 bg-accent/10 border border-accent/30 rounded-lg">
              <p className="text-xs text-white/80">
                <strong>Nota:</strong> Efetue o pagamento e guarde o comprovativo para validação.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* RIGHT PANEL - Light (Action) */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col justify-center p-8 md:p-12 bg-background"
      >
        {/* Breadcrumb Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 pb-6 border-b border-border"
        >
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Voltar</span>
          </button>
        </motion.div>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-red-200">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Personal Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Informações Pessoais
            </h3>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">
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
              <p className="text-xs text-muted-foreground">
                Campo preenchido automaticamente do seu perfil
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
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
              <p className="text-xs text-muted-foreground">
                Campo preenchido automaticamente do seu perfil
              </p>
            </div>
          </div>

          {/* Course Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Curso Pretendido
            </h3>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-foreground font-medium">
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
              <p className="text-xs text-muted-foreground">
                Este campo não pode ser alterado. Volte para selecionar outro curso.
              </p>
            </div>
          </div>

          {/* Payment Proof Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              Comprovativo de Pagamento
            </h3>

            <div className="space-y-2">
              <Label htmlFor="file" className="text-foreground font-medium">
                Upload do comprovativo bancário (opcional)
              </Label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-8 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-muted/20">
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-foreground">
                    {uploadFileName || 'Clique para fazer upload'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, JPG ou PNG (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Support Message */}
          <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-900/30 rounded-xl">
            <div className="flex gap-3">
              <HelpCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-blue-900 dark:text-blue-200">
                  Após confirmar, será redirecionado para o WhatsApp para enviar o seu comprovativo.
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || !formData.course}
            className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Confirmar Inscrição
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-center text-xs text-muted-foreground">
            A sua inscrição será processada após o pagamento ser validado
          </p>
        </form>
      </motion.div>
    </div>
  )
}
