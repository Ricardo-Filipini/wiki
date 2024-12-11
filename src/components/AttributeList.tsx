import React from 'react';
import { WikiArticleDetails } from '../types/wiki';

interface AttributeListProps {
  onSelectAttribute: (attr: keyof WikiArticleDetails) => void;
  selectedAttribute: keyof WikiArticleDetails | null;
}

export default function AttributeList({ onSelectAttribute, selectedAttribute }: AttributeListProps) {
  const attributes: (keyof WikiArticleDetails)[] = [
    '_categories',
    '_content',
    '_html',
    '_images',
    '_original_title',
    '_pageid',
    '_parent_id',
    '_revision_id',
    '_section',
    '_sections',
    '_summary',
    '_title',
    '_url',
  ];

  return (
    <div className="border rounded-lg dark:border-gray-700">
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-2">
        <h2 className="text-lg font-semibold dark:text-white">Atributos</h2>
      </div>
      <div className="grid grid-cols-2 gap-1 p-2">
        {attributes.map((attr) => (
          <button
            key={attr}
            onClick={() => onSelectAttribute(attr)}
            className={`p-2 rounded-lg text-left transition-colors ${
              selectedAttribute === attr
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300'
            }`}
          >
            {attr.replace('_', ' ')}
          </button>
        ))}
      </div>
    </div>
  );
}