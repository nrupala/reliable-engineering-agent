import { InternetSearch } from '../internet-search.js';

describe('InternetSearch', () => {
  let search;
  
  beforeAll(() => {
    search = new InternetSearch();
  });
  
  describe('search', () => {
    it('should search with multiple providers', async () => {
      const result = await search.search('Node.js');
      expect(result.query).toBe('Node.js');
      expect(result.providersWorking).toBeGreaterThan(0);
      expect(result.timestamp).toBeDefined();
    }, 30000);
  });
  
  describe('provider setup', () => {
    it('should have 5 providers configured', () => {
      expect(search.providers).toHaveLength(5);
      expect(search.providers).toContain('exa');
      expect(search.providers).toContain('duckduckgo');
      expect(search.providers).toContain('searxng');
      expect(search.providers).toContain('jina');
      expect(search.providers).toContain('wikipedia');
    });
  });
  
  describe('individual providers', () => {
    it('should handle jina failures gracefully', async () => {
      const result = await search.jinaSearch('test query');
      expect(result).toBeDefined();
      expect(result.provider).toBe('jina');
    });
    
    it('should handle wikipedia failures gracefully', async () => {
      const result = await search.wikipediaSearch('NonExistentArticleXYZ123');
      expect(result).toBeDefined();
    });
    
    it('should fetch actual wikipedia article', async () => {
      const result = await search.wikipediaSearch('Solar_panel');
      expect(result.results.length).toBeGreaterThan(0);
    }, 10000);
  });
});