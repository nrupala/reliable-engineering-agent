import { AIProvider } from './src/provider-engine.js';

async function testProvider() {
  console.log('Testing AI Provider with LM Studio...');
  
  // Create provider instance
  const provider = new AIProvider({ provider: 'lmstudio' });
  
  try {
    // Fetch models
    console.log('Fetching models...');
    const models = await provider.fetchModels();
    console.log(`Found ${models.length} models:`);
    models.slice(0, 5).forEach((model, index) => {
      console.log(`  ${index + 1}. ${model.id}`);
    });
    if (models.length > 5) {
      console.log(`  ... and ${models.length - 5} more`);
    }
    
    // Test chat completion
    if (models.length > 0) {
      console.log('\nTesting chat completion...');
      const response = await provider.chatCompletion([
        { role: 'user', content: 'Say hello in a technical way and mention one assumption you are making.' }
      ], {
        model: models[0].id,
        temperature: 0.1,
        max_tokens: 100
      });
      
      console.log('Response:');
      console.log(response.choices[0].message.content);
      
      // Test verification
      const { Verification } = await import('./src/verification.js');
      const verificationResult = Verification.verifyResponse(response.choices[0].message.content);
      console.log('\nVerification Result:');
      console.log(`Valid: ${verificationResult.valid}`);
      console.log(`Feedback: ${verificationResult.feedback}`);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run the test
testProvider().catch(console.error);