'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../AdminLayout'
import AdminRecipeForm from '../new/AdminRecipeForm'
import { getRecipeById } from '../../../../lib/clientDB'
import { Recipe } from '../types'
type EditRecipeFormProps = {
  id: string
}

export default function EditRecipeForm({ id }: EditRecipeFormProps ) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadRecipe() {
      const recipeData = await getRecipeById(id)
      if (!recipeData) {
        router.push('/admin/recipes') // レシピが見つからない場合はリダイレクト
      } else {
        setRecipe(recipeData as Recipe)
      }
    }
    loadRecipe()
  }, [id, router])

/*'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../AdminLayout'
import AdminRecipeForm from '../new/AdminRecipeForm'
import { Recipe } from '../types'

type EditRecipeFormProps = {
  id: string
}

export default function EditRecipeForm({ id }: EditRecipeFormProps) {
  const router = useRouter()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
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
*/

  const handleSubmit = async (formData: FormData) => {
    if (!recipe) {
      alert('レシピデータが読み込まれていません')
      return
    }
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
          ingredients: JSON.parse(formData.get('ingredients') as string),
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