export interface WikiArticleDetails {
  _categories: string[];
  _content: string;
  _html: string;
  _images: string[];
  _original_title: string;
  _pageid: number;
  _parent_id: number;
  _revision_id: number;
  _section: string;
  _sections: string[];
  _summary: string;
  _title: string;
  _url: string;
}

export interface WikiSearchResult {
  pageid: number;
  title: string;
  snippet: string;
  timestamp: string;
  details?: WikiArticleDetails;
}

export interface SavedSearch {
  query: string;
  results: WikiSearchResult[];
  timestamp: string;
}