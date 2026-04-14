import { AIProvider } from './provider-engine.js';
import { InternetSearch } from './internet-search.js';

class AIProviderWithInternet extends AIProvider {
  constructor(config = {}) {
    super(config);
    this.search = new InternetSearch();
    this.autoSearch = config.autoSearch !== false;
    this.maxSearchResults = config.maxSearchResults || 3;
  }

  async chatCompletion(messages, options = {}) {
    const lastMessage = messages[messages.length - 1]?.content || '';
    
    if (this.shouldSearch(lastMessage)) {
      console.log('[Internet] Fetching additional context...');
      const searchResults = await this.search.search(lastMessage);
      
      if (searchResults.results.length > 0) {
        const context = this.formatSearchContext(searchResults);
        messages = [
          ...messages,
          { role: 'system', content: `Additional context from internet searches:\n${context}` }
        ];
      }
    }
    
    return super.chatCompletion(messages, options);
  }

  shouldSearch(query) {
    if (!this.autoSearch) return false;
    const searchTriggers = [
      'what is', 'how does', 'latest', 'current',
      'research', 'update', 'news', '2024', '2025', '2026',
      'statistics', 'data', 'study', 'compare'
    ];
    const lower = query.toLowerCase();
    return searchTriggers.some(trigger => lower.includes(trigger));
  }

  formatSearchContext(searchResults) {
    let context = '';
    for (const provider of searchResults.results) {
      if (provider.results?.length > 0) {
        context += `\n[${provider.provider.toUpperCase()}]\n`;
        for (const r of provider.results.slice(0, this.maxSearchResults)) {
          if (r.url) context += `- ${r.title}: ${r.url}\n`;
        }
      }
    }
    return context || 'No results found';
  }

  async searchAndReply(query, options = {}) {
    const searchResults = await this.search.search(query);
    const searchContext = this.formatSearchContext(searchResults);
    
    const messages = [
      { role: 'system', content: 'You are a helpful AI assistant with internet search context available.' },
      { role: 'user', content: `${query}\n\nSearch Results:\n${searchContext}` }
    ];
    
    return super.chatCompletion(messages, options);
  }
}

export { AIProviderWithInternet };