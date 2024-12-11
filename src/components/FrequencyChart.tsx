import React from 'react';
import { NgramData } from '../utils/textAnalysis';

interface FrequencyChartProps {
  data: NgramData[];
  title: string;
  onSelectNgram: (ngram: NgramData) => void;
  selectedNgram: NgramData | null;
}

export default function FrequencyChart({ data, title, onSelectNgram, selectedNgram }: FrequencyChartProps) {
  const maxPercentage = Math.max(...data.map(item => item.percentage));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">{title}</h3>
      <div className="space-y-2">
        {data.map((item) => (
          <button
            key={item.ngram}
            className={`w-full text-left transition-colors ${
              selectedNgram?.ngram === item.ngram
                ? 'bg-blue-50 dark:bg-blue-900/20'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
            } rounded-lg p-2`}
            onClick={() => onSelectNgram(item)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium dark:text-gray-300">
                {item.ngram}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {item.count}x ({item.percentage.toFixed(2)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(item.percentage / maxPercentage) * 100}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}