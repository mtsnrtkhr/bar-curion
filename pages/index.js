import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { initDB, getRecipes } from '../lib/lowdb'
import { fetchRecipesData } from '../lib/github'

export default function Home() {
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
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Bar Curionへようこそ</h1>
      <p>ここでは{recipes.length}種類のカクテルレシピを探索できます。</p>
    </Layout>
  )
}