'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

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

  useEffect(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('prime_academy_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Error parsing stored user', e)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Check if the user signed up previously in localStorage
    const savedUsers = localStorage.getItem('prime_academy_registered_users')
    let registeredUsers: Array<User & { password?: string }> = []
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers)
      } catch (e) {
        console.error(e)
      }
    }

    const foundUser = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (foundUser) {
      const loggedUser: User = {
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role || 'aluno'
      }
      setUser(loggedUser)
      localStorage.setItem('prime_academy_user', JSON.stringify(loggedUser))
      return { success: true }
    }

    // Default mock behavior to allow easy testing with any email
    if (email.includes('@')) {
      const isInstrutor = email.includes('instrutor') || email.includes('teacher')
      const loggedUser: User = {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        email: email,
        role: isInstrutor ? 'instrutor' : 'aluno'
      }
      setUser(loggedUser)
      localStorage.setItem('prime_academy_user', JSON.stringify(loggedUser))
      return { success: true }
    }

    return { success: false, error: 'Credenciais inválidas' }
  }

  const signup = async (name: string, email: string, password: string, role: 'aluno' | 'instrutor' = 'aluno') => {
    const savedUsers = localStorage.getItem('prime_academy_registered_users')
    let registeredUsers: Array<User & { password?: string; role: 'aluno' | 'instrutor' }> = []
    if (savedUsers) {
      try {
        registeredUsers = JSON.parse(savedUsers)
      } catch (e) {
        console.error(e)
      }
    }

    const exists = registeredUsers.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    )

    if (exists) {
      return { success: false, error: 'Este email já está registado' }
    }

    const newUser = { name, email, password, role }
    registeredUsers.push(newUser)
    localStorage.setItem('prime_academy_registered_users', JSON.stringify(registeredUsers))

    const loggedUser: User = { name, email, role }
    setUser(loggedUser)
    localStorage.setItem('prime_academy_user', JSON.stringify(loggedUser))

    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('prime_academy_user')
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
