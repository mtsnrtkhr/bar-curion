import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../../components/AdminLayout'
import AdminRecipeForm from '../../../components/AdminRecipeForm'

export default function EditRecipe() {
  const router = useRouter()
  const { id } = router.query
  const [recipe, setRecipe] = useState(null)

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
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'PUT',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to update recipe')
      router.push('/admin/recipes')
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの更新に失敗しました')
    }
  }

  if (!recipe) return <div>Loading...</div>

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">レシピ編集: {recipe.name}</h1>
      <AdminRecipeForm initialRecipe={recipe} onSubmit={handleSubmit} />
    </AdminLayout>
  )
}