'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function RecipeCard({ recipe }) {
  return (
    <div className="border p-4 rounded shadow">

      <h2 className="text-xl font-semibold mb-2">{recipe.name}</h2>
      <p className="text-gray-600 mb-2">{recipe.category}</p>
      <p className="mb-2">材料: {recipe.ingredients.length}種類</p>
      <Link href={`/recipes/${recipe.id}`} className="text-blue-500 hover:underline">
        詳細を見る
      </Link>
    </div>
  )
}