'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import RecipeCard from '../../components/RecipeCard'
import RecipeSearch from '../../components/RecipeSearch'
import { initClientDB, getRecipes } from '../../lib/clientDB';
import { fetchRecipesData } from '../../lib/github'
import { Recipe } from '../admin/recipes/types'

export default function Recipes() {
  //const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    async function loadData() {
      await initClientDB()
      const data = await fetchRecipesData()
      await getRecipes() // This will initialize the db with the fetched data
      //setRecipes(data.cocktails)
      setFilteredRecipes(data.cocktails)
    }
    loadData()
  }, [])

  const handleSearch = async (searchResults: Recipe[]) => {
    setFilteredRecipes(searchResults)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">カクテルレシピ一覧</h1>
      <RecipeSearch onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Layout>
  )
}