import React from 'react';
import { WikiArticleDetails } from '../types/wiki';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { renderContent } from '../utils/contentRenderer';

interface ArticleDetailsProps {
  articles: WikiArticleDetails[];
  selectedAttribute: keyof WikiArticleDetails | null;
}

export default function ArticleDetails({
  articles,
  selectedAttribute,
}: ArticleDetailsProps) {
  if (articles.length === 0 || !selectedAttribute) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 min-h-[calc(100vh-12rem)]">
        Selecione um ou mais artigos e um atributo para visualizar os detalhes
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8 overflow-auto min-h-[calc(100vh-12rem)] max-h-[calc(100vh-12rem)] dark:text-gray-200">
      {articles.map((article) => (
        <div
          key={article._pageid}
          className="border-b pb-6 last:border-b-0 last:pb-0 dark:border-gray-700"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-xl font-semibold">{article._title}</h3>
            <a
              href={article._url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              <ExternalLink size={16} />
            </a>
          </div>
          <h4 className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">
            {selectedAttribute.replace('_', ' ').toUpperCase()}
          </h4>
          <div className="prose dark:prose-invert max-w-none">
            {renderContent(article[selectedAttribute])}
          </div>
        </div>
      ))}
    </div>
  );
}