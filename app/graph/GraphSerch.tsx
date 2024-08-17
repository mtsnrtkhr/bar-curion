'use client'

import { useState } from 'react'

type GraphSearchProps = {
  onSearch: (term: string) => void;
}

export default function GraphSearch({ onSearch }: GraphSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="カクテル名や材料名で検索..."
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        検索
      </button>
    </form>
  )
}