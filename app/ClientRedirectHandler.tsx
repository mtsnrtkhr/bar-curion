'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ClientRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    const redirect = sessionStorage.redirect
    delete sessionStorage.redirect
    if (redirect && redirect !== location.href) {
      router.push(redirect)
    }
  }, [router])

  return null
}