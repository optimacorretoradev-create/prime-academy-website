'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface User {
  name: string
  email: string
  role: 'aluno' | 'instrutor'
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

  const fetchProfile = async (id: string, email: string, fallbackName?: string) => {
    try {
      const { data, error } = await supabase
        .from('perfis')
        .select('nome, email, cargo')
        .eq('id', id)
        .single()

      if (data && !error) {
        setUser({
          name: data.nome,
          email: data.email,
          role: data.cargo as 'aluno' | 'instrutor',
        })
      } else {
        // Fallback to metadata if the profile table hasn't finished writing yet
        setUser({
          name: fallbackName || 'Utilizador',
          email: email,
          role: 'aluno',
        })
      }
    } catch (err) {
      console.error('Error fetching user profile from profiles table:', err)
      setUser({
        name: fallbackName || 'Utilizador',
        email: email,
        role: 'aluno',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Check active session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          await fetchProfile(
            session.user.id,
            session.user.email || '',
            session.user.user_metadata?.name
          )
        } else {
          setUser(null)
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking active session:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes (login, logout, token refresh, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        await fetchProfile(
          session.user.id,
          session.user.email || '',
          session.user.user_metadata?.name
        )
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Ocorreu um erro inesperado ao tentar entrar.',
      }
    }
  }

  const signup = async (name: string, email: string, password: string, role: 'aluno' | 'instrutor' = 'aluno') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: 'aluno', // Enforce 'aluno' on signup
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
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await supabase.auth.signOut()
      setUser(null)
    } catch (err) {
      console.error('Error signing out:', err)
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
