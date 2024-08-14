import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import RecipeCard from '../../components/RecipeCard'
import { initDB, getRecipes } from '../../lib/lowdb'
import { fetchRecipesData } from '../../lib/github'

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function loadData() {
      await initDB()
      const data = await fetchRecipesData()
      await getRecipes() // This will initialize the db with the fetched data
      setRecipes(data.cocktails)
    }
    loadData()
  }, [])

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">カクテルレシピ一覧</h1>
      <input
        type="text"
        placeholder="レシピを検索..."
        className="w-full p-2 mb-4 border rounded"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </Layout>
  )
}