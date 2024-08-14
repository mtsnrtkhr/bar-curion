import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import AdminRecipeForm from '../../../components/AdminRecipeForm'

export default function EditRecipe() {
  const router = useRouter()
  const { id } = router.query
  const [recipe, setRecipe] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (id) {
      fetch(`/api/recipes/${id}`)
        .then(res => res.json())
        .then(setRecipe)
        .catch(error => {
          console.error('Error fetching recipe:', error)
          alert('レシピの取得に失敗しました')
        })
    }
  }, [id])

  const handleSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.get('name'),
          category: formData.get('category'),
          ingredients: JSON.parse(formData.get('ingredients')),
          instructions: formData.get('instructions'),
          image: recipe.image // 既存の画像を維持
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update recipe')
      }

      router.push('/admin/recipes')
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの更新に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!recipe) return <div>Loading...</div>

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">レシピ編集: {recipe.name}</h1>
      <AdminRecipeForm initialRecipe={recipe} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </AdminLayout>
  )
}