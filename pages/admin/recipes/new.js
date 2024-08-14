import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import AdminRecipeForm from '../../../components/AdminRecipeForm'
import { addRecipe } from '../../../lib/lowdb'

export default function NewRecipe() {
  const router = useRouter()

  const handleSubmit = async (recipe) => {
    try {
      await addRecipe(recipe)
      router.push('/admin/recipes')
    } catch (error) {
      console.error('Error:', error)
      alert('レシピの作成に失敗しました')
    }
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">新規レシピ作成</h1>
      <AdminRecipeForm onSubmit={handleSubmit} />
    </Layout>
  )
}