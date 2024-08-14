import { useEffect, useState } from 'react'
import AdminLayout from '../../components/AdminLayout';
import Link from 'next/link'
import { initDB, getRecipes } from '../../../lib/lowdb'
import { fetchRecipesData } from '../../../lib/github'

export default function AdminRecipes() {
  const [recipes, setRecipes] = useState([])

  useEffect(() => {
    async function loadData() {
      await initDB()
      const data = await fetchRecipesData()
      await getRecipes() // This will initialize the db with the fetched data
      setRecipes(data.cocktails)
    }
    loadData()
  }, [])

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-4">レシピ管理</h1>
      <Link href="/admin/recipes/new" className="mb-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
        新規レシピ作成
      </Link>
      <ul className="space-y-2">
        {recipes.map(recipe => (
          <li key={recipe.id} className="border p-2 rounded">
            <Link href={`/admin/recipes/${recipe.id}`}>
              {recipe.name}
            </Link>
          </li>
        ))}
      </ul>
    </AdminLayout>
  )
}