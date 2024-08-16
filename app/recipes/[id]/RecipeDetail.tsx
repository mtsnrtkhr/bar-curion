'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Layout from '../../../components/Layout'
import { initClientDB, getRecipeById } from '../../../lib/clientDB'

export default function RecipeDetail({ params }: { params: { id: string } }) {
  const [recipe, setRecipe] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecipe() {
      try {
        await initClientDB()
        const recipeData = await getRecipeById(Number(params.id))
        setRecipe(recipeData)
      } catch (error) {
        console.error('Error loading recipe:', error)
      } finally {
        setLoading(false)
      }
    }
    loadRecipe()
  }, [params.id])

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
        {recipe.ingredients.map((ingredient: any, index: number) => (
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