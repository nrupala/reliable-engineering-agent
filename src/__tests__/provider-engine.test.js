describe('AIProvider', () => {
  let AIProvider;
  
  beforeAll(async () => {
    const module = await import('../provider-engine.js');
    AIProvider = module.AIProvider;
  });
  
  describe('getHeaders', () => {
    it('should return correct headers for LM Studio', () => {
      const provider = new AIProvider({ provider: 'lmstudio' });
      const headers = provider.getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Authorization']).toBe('Bearer lm-studio');
    });
    
    it('should return correct headers for OpenAI with API key', () => {
      const provider = new AIProvider({ provider: 'openai', apiKey: 'test-key' });
      const headers = provider.getHeaders();
      expect(headers['Authorization']).toBe('Bearer test-key');
    });
    
    it('should return empty headers for Ollama', () => {
      const provider = new AIProvider({ provider: 'ollama' });
      const headers = provider.getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['Authorization']).toBeUndefined();
    });
  });
  
  describe('getDefaultBaseUrl', () => {
    it('should return LM Studio URL for lmstudio provider', () => {
      const provider = new AIProvider({ provider: 'lmstudio' });
      expect(provider.getDefaultBaseUrl()).toBe('http://localhost:1234/v1');
    });
    
    it('should return Ollama URL for ollama provider', () => {
      const provider = new AIProvider({ provider: 'ollama' });
      expect(provider.getDefaultBaseUrl()).toBe('http://localhost:11434/v1');
    });
    
    it('should return OpenAI URL for openai provider', () => {
      const provider = new AIProvider({ provider: 'openai' });
      expect(provider.getDefaultBaseUrl()).toBe('https://api.openai.com/v1');
    });
  });
  
  describe('constructor', () => {
    it('should use default provider when not specified', () => {
      const provider = new AIProvider();
      expect(provider.provider).toBe('lmstudio');
    });
    
    it('should use custom provider when specified', () => {
      const provider = new AIProvider({ provider: 'ollama' });
      expect(provider.provider).toBe('ollama');
    });
    
    it('should initialize with empty models array', () => {
      const provider = new AIProvider();
      expect(provider.models).toEqual([]);
    });
  });
});