import axios from 'axios';
import { WikiSearchResult, WikiArticleDetails } from '../types/wiki';

const API_BASE_URL = 'https://pt.wikipedia.org/w/api.php';

export const searchWikipedia = async (
  query: string,
  limit: number = 1
): Promise<WikiSearchResult[]> => {
  const params = {
    action: 'query',
    format: 'json',
    list: 'search',
    srsearch: query,
    srlimit: limit,
    origin: '*',
  };

  const response = await axios.get(API_BASE_URL, { params });
  const results = await Promise.all(
    response.data.query.search.map(async (result: any) => {
      const details = await getArticleDetails(result.pageid);
      return {
        pageid: result.pageid,
        title: result.title,
        snippet: result.snippet,
        timestamp: result.timestamp,
        details,
      };
    })
  );
  return results;
};

const getImageInfo = async (titles: string[]): Promise<string[]> => {
  if (!titles.length) return [];
  
  const params = {
    action: 'query',
    format: 'json',
    prop: 'imageinfo',
    titles: titles.join('|'),
    iiprop: 'url',
    origin: '*',
  };

  try {
    const response = await axios.get(API_BASE_URL, { params });
    const pages = response.data.query.pages;
    
    return Object.values(pages)
      .map((page: any) => page.imageinfo?.[0]?.url)
      .filter(Boolean);
  } catch (error) {
    console.error('Error fetching image info:', error);
    return [];
  }
};

export const getArticleDetails = async (
  pageId: number
): Promise<WikiArticleDetails> => {
  const params = {
    action: 'query',
    format: 'json',
    pageids: pageId,
    prop: 'extracts|info|categories|images|revisions',
    inprop: 'url',
    explaintext: 1,
    exsectionformat: 'wiki',
    origin: '*',
  };

  const response = await axios.get(API_BASE_URL, { params });
  const page = response.data.query.pages[pageId];
  
  // Get image titles and fetch their URLs
  const imageTitles = page.images?.map((img: any) => img.title) || [];
  const imageUrls = await getImageInfo(imageTitles);

  return {
    _categories: page.categories?.map((cat: any) => cat.title) || [],
    _content: page.extract || '',
    _html: page.extract || '',
    _images: imageUrls,
    _original_title: page.title,
    _pageid: page.pageid,
    _parent_id: page.parentid || 0,
    _revision_id: page.revisions?.[0].revid || 0,
    _section: '',
    _sections: [],
    _summary: page.extract?.substring(0, 500) || '',
    _title: page.title,
    _url: page.fullurl,
  };
};

export const getRandomArticle = async (): Promise<WikiSearchResult> => {
  const params = {
    action: 'query',
    format: 'json',
    list: 'random',
    rnlimit: 1,
    rnnamespace: 0,
    origin: '*',
  };

  const response = await axios.get(API_BASE_URL, { params });
  const randomArticle = response.data.query.random[0];
  const details = await getArticleDetails(randomArticle.id);

  return {
    pageid: randomArticle.id,
    title: randomArticle.title,
    snippet: '',
    timestamp: new Date().toISOString(),
    details,
  };
};