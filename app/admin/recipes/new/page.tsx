'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'  // next/router から next/navigation に変更
import AdminLayout from '../../AdminLayout'
import AdminRecipeForm from './AdminRecipeForm'

export default function NewRecipe() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        body: formData,  // Content-Type ヘッダーを削除し、FormData をそのまま送信
      })

      if (!response.ok) {
        throw new Error('Failed to create recipe')
      }

      router.push('/admin/recipes')
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの作成に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isMounted) {
    return null // または loading indicator
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">新規レシピ作成</h1>
      <AdminRecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  )
}