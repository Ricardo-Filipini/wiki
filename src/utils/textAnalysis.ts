import { WikiArticleDetails } from '../types/wiki';

export interface NgramData {
  ngram: string;
  count: number;
  percentage: number;
  positions: number[];
}

export const getNgramFrequency = (text: string, n: number): NgramData[] => {
  if (!text || n < 1) return [];
  
  const chars = text.toLowerCase();
  const ngrams: string[] = [];
  const frequency: { [key: string]: { count: number; positions: number[] } } = {};

  for (let i = 0; i <= chars.length - n; i++) {
    const ngram = chars.slice(i, i + n);
    if (new RegExp(`^[a-záàâãéèêíïóôõöúçñ]{${n}}$`).test(ngram)) {
      ngrams.push(ngram);
      if (!frequency[ngram]) {
        frequency[ngram] = { count: 0, positions: [] };
      }
      frequency[ngram].count++;
      frequency[ngram].positions.push(i);
    }
  }

  const total = ngrams.length;

  return Object.entries(frequency)
    .map(([ngram, { count, positions }]) => ({
      ngram,
      count,
      percentage: (count / total) * 100,
      positions
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15); // Top 15 most frequent n-grams
};

export const getTextFromArticle = (article: WikiArticleDetails, attribute: keyof WikiArticleDetails): string => {
  const content = article[attribute];
  
  if (typeof content === 'string') {
    return content;
  }
  
  if (Array.isArray(content)) {
    return content.join(' ');
  }
  
  return '';
};