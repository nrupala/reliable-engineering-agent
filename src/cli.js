// CLI interface for the Reliable Engineering Agent
import { createInterface } from 'node:readline';

export class CLI {
  constructor(provider) {
    this.provider = provider;
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log('\x1b[34m%s\x1b[0m', '=== Reliable Engineering Agent (CLI Mode) ===');
    console.log('\x1b[32m%s\x1b[0m', 'Type your requests or "help" for commands, "exit" to quit\n');

    while (true) {
      try {
        const input = await this.prompt('\x1b[33m> \x1b[0m');
        
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
          console.log('\x1b[34m%s\x1b[0m', 'Goodbye!');
          break;
        }
        
        if (input.toLowerCase() === 'help') {
          this.showHelp();
          continue;
        }
        
        if (input.toLowerCase() === 'models') {
          await this.listModels();
          continue;
        }
        
        if (input.toLowerCase() === 'provider') {
          await this.showProviderInfo();
          continue;
        }
        
        if (input.toLowerCase() === 'verify') {
          console.log('\x1b[33m%s\x1b[0m', 'Enter text to verify (or "cancel" to go back):');
          const verifyInput = await this.prompt('\x1b[33m> \x1b[0m');
          if (verifyInput.toLowerCase() !== 'cancel') {
            await this.verifyText(verifyInput);
          }
          continue;
        }
        
        if (input.trim() === '') {
          continue;
        }
        
        // Process the user's request
        await this.processRequest(input);
      } catch (error) {
        console.log('\x1b[31m%s\x1b[0m', 'Error:', error.message);
      }
    }
    
    this.rl.close();
  }

  prompt(query) {
    return new Promise(resolve => {
      this.rl.question(query, resolve);
    });
  }

  async showHelp() {
    console.log('\x1b[36m%s\x1b[0m', '\nAvailable Commands:');
    console.log('\x1b[37m%s\x1b[0m', '  help     - Show this help message');
    console.log('\x1b[37m%s\x1b[0m', '  models   - List available models');
    console.log('\x1b[37m%s\x1b[0m', '  provider - Show current provider info');
    console.log('\x1b[37m%s\x1b[0m', '  verify   - Verify text against engineering guidelines');
    console.log('\x1b[37m%s\x1b[0m', '  exit     - Exit the application');
    console.log('\x1b[37m%s\x1b[0m', '  <anything else> - Send to the AI agent for processing\n');
  }

  async showProviderInfo() {
    console.log('\x1b[36m%s\x1b[0m', '\nCurrent Provider Information:');
    console.log('\x1b[37m%s\x1b[0m', `  Provider: ${this.provider.provider}`);
    console.log('\x1b[37m%s\x1b[0m', `  Base URL: ${this.provider.baseUrl}`);
    console.log('\x1b[37m%s\x1b[0m', `  Models Loaded: ${this.provider.models.length}\n`);
  }

  async verifyText(text) {
    console.log('\x1b[34m%s\x1b[0m', '\nVerifying text against engineering guidelines...');
    const { Verification } = await import('./verification.js');
    const result = Verification.verifyResponse(text);
    
    if (result.valid) {
      console.log('\x1b[32m%s\x1b[0m', '✓ ' + result.feedback);
    } else {
      console.log('\x1b[31m%s\x1b[0m', '✗ ' + result.feedback);
      
      // Show individual check results
      console.log('\x1b[33m%s\x1b[0m', '\nDetailed Checks:');
      console.log('\x1b[37m%s\x1b[0m', `  Assumptions: ${result.checks.assumptions.valid ? '✓' : '✗'} ${result.checks.assumptions.feedback}`);
      console.log('\x1b[37m%s\x1b[0m', `  Verification: ${result.checks.verification.valid ? '✓' : '✗'} ${result.checks.verification.feedback}`);
      console.log('\x1b[37m%s\x1b[0m', `  Failure Modes: ${result.checks.failureModes.valid ? '✓' : '✗'} ${result.checks.failureModes.feedback}\n`);
    }
  }

  async listModels() {
    try {
      const models = await this.provider.fetchModels();
      console.log('\x1b[36m%s\x1b[0m', '\nAvailable Models:');
      models.forEach((model, index) => {
        console.log('\x1b[37m%s\x1b[0m', `  ${index + 1}. ${model.id}`);
      });
      console.log('');
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', 'Error fetching models:', error.message);
    }
  }

  async processRequest(userInput) {
    console.log('\x1b[34m%s\x1b[0m', '\nProcessing your request...');
    
    try {
      const response = await this.provider.chatCompletion([
        { role: 'system', content: 'You are a helpful AI assistant that follows strict engineering principles. Always state assumptions, verify correctness, and generate tests when appropriate.' },
        { role: 'user', content: userInput }
      ], {
        temperature: 0.1,
        max_tokens: 2000
      });
      
      const agentResponse = response.choices[0].message.content;
      
      // Verify the agent's response
      const { Verification } = await import('./verification.js');
      const verificationResult = Verification.verifyResponse(agentResponse);
      
      console.log('\x1b[32m%s\x1b[0m', '\nResponse:');
      console.log('\x1b[37m%s\x1b[0m', agentResponse);
      
      // Show verification status
      if (verificationResult.valid) {
        console.log('\x1b[32m%s\x1b[0m', '\n✓ Response passes engineering guidelines verification\n');
      } else {
        console.log('\x1b[33m%s\x1b[0m', '\n⚠ Response verification notes:');
        console.log('\x1b[37m%s\x1b[0m', verificationResult.feedback + '\n');
      }
    } catch (error) {
      console.log('\x1b[31m%s\x1b[0m', 'Error processing request:', error.message);
    }
  }
}