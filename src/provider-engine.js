// Multi-provider engine supporting LM Studio, Ollama, and OpenAI with fallback
class AIProvider {
  constructor(config = {}) {
    this.provider = config.provider || 'lmstudio'; // lmstudio, ollama, openai
    this.apiKey = config.apiKey || '';
    this.baseUrl = config.baseUrl || this.getDefaultBaseUrl();
    this.models = [];
    this.fallbackProviders = ['lmstudio', 'ollama', 'openai'];
  }
  
  getDefaultBaseUrl() {
    switch (this.provider) {
      case 'lmstudio':
        return 'http://localhost:1234/v1';
      case 'ollama':
        return 'http://localhost:11434/v1';
      case 'openai':
        return 'https://api.openai.com/v1';
      default:
        return 'http://localhost:1234/v1';
    }
  }
  
  async fetchModels() {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: this.getHeaders(),
        method: 'GET'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }
      
      const data = await response.json();
      this.models = data.data || [];
      return this.models;
    } catch (error) {
      console.warn(`Error fetching models from ${this.provider}:`, error.message);
      // Try fallback providers
      return await this.tryFallbackProviders('fetchModels');
    }
  }
  
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.provider === 'openai' && this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    } else if (this.provider === 'lmstudio') {
      // LM Studio doesn't require a real API key but expects the header
      headers['Authorization'] = `Bearer ${this.apiKey || 'lm-studio'}`;
    }
    // Ollama doesn't require authentication by default
    
    return headers;
  }
  
  async tryFallbackProviders(methodName, ...args) {
    const providersToTry = this.fallbackProviders.filter(p => p !== this.provider);
    const triedProviders = new Set([this.provider]);
    
    for (const provider of providersToTry) {
      if (triedProviders.has(provider)) continue;
      triedProviders.add(provider);
      
      try {
        console.log(`Trying fallback provider: ${provider}`);
        this.provider = provider;
        this.baseUrl = this.getDefaultBaseUrl();
        
        if (methodName === 'fetchModels') {
          const response = await fetch(`${this.baseUrl}/models`, {
            headers: this.getHeaders(),
            method: 'GET'
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch models: ${response.status}`);
          }
          
          const data = await response.json();
          this.models = data.data || [];
          return this.models;
        } else if (methodName === 'chatCompletion') {
          const result = await this._doChatCompletion(args[0], args[1] || {});
          return result;
        }
      } catch (error) {
        console.warn(`Fallback provider ${provider} failed:`, error.message);
      }
    }
    
    throw new Error('All providers failed');
  }
  
  async _doChatCompletion(messages, options = {}) {
    const provider = options.provider || this.provider;
    const model = options.model || await this.getDefaultModel(provider);
    const temperature = options.temperature !== undefined ? options.temperature : 0.1;
    const maxTokens = options.max_tokens || 1000;
    const stream = options.stream || false;
    
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        stream: stream
      })
    });
    
    if (!response.ok) {
      throw new Error(`Chat completion failed: ${response.status}`);
    }
    
    if (stream) {
      return response.body;
    }
    
    return await response.json();
  }
  
  async chatCompletion(messages, options = {}) {
    const provider = options.provider || this.provider;
    const model = options.model || await this.getDefaultModel(provider);
    const temperature = options.temperature !== undefined ? options.temperature : 0.1;
    const maxTokens = options.max_tokens || 1000;
    const stream = options.stream || false;
    
    // Temporarily switch to the specified provider for this request
    const originalProvider = this.provider;
    this.provider = provider;
    this.baseUrl = this.getDefaultBaseUrlForProvider(provider);
    
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: stream
        })
      });
      
      if (!response.ok) {
        throw new Error(`Chat completion failed: ${response.status}`);
      }
      
      if (stream) {
        return response.body; // Return readable stream for streaming
      }
      
      return await response.json();
    } catch (error) {
      // Try fallback providers for this specific request
      console.warn(`Primary provider ${provider} failed, trying fallbacks:`, error.message);
      this.provider = originalProvider; // Reset to original
      return await this.tryFallbackProviders('chatCompletion', messages, {...options, provider: undefined});
    } finally {
      // Restore original provider
      this.provider = originalProvider;
      this.baseUrl = this.getDefaultBaseUrl();
    }
  }
  
  getDefaultBaseUrlForProvider(provider) {
    switch (provider) {
      case 'lmstudio':
        return 'http://localhost:1234/v1';
      case 'ollama':
        return 'http://localhost:11434/v1';
      case 'openai':
        return 'https://api.openai.com/v1';
      default:
        return 'http://localhost:1234/v1';
    }
  }
  
  async getDefaultModel(provider) {
    try {
      const originalProvider = this.provider;
      this.provider = provider;
      this.baseUrl = this.getDefaultBaseUrlForProvider(provider);
      
      const models = await this.fetchModels();
      
      // Restore original provider
      this.provider = originalProvider;
      this.baseUrl = this.getDefaultBaseUrl();
      
      if (models.length > 0) {
        return models[0].id;
      }
    } catch (error) {
      console.warn(`Could not fetch models for ${provider}:`, error.message);
    }
    
    // Return known model names as fallback
    const fallbackModels = {
      lmstudio: 'deepseek-r1-0528-qwen3-8b',
      ollama: 'llama2',
      openai: 'gpt-3.5-turbo'
    };
    
    return fallbackModels[provider] || 'unknown';
  }
  
  async completion(prompt, options = {}) {
    // Convert prompt to messages format for chat completion
    const messages = [{ role: 'user', content: prompt }];
    const result = await this.chatCompletion(messages, options);
    return result;
  }
}

// Export for use in Node.js with ES modules
export { AIProvider };