import React, { useState, useEffect } from 'react';
import { searchWikipedia, getRandomArticle } from './services/wikiApi';
import { saveSearch, getSavedSearches, clearSavedSearches } from './services/storage';
import { SavedSearch, WikiArticleDetails } from './types/wiki';
import SearchForm from './components/SearchForm';
import SavedSearches from './components/SavedSearches';
import AttributeList from './components/AttributeList';
import ArticleDetails from './components/ArticleDetails';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
import { BookOpen, BarChart2 } from 'lucide-react';

function App() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticles, setSelectedArticles] = useState<WikiArticleDetails[]>([]);
  const [selectedAttribute, setSelectedAttribute] = useState<keyof WikiArticleDetails | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'dashboard'>('content');

  useEffect(() => {
    setSearches(getSavedSearches());
  }, []);

  const handleSearch = async (query: string, limit: number) => {
    setLoading(true);
    try {
      const results = await searchWikipedia(query, limit);
      const newSearch: SavedSearch = {
        query,
        results,
        timestamp: new Date().toISOString(),
      };
      saveSearch(newSearch);
      setSearches(getSavedSearches());
    } catch (error) {
      console.error('Erro na pesquisa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRandomSearch = async () => {
    setLoading(true);
    try {
      const result = await getRandomArticle();
      const newSearch: SavedSearch = {
        query: 'Aleatório',
        results: [result],
        timestamp: new Date().toISOString(),
      };
      saveSearch(newSearch);
      setSearches(getSavedSearches());
    } catch (error) {
      console.error('Erro na pesquisa aleatória:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearSearches = () => {
    clearSavedSearches();
    setSearches([]);
    setSelectedArticles([]);
    setSelectedAttribute(null);
  };

  const toggleArticleSelection = (details: WikiArticleDetails) => {
    setSelectedArticles(prev => {
      const isSelected = prev.some(article => article._pageid === details._pageid);
      if (isSelected) {
        return prev.filter(article => article._pageid !== details._pageid);
      } else {
        return [...prev, details];
      }
    });
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BookOpen size={32} className="text-blue-500" />
              <h1 className="text-3xl font-bold dark:text-white">Wiki Search</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Pesquise, salve e explore artigos da Wikipédia
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <SearchForm onSearch={handleSearch} onRandomSearch={handleRandomSearch} />
            
            {loading && (
              <div className="text-center my-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Carregando...</p>
              </div>
            )}

            <div className="mt-8 grid grid-cols-12 gap-6">
              <div className="col-span-4 space-y-6">
                <SavedSearches 
                  searches={searches} 
                  onClear={handleClearSearches} 
                  onToggleSelection={toggleArticleSelection}
                  selectedArticles={selectedArticles}
                />
                <AttributeList 
                  onSelectAttribute={setSelectedAttribute}
                  selectedAttribute={selectedAttribute}
                />
              </div>
              <div className="col-span-8">
                <div className="mb-4 border-b dark:border-gray-700">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('content')}
                      className={`px-4 py-2 font-medium transition-colors relative ${
                        activeTab === 'content'
                          ? 'text-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      Conteúdo
                      {activeTab === 'content' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className={`px-4 py-2 font-medium transition-colors relative flex items-center gap-2 ${
                        activeTab === 'dashboard'
                          ? 'text-blue-500'
                          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                      }`}
                    >
                      <BarChart2 size={16} />
                      Dashboard
                      {activeTab === 'dashboard' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="border rounded-lg dark:border-gray-700">
                  {activeTab === 'content' ? (
                    <ArticleDetails 
                      articles={selectedArticles}
                      selectedAttribute={selectedAttribute}
                    />
                  ) : (
                    <Dashboard
                      articles={selectedArticles}
                      selectedAttribute={selectedAttribute}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;