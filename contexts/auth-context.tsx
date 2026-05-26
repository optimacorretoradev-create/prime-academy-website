'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  name: string
  email: string
  role: 'aluno' | 'instrutor' | 'admin'
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string, role?: 'aluno' | 'instrutor') => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProfile = async (id: string, email: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('nome, email, cargo')
        .eq('id', id)
        .single()

      if (data && !error) {
        const userData: User = {
          name: data.nome,
          email: data.email,
          role: data.cargo as 'aluno' | 'instrutor' | 'admin',
        }
        setUser(userData)
      } else {
        // Perfil não encontrado ou erro na leitura — utilizador sem acesso
        console.warn('[auth] Perfil não encontrado para ID:', id)
        setUser(null)
      }
    } catch (err) {
      console.error('[auth] Erro ao carregar perfil:', err)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Verificar sessão ativa no mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await fetchProfile(session.user.id, session.user.email || '')
        } else {
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('[auth] Erro ao verificar sessão:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    checkSession()

    // Ouvir mudanças de autenticação (login, logout, refresh de token, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(session.user.id, session.user.email || '')
      } else {
        setUser(null)
        setIsLoading(false)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Login bem-sucedido — fetchProfile será chamado automaticamente via onAuthStateChange
      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Ocorreu um erro inesperado ao tentar entrar.',
      }
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, password: string, role: 'aluno' | 'instrutor' = 'aluno') => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'aluno',
          },
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Ocorreu um erro inesperado ao tentar criar a conta.',
      }
    } finally {
      setIsLoading(false)
    }
  }
  const logout = async () => {
    try {
      setUser(null) // Instant synchronous update to clear user profile and trigger immediate visual change
      setIsLoading(true)
      await supabase.auth.signOut()
      // Limpar qualquer localStorage relacionado (notificações, etc.)
      if (typeof window !== 'undefined') {
        const keys = Object.keys(localStorage).filter((k) =>
          k.startsWith('prime_academy_')
        )
        keys.forEach((k) => localStorage.removeItem(k))
      }
    } catch (err) {
      console.error('[auth] Erro ao terminar sessão:', err)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
