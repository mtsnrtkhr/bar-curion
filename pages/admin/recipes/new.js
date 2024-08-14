import { useState } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import AdminRecipeForm from '../../../components/AdminRecipeForm'

export default function NewRecipe() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          category: formData.get('category'),
          ingredients: JSON.parse(formData.get('ingredients')),
          instructions: formData.get('instructions'),
          image: null // 画像は任意なので、ここではnullを設定
        }),
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

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">新規レシピ作成</h1>
      <AdminRecipeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  )
}