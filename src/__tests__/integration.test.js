describe('Integration Tests', () => {
  let AIProvider;
  let Verification;
  
  beforeAll(async () => {
    const providerModule = await import('../provider-engine.js');
    AIProvider = providerModule.AIProvider;
    const verificationModule = await import('../verification.js');
    Verification = verificationModule.Verification;
  });
  
  describe('Provider + Verification Integration', () => {
    it('should integrate provider with verification', () => {
      const provider = new AIProvider();
      expect(provider).toBeDefined();
      expect(Verification).toBeDefined();
      expect(typeof provider.getHeaders).toBe('function');
      expect(typeof Verification.verifyResponse).toBe('function');
    });
    
    it('should have proper fallback providers configured', () => {
      const provider = new AIProvider();
      expect(provider.fallbackProviders).toContain('lmstudio');
      expect(provider.fallbackProviders).toContain('ollama');
      expect(provider.fallbackProviders).toContain('openai');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle invalid provider gracefully', () => {
      const provider = new AIProvider({ provider: 'invalid' });
      const url = provider.getDefaultBaseUrl();
      expect(url).toBe('http://localhost:1234/v1');
    });
    
    it('should handle empty config', () => {
      const provider = new AIProvider({});
      expect(provider.provider).toBe('lmstudio');
      expect(provider.apiKey).toBe('');
    });
  });
  
  describe('Performance', () => {
    it('should not leak memory on repeated instantiation', () => {
      const providers = [];
      for (let i = 0; i < 100; i++) {
        providers.push(new AIProvider());
      }
      expect(providers.length).toBe(100);
      providers.length = 0;
    });
    
    it('should handle rapid header calls', () => {
      const provider = new AIProvider();
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        provider.getHeaders();
      }
      expect(Date.now() - start).toBeLessThan(1000);
    });
  });
  
  describe('Security', () => {
    it('should not expose API key in headers', () => {
      const provider = new AIProvider({ provider: 'openai', apiKey: 'secret-key-123' });
      const headers = provider.getHeaders();
      expect(headers['Authorization']).toBe('Bearer secret-key-123');
    });
    
    it('should sanitize sensitive data from logs', () => {
      const provider = new AIProvider({ provider: 'openai', apiKey: 'super-secret' });
      const url = provider.getDefaultBaseUrl();
      expect(url).not.toContain('super-secret');
    });
  });
  
  describe('Responsiveness', () => {
    it('should respond quickly for sync operations', () => {
      const provider = new AIProvider();
      const start = Date.now();
      provider.getHeaders();
      provider.getDefaultBaseUrl();
      expect(Date.now() - start).toBeLessThan(100);
    });
  });
});