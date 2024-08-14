import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '../../../components/AdminLayout'
import RecipeSearch from '../../../components/RecipeSearch'

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([])
  const [filteredRecipes, setFilteredRecipes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/recipes')
      if (!response.ok) throw new Error('Failed to fetch recipes')
      const data = await response.json()
      setRecipes(data.cocktails)
      setFilteredRecipes(data.cocktails)
    } catch (error) {
      console.error('Error fetching recipes:', error)
      alert('レシピの取得に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (searchTerm) => {
    const filtered = recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    setFilteredRecipes(filtered)
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">レシピ管理</h1>
      <Link href="/admin/recipes/new" className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        新規レシピ作成
      </Link>
      <RecipeSearch onSearch={handleSearch} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {filteredRecipes.map(recipe => (
            <li key={recipe.id} className="border p-2 rounded">
              <Link href={`/admin/recipes/${recipe.id}`}>
                {recipe.name} - {recipe.category}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminLayout>
  )
}