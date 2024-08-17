'use client'

import { useState } from 'react'
import { searchRecipes } from '../lib/clientDB'

export default function RecipeSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMode, setSearchMode] = useState('simple')

  const handleSearch = async (e) => {
    e.preventDefault()
    const results = await searchRecipes(searchTerm, searchMode === 'advanced')
    onSearch(results)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="mb-2">
        <label className="mr-4">
          <input
            type="radio"
            value="simple"
            checked={searchMode === 'simple'}
            onChange={() => setSearchMode('simple')}
          />
          簡易検索
        </label>
        <label>
          <input
            type="radio"
            value="advanced"
            checked={searchMode === 'advanced'}
            onChange={() => setSearchMode('advanced')}
          />
          高度な検索
        </label>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={searchMode === 'simple'
          ? "レシピ名、材料、カテゴリーでレシピを検索..."
          : "例: ingredients:(ジン OR クリーム) AND category:クラシック"}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        検索
      </button>
      {searchMode === 'advanced' && (
        <p className="mt-2 text-sm text-gray-600">
          高度な検索: AND, OR, "完全一致", -除外 が使用可能です。
          例: ingredients:(ジン OR クリーム) AND category:クラシック -name:"ドライ マティーニ"
        </p>
      )}
    </form>
  )
}