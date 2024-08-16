import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Layout from '../../components/Layout'
//import { initDB, getRecipeById } from '../../lib/lowdb'
import { initClientDB, getRecipeById } from '../../lib/clientDB'
import { fetchRecipesData } from '../../lib/github'

export default function RecipeDetail() {
  const router = useRouter()
  const { id } = router.query
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      if (id) {
        try {
          await initClientDB() // データベースの初期化
          const recipeData = await getRecipeById(Number(id))
          if (recipeData) {
            setRecipe(recipeData)
          } else {
            console.log("Recipe database not found")
          }
        } catch (error) {
          console.error('Error loading recipe:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    loadRecipe()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!recipe) return <div>Recipe not found</div>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.image && (
        <div className="mb-4">
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={300}
            height={300}
            objectFit="cover"
          />
        </div>
      )}
      <p className="text-gray-600 mb-4">カテゴリー: {recipe.category}</p>
      <h2 className="text-2xl font-semibold mb-2">材料:</h2>
      <ul className="list-disc pl-5 mb-4">
        {recipe.ingredients.map((ingredient, index) => (
          <li key={index}>
            {ingredient.name}: {ingredient.amount}
          </li>
        ))}
      </ul>
      <h2 className="text-2xl font-semibold mb-2">作り方:</h2>
      <p>{recipe.instructions}</p>
    </Layout>
  )
}