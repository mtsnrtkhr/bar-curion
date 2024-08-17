'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '../components/Layout'
import RecipeCard from '../components/RecipeCard'
import RecipeSearch from '../components/RecipeSearch'
import { initClientDB, getRecipes } from '../lib/clientDB'
import { Recipe } from './admin/recipes/types'

export default function Home() {
  const router = useRouter()
  //const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    const redirect = sessionStorage.redirect
    delete sessionStorage.redirect
    if (redirect && redirect !== location.href) {
      router.push(redirect)
    }
  }, [router])

  useEffect(() => {
    async function loadData() {
      await initClientDB()
      const recipeData = await getRecipes()
      //setRecipes(recipeData)
      setFilteredRecipes(recipeData)
    }
    loadData()
  }, [])

  const handleSearch = async (searchResults: Recipe[]) => {
    setFilteredRecipes(searchResults)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">Bar Curionへようこそ</h1>
      <RecipeSearch onSearch={handleSearch} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Layout>
  )
}