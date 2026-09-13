export interface LocalAPIEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: string;
}

export interface OpenAICompletionsRequest {
  model: string;
  messages: {role: string; content: string}[];
  temperature?: number;
}

export class LocalRuntimeAPIService {
  private static isServerRunning: boolean = false;
  private static port: number = 8080;

  static startServer(port: number = 8080): boolean {
    this.port = port;
    this.isServerRunning = true;
    return true;
  }

  static stopServer(): boolean {
    this.isServerRunning = false;
    return true;
  }

  static getStatus() {
    return {
      isRunning: this.isServerRunning,
      port: this.port,
      endpointUrl: `http://localhost:${this.port}/v1/chat/completions`,
    };
  }

  static async handleCompletionsRequest(request: OpenAICompletionsRequest) {
    const userMsg = request.messages[request.messages.length - 1]?.content || '';
    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model || '✨ MAGD AI Local Runtime',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `✨ MAGD AI Local API Output ✨\nاستلمت سؤالك: "${userMsg}"\nتمت المعالجة عبر Local Runtime API Server.`,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: userMsg.length,
        completion_tokens: 30,
        total_tokens: userMsg.length + 30,
      },
    };
  }

  static getAvailableEndpoints(): LocalAPIEndpoint[] {
    return [
      {path: '/v1/models', method: 'GET', description: 'قائمة النماذج المحلية النشطة'},
      {path: '/v1/chat/completions', method: 'POST', description: 'واجهة المحادثة والتوليد المباشر (OpenAI-Compatible)'},
      {path: '/v1/memory', method: 'GET', description: 'استرجاع الذاكرة المحلية'},
    ];
  }
}
