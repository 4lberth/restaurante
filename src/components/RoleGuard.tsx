'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/context/auth'

export default function RoleGuard({
  allow,
  children,
}: {
  allow: string[]        // ['chef'] | ['mozo','admin'] …
  children: ReactNode
}) {
  const { user } = useAuth()
  if (!user) return null
  if (!allow.includes(user.role)) return null
  return <>{children}</>
}
