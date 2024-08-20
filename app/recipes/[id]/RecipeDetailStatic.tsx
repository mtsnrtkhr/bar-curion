'use client'

import Image from 'next/image'
import Layout from '../../../components/Layout'
import { Recipe } from '../../admin/recipes/types'
import { getAssetPath } from '../../../app/utils/assetHelpers';

export default function RecipeDetailStatic({ recipe }: { recipe: Recipe }) {
  if (!recipe) return <div>Recipe not found</div>

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">{recipe.name}</h1>
      {recipe.image && (
        <div className="mb-4">
          <Image
            src={ getAssetPath(recipe.image)}
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