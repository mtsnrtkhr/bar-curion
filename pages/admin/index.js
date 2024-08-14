import Layout from '../../components/Layout'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">管理ダッシュボード</h1>
      <div className="space-y-4">
        <Link href="/admin/recipes" className="block p-4 border rounded hover:bg-gray-100">
          レシピ管理
        </Link>
        {/* 他の管理機能へのリンクをここに追加 */}
      </div>
    </Layout>
  )
}