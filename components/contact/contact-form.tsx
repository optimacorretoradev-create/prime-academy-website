'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          ...formData,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao enviar mensagem')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-accent" />
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">Mensagem enviada!</h3>
        <p className="text-muted-foreground mb-6">
          Obrigado pelo contacto. Responderemos em breve.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="rounded-xl"
        >
          Enviar outra mensagem
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="contact-name">Nome *</Label>
        <Input
          id="contact-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Insira o seu nome"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-email">Email *</Label>
        <Input
          id="contact-email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="exemplo@email.com"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact-message">Mensagem *</Label>
        <Textarea
          id="contact-message"
          required
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Escreva a sua mensagem..."
          rows={5}
          className="rounded-xl resize-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl text-base py-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            A enviar...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Enviar mensagem
          </>
        )}
      </Button>
    </form>
  )
}
