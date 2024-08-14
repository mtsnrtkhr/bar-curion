import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { initDB, getRecipeById } from '../../lib/lowdb'
import { fetchRecipesData } from '../../lib/github'

export default function RecipeDetail() {
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

  if (!recipe) return <div>Loading...</div>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.image && (
        <div className="mb-4">
          <Image
            src={recipe.image}
            alt={recipe.name}
            width={600}
            height={400}
            objectFit="cover"
            className="rounded-lg"
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
      <p className="whitespace-pre-line">{recipe.instructions}</p>
    </Layout>
  )
}