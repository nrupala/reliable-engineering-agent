class InternetSearch {
  constructor() {
    this.providers = ['exa', 'duckduckgo', 'searxng', 'jina', 'wikipedia'];
  }

  async search(query, options = {}) {
    const results = await Promise.allSettled([
      this.exaSearch(query),
      this.duckduckgoSearch(query),
      this.searxngSearch(query),
      this.jinaSearch(query),
      this.wikipediaSearch(query)
    ]);

    const successful = results
      .filter(r => r.status === 'fulfilled' && r.value)
      .map(r => r.value);

    return {
      query,
      results: successful,
      providersWorking: successful.length,
      timestamp: new Date().toISOString()
    };
  }

  async exaSearch(query) {
    try {
      const Exa = (await import('exa-js')).default;
      const exa = new Exa();
      const results = await exa.search(query, { numResults: 5 });
      return {
        provider: 'exa',
        results: results.results?.map(r => ({ title: r.title, url: r.url, snippet: r.text })) || []
      };
    } catch {
      return null;
    }
  }

  async duckduckgoSearch(query) {
    try {
      const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      const html = await response.text();
      const results = [];
      const matches = html.match(/<a class="result__a" href="([^"]+)"[^>]*>([^<]+)<\/a>/g);
      if (matches) {
        for (const m of matches.slice(0, 5)) {
          const urlMatch = m.match(/href="([^"]+)"/);
          const titleMatch = m.replace(/<[^>]+>/g, '').trim();
          if (urlMatch && titleMatch) {
            results.push({ title: titleMatch, url: urlMatch[1] });
          }
        }
      }
      return { provider: 'duckduckgo', results: results.slice(0, 5) };
    } catch {
      return null;
    }
  }

  async searxngSearch(query) {
    try {
      const response = await fetch(`https://searx.be/search?q=${encodeURIComponent(query)}&format=json`);
      const data = await response.json();
      return {
        provider: 'searxng',
        results: data.results?.slice(0, 5).map(r => ({ title: r.title, url: r.url })) || []
      };
    } catch {
      return null;
    }
  }

  async jinaSearch(query) {
    try {
      const response = await fetch(`https://r.jina.ai/http://duckduckgo.com/?q=${encodeURIComponent(query)}`);
      const text = await response.text();
      return {
        provider: 'jina',
        results: [{ title: 'Search Summary', url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`, snippet: text.slice(0, 500) }]
      };
    } catch {
      return null;
    }
  }

  async wikipediaSearch(query) {
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
      const data = await response.json();
      return {
        provider: 'wikipedia',
        results: data.title ? [{ title: data.title, url: data.content_urls?.desktop?.page, snippet: data.extract }] : []
      };
    } catch {
      return null;
    }
  }
}

export { InternetSearch };