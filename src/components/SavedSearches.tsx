import React from 'react';
import { SavedSearch, WikiArticleDetails } from '../types/wiki';
import { Clock, Trash2, Check } from 'lucide-react';

interface SavedSearchesProps {
  searches: SavedSearch[];
  onClear: () => void;
  onToggleSelection: (details: WikiArticleDetails) => void;
  selectedArticles: WikiArticleDetails[];
}

export default function SavedSearches({ 
  searches, 
  onClear, 
  onToggleSelection, 
  selectedArticles 
}: SavedSearchesProps) {
  if (searches.length === 0) {
    return null;
  }

  const isSelected = (details: WikiArticleDetails | undefined) => {
    return details && selectedArticles.some(article => article._pageid === details._pageid);
  };

  return (
    <div className="border rounded-lg dark:border-gray-700">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-2 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold dark:text-white">Pesquisas Salvas</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {selectedArticles.length} selecionado(s)
          </p>
        </div>
        <button
          onClick={onClear}
          className="px-2 py-1 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-1"
        >
          <Trash2 size={14} />
          Limpar
        </button>
      </div>
      <div className="divide-y dark:divide-gray-700">
        {searches.map((search, index) => (
          <div key={index} className="p-3 dark:text-gray-300">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">"{search.query}"</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock size={14} className="mr-1" />
                {new Date(search.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="space-y-1">
              {search.results.map((result) => (
                <button
                  key={result.pageid}
                  onClick={() => result.details && onToggleSelection(result.details)}
                  className={`w-full text-left p-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isSelected(result.details)
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {isSelected(result.details) && (
                    <Check size={16} className="flex-shrink-0" />
                  )}
                  <p className="font-medium">{result.title}</p>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}