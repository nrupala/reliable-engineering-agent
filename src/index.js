// Main entry point that determines whether to run in CLI or web mode
import { AIProvider } from './provider-engine.js';
import { CLI } from './cli.js';
import { WebServer } from './web-server.js';

async function main() {
  const args = process.argv.slice(2);
  
  // Initialize the AI provider (defaults to LM Studio)
  const provider = new AIProvider();
  
  // Try to fetch available models
  try {
    await provider.fetchModels();
    console.log(`Initialized AI provider with ${provider.models.length} models`);
  } catch (error) {
    console.warn('Could not connect to LM Studio, using fallback models:', error.message);
  }
  
  // Determine mode based on arguments
  if (args.includes('--web') || args.includes('-w')) {
    const webServer = new WebServer(provider);
    await webServer.start();
  } else if (args.includes('--cli') || args.includes('-c') || args.length === 0) {
    // Default to CLI mode if no specific mode is specified
    const cli = new CLI(provider);
    await cli.start();
  } else {
    // Show help if invalid arguments
    console.log('Usage:');
    console.log('  node src/index.js          # Start in CLI mode (default)');
    console.log('  node src/index.js --cli    # Start in CLI mode');
    console.log('  node src/index.js --web    # Start in web server mode');
    process.exit(1);
  }
}

// Run main function and handle errors
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});