// Web server interface for the Reliable Engineering Agent
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

export class WebServer {
  constructor(provider) {
    this.provider = provider;
    this.app = express();
    this.server = createServer(this.app);
    this.wss = new WebSocketServer({ server: this.server });
    this.port = process.env.PORT || 3000;
    
    // Middleware
    this.app.use(express.json());
    this.app.use(express.static('public'));
    
    // WebSocket connection handling
    this.wss.on('connection', (ws) => {
      console.log('New WebSocket client connected');
      
      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message);
          
          if (data.type === 'chat') {
            const response = await this.provider.chatCompletion([
              { role: 'system', content: 'You are a helpful AI assistant that follows strict engineering principles. Always state assumptions, verify correctness, and generate tests when appropriate.' },
              { role: 'user', content: data.message }
            ], {
              temperature: 0.1,
              max_tokens: 2000
            });
            
            ws.send(JSON.stringify({
              type: 'response',
              content: response.choices[0].message.content
            }));
          }
        } catch (error) {
          ws.send(JSON.stringify({
            type: 'error',
            message: error.message
          }));
        }
      });
      
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
      });
    });
    
    // REST API endpoints
    this.app.get('/api/models', async (req, res) => {
      try {
        const models = await this.provider.fetchModels();
        res.json({ models });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    this.app.post('/api/chat', async (req, res) => {
      try {
        const { message, model, temperature } = req.body;
        const response = await this.provider.chatCompletion([
          { role: 'system', content: 'You are a helpful AI assistant that follows strict engineering principles. Always state assumptions, verify correctness, and generate tests when appropriate.' },
          { role: 'user', content: message }
        ], {
          model: model || undefined,
          temperature: temperature !== undefined ? temperature : 0.1,
          max_tokens: 2000
        });
        
        res.json({ response: response.choices[0].message.content });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Serve index.html for root route
    this.app.get('/', (req, res) => {
      res.sendFile('index.html', { root: './public' });
    });
  }
  
  async start() {
    return new Promise((resolve, reject) => {
      this.server.listen(this.port, () => {
        console.log(`Web server running on http://localhost:${this.port}`);
        resolve();
      });
      
      this.server.on('error', (error) => {
        reject(error);
      });
    });
  }
  
  async stop() {
    return new Promise((resolve, reject) => {
      this.server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        console.log('Web server stopped');
        resolve();
      });
      
      this.wss.clients.forEach(client => client.close());
    });
  }
}