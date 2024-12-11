import React from 'react';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';

export const renderContent = (content: any) => {
  if (Array.isArray(content)) {
    return (
      <ul className="list-disc list-inside space-y-2">
        {content.map((item, index) => (
          <li key={index}>
            {typeof item === 'string' && item.startsWith('http') ? (
              <div className="flex flex-col gap-2">
                <img 
                  src={item} 
                  alt="Wikipedia content"
                  className="max-w-full h-auto rounded-lg shadow-md"
                  loading="lazy"
                />
                <a
                  href={item}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
                >
                  <ExternalLink size={14} />
                  Ver imagem original
                </a>
              </div>
            ) : typeof item === 'string' && item.startsWith('Ficheiro:') ? (
              <div className="flex items-center gap-2 text-blue-500">
                <ImageIcon size={16} />
                {item}
              </div>
            ) : (
              item
            )}
          </li>
        ))}
      </ul>
    );
  }

  if (typeof content === 'string') {
    if (content.startsWith('http')) {
      if (content.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return (
          <div className="flex flex-col gap-2">
            <img 
              src={content} 
              alt="Wikipedia content"
              className="max-w-full h-auto rounded-lg shadow-md"
              loading="lazy"
            />
            <a
              href={content}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline flex items-center gap-1 text-sm"
            >
              <ExternalLink size={14} />
              Ver imagem original
            </a>
          </div>
        );
      }
      return (
        <a
          href={content}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline flex items-center gap-1"
        >
          {content}
          <ExternalLink size={14} />
        </a>
      );
    }

    return <p className="whitespace-pre-wrap">{content}</p>;
  }

  return <p>{JSON.stringify(content, null, 2)}</p>;
};