import { notFound } from 'next/navigation'
import EditRecipeForm from './EditRecipeForm'
import { getRecipes } from '../../../../lib/clientDB'
import { Recipe } from '../types'

export default function EditRecipePage({ params }: { params: { id: string } }) {
  return <EditRecipeForm id={params.id} />
}

export async function generateStaticParams() {
  const recipes: Recipe[] = await getRecipes()
  return recipes.map((recipe) => ({
    id: recipe.id.toString(),
  }))
}

// 動的ルートの場合、存在しないIDへのアクセスを処理
export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipes = await getRecipes()
  const recipe = recipes.find((r : Recipe ) => r.id.toString() === params.id)

  if (!recipe) {
    return notFound()
  }

  return {
    title: `Edit ${recipe.name}`,
  }
}