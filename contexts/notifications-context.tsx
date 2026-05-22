'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { supabase } from '@/lib/supabase'
import type { AppNotification } from '@/lib/admin-types'
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '@/lib/notifications-service'

interface NotificationsContextType {
  notifications: AppNotification[]
  unreadCount: number
  isLoading: boolean
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
)

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [perfilId, setPerfilId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!perfilId) {
      setNotifications([])
      return
    }
    setIsLoading(true)
    const list = await fetchNotifications(perfilId)
    setNotifications(list)
    setIsLoading(false)
  }, [perfilId])

  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setPerfilId(session?.user?.id ?? null)
    }
    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setPerfilId(session?.user?.id ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    refresh()
    if (!perfilId) return

    const interval = setInterval(refresh, 12000)
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)

    const channel = supabase
      .channel(`notificacoes-${perfilId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notificacoes',
          filter: `perfil_id=eq.${perfilId}`,
        },
        () => {
          refresh()
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      supabase.removeChannel(channel)
    }
  }, [perfilId, refresh])

  const markRead = async (id: string) => {
    if (!perfilId) return
    await markNotificationRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, lida: true } : n))
    )
  }

  const markAllRead = async () => {
    if (!perfilId) return
    await markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })))
  }

  const unreadCount = notifications.filter((n) => !n.lida).length

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refresh,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error('useNotifications must be used within NotificationsProvider')
  }
  return ctx
}
