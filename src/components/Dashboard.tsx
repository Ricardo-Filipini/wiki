import React, { useMemo, useState } from 'react';
import { WikiArticleDetails } from '../types/wiki';
import { getNgramFrequency, getTextFromArticle, NgramData } from '../utils/textAnalysis';
import FrequencyChart from './FrequencyChart';

interface DashboardProps {
  articles: WikiArticleDetails[];
  selectedAttribute: keyof WikiArticleDetails | null;
}

export default function Dashboard({ articles, selectedAttribute }: DashboardProps) {
  const [ngramSize, setNgramSize] = useState(1);
  const [selectedNgram, setSelectedNgram] = useState<NgramData | null>(null);

  const { text, ngramData } = useMemo(() => {
    if (!articles.length || !selectedAttribute) {
      return { text: '', ngramData: [] };
    }

    const combinedText = articles
      .map(article => getTextFromArticle(article, selectedAttribute))
      .join('\n\n');

    return {
      text: combinedText,
      ngramData: getNgramFrequency(combinedText, ngramSize)
    };
  }, [articles, selectedAttribute, ngramSize]);

  const highlightText = (text: string, ngram: NgramData | null) => {
    if (!ngram) return text;

    const parts: { text: string; highlight: boolean }[] = [];
    let lastIndex = 0;

    ngram.positions.forEach(position => {
      // Add non-highlighted text before match
      if (position > lastIndex) {
        parts.push({
          text: text.slice(lastIndex, position),
          highlight: false
        });
      }
      // Add highlighted match
      parts.push({
        text: text.slice(position, position + ngram.ngram.length),
        highlight: true
      });
      lastIndex = position + ngram.ngram.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({
        text: text.slice(lastIndex),
        highlight: false
      });
    }

    return (
      <div>
        {parts.map((part, i) => (
          <span
            key={i}
            className={part.highlight ? 'bg-yellow-200 dark:bg-yellow-900' : ''}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  if (!articles.length || !selectedAttribute) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 min-h-[calc(100vh-12rem)]">
        Selecione um ou mais artigos e um atributo para visualizar as estatísticas
      </div>
    );
  }

  if (selectedAttribute === '_images') {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400 min-h-[calc(100vh-12rem)]">
        Análise de frequência não disponível para imagens
      </div>
    );
  }

  return (
    <div className="p-4 grid grid-cols-12 gap-6 min-h-[calc(100vh-12rem)]">
      <div className="col-span-12 flex items-center gap-4">
        <label className="text-sm font-medium dark:text-gray-300">
          Tamanho do N-grama:
        </label>
        <input
          type="range"
          min="1"
          max="8"
          value={ngramSize}
          onChange={(e) => {
            setNgramSize(Number(e.target.value));
            setSelectedNgram(null);
          }}
          className="w-48"
        />
        <span className="text-sm dark:text-gray-300">{ngramSize}</span>
      </div>
      
      <div className="col-span-4">
        <FrequencyChart
          data={ngramData}
          title={`Frequência de ${ngramSize}-gramas`}
          onSelectNgram={setSelectedNgram}
          selectedNgram={selectedNgram}
        />
      </div>
      
      <div className="col-span-8 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md overflow-auto">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Texto Original</h3>
        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
          {highlightText(text, selectedNgram)}
        </div>
      </div>
    </div>
  );
}