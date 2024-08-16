import { getRecipes, getRecipeById } from '../../../lib/clientDB'
import { Recipe } from '../../admin/recipes/types'
import RecipeDetailStatic from './RecipeDetailStatic'

export default async function RecipeDetailPage({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(Number(params.id))
  return <RecipeDetailStatic recipe={recipe} />
}

export async function generateStaticParams() {
  const recipes = await getRecipes()
  return recipes.map((recipe: Recipe) => ({
    id: recipe.id.toString(),
  }))
}
/*
import RecipeDetail from './RecipeDetail'
import { initClientDB, getRecipes } from '../../../lib/clientDB'
import { Recipe } from '../../admin/recipes/types';

export default RecipeDetail

export async function generateStaticParams() {
  await initClientDB()
  const recipes = await getRecipes()
  return recipes.map((recipe: Recipe) => ({
    id: recipe.id.toString(),
  }))
}
  */