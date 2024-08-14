import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import AdminRecipeForm from '../../../components/AdminRecipeForm'
import { initDB, getRecipeById, updateRecipe } from '../../../lib/lowdb'
import { fetchRecipesData } from '../../../lib/github'

export default function EditRecipe() {
  const router = useRouter()
  const { id } = router.query
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (id) {
        await initDB()
        await fetchRecipesData() // This will initialize the db with the fetched data
        const recipeData = await getRecipeById(id)
        setRecipe(recipeData)
      }
    }
    loadData()
  }, [id])

  const handleSubmit = async (updatedRecipe) => {
    try {
      await updateRecipe(id, updatedRecipe)
      router.push('/admin/recipes')
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの更新に失敗しました')
    }
  }

  if (!recipe) return <div>Loading...</div>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">レシピ編集: {recipe.name}</h1>
      <AdminRecipeForm initialRecipe={recipe} onSubmit={handleSubmit} />
    </Layout>
  )
}