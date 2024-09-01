'use client'

import { useState } from 'react'
import { searchRecipes } from '../lib/clientDB'

export default function RecipeSearch({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchMode, setSearchMode] = useState('simple')

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const results = await searchRecipes(searchTerm, searchMode === 'advanced')
      onSearch(results)
    } catch (error) {
      console.error('Search error:', error)
      // ユーザーにエラーメッセージを表示するなどの処理を追加
    }
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
          : "例: ingredients:ジン category:クラシック"}
        className="w-full p-2 border rounded  text-black"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        検索
      </button>
      {searchMode === 'simple' && (
        <p className="mt-2 text-sm text-gray-600">
          ヒント: 複数のキーワードはAND検索になります。完全一致検索には&quot;&quot;を使用してください。
          例: &quot;ドライ マティーニ&quot; ジン
        </p>
      )}
      {searchMode === 'advanced' && (
        <p className="mt-2 text-sm text-gray-600">
          高度な検索: キーを指定して検索できます（キー: name, ingredients, ingredients.name, ingredients.type, ingredients.amount, instructions, category:）。
          標準は完全一致で、前方一致には末尾に*、後方一致には先頭に*を使用できます。
          除外検索にはキーの前に-を付けてください。
          ingredientsは詳細なキーを指定しない場合は全項目が検索対象になります。
          例: -ingredients:クリーム,*ティーニ name:ホッパー
        </p>
      )}
    </form>
  )
}