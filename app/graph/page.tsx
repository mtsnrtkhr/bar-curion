'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Layout from '../../components/Layout'
import GraphSearch from './GraphSerch'

const GraphVisualizationWrapper = dynamic(() => import('./GraphVisualizationWrapper'), {
  ssr: false,
  loading: () => <p>グラフデータを読み込んでいます...</p>
})

export default function GraphPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-4">カクテルと材料の関係グラフ</h1>
      <GraphSearch onSearch={handleSearch} />
      <GraphVisualizationWrapper searchTerm={searchTerm} />
    </Layout>
  )
}