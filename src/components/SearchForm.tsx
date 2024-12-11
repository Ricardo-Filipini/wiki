import React, { useState } from 'react';
import { Search, Shuffle } from 'lucide-react';

interface SearchFormProps {
  onSearch: (query: string, limit: number) => void;
  onRandomSearch: () => void;
}

export default function SearchForm({ onSearch, onRandomSearch }: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, limit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Digite sua pesquisa..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <Search size={20} />
          Pesquisar
        </button>
        <button
          type="button"
          onClick={onRandomSearch}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
        >
          <Shuffle size={20} />
          Aleatório
        </button>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="limit" className="text-sm text-gray-600">
          Número de resultados:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="px-2 py-1 border rounded-lg"
        >
          <option value={1}>1</option>
          <option value={3}>3</option>
          <option value={5}>5</option>
        </select>
      </div>
    </form>
  );
}