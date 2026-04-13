# Reliable Engineering Agent

A disciplined AI coding agent with web and CLI interfaces that follows strict engineering principles. Built to work with LM Studio GGUF models and supports fallback to Ollama and OpenAI APIs.

## Features

- **Multi-provider Support**: Works with LM Studio (GGUF), Ollama, and OpenAI APIs with automatic fallback
- **Dual Interface**: Both command-line and web-based interfaces
- **Engineering Principles**: Built-in verification for assumptions, testing, and failure mode consideration
- **Extensible Design**: Modular architecture for easy enhancement

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have one of the following running:
   - [LM Studio](https://lmstudio.ai/) with a model loaded (default: http://localhost:1234)
   - [Ollama](https://ollama.ai/) with a model loaded (default: http://localhost:11434)
   - OpenAI API key (set as OPENAI_API_KEY environment variable)

## Usage

### CLI Mode

Start the agent in command-line interface mode:
```bash
npm start
# or
node src/index.js
```

Available commands in CLI:
- `help` - Show available commands
- `models` - List available models from current provider
- `provider` - Show current provider information
- `verify` - Verify text against engineering guidelines
- `exit` - Quit the application
- Any other input - Send to the AI agent for processing

### Web Mode

Start the agent in web server mode:
```bash
npm run web
# or
node src/index.js --web
```

Then open your browser to `http://localhost:3000`

The web interface provides:
- Chat interface with the AI agent
- Model selection dropdown
- Real-time communication via WebSocket
- Fallback to REST API if WebSocket unavailable

## Architecture

### Provider Engine (`src/provider-engine.js`)
- Supports LM Studio, Ollama, and OpenAI APIs
- Automatic fallback between providers
- Configurable model selection and parameters

### CLI Interface (`src/cli.js`)
- Interactive command-line interface
- Built-in verification mechanisms
- Help system and model listing

### Web Server (`src/web-server.js`)
- Express.js server with REST API endpoints
- WebSocket support for real-time communication
- Serves static web assets

### Verification System (`src/verification.js`)
- Checks for explicitly stated assumptions
- Verifies presence of testing/validation approaches
- Ensures failure modes are considered
- Follows the agent's engineering guidelines

## Configuration

The agent can be configured through:
- Environment variables (for API keys, etc.)
- Modifying the provider settings in the code
- Command-line arguments

## Engineering Guidelines Compliance

This agent follows strict engineering principles:
1. **Explicit Assumptions**: All assumptions must be clearly stated
2. **Verification Required**: Solutions must include verification or testing approaches
3. **Failure Mode Analysis**: Potential failures and edge cases must be considered
4. **No Silent Failures**: All errors must be handled and reported
5. **Testable Logic**: All functionality should be verifiable

The built-in verification system helps ensure these guidelines are followed in both user interactions and agent responses.

## Testing

Run the test suite:
```bash
npm test
```

## License

MIT