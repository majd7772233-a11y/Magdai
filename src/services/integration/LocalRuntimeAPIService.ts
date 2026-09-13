import {modelStore} from '../../store/ModelStore';
import {memoryStore} from '../../store/MemoryStore';

export interface LocalAPIEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: string;
}

export interface OpenAICompletionsRequest {
  model?: string;
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

  static async handleModelsRequest() {
    const activeModel = modelStore.activeModel;
    return {
      object: 'list',
      data: [
        {
          id: activeModel?.id || 'magd-ai-local-model',
          object: 'model',
          created: Math.floor(Date.now() / 1000),
          owned_by: '✨ MAGD AI ✨',
        },
      ],
    };
  }

  static async handleMemoryRequest() {
    return {
      object: 'memory_list',
      memories: memoryStore.memories,
    };
  }

  static async handleCompletionsRequest(request: OpenAICompletionsRequest) {
    const userMsg = request.messages[request.messages.length - 1]?.content || '';
    const activeModel = modelStore.activeModel;

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model || activeModel?.name || '✨ MAGD AI Local Runtime',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: `✨ MAGD AI Local Runtime Response ✨\n${userMsg}`,
          },
          finish_reason: 'stop',
        },
      ],
      usage: {
        prompt_tokens: userMsg.length,
        completion_tokens: userMsg.length,
        total_tokens: userMsg.length * 2,
      },
    };
  }

  static getAvailableEndpoints(): LocalAPIEndpoint[] {
    return [
      {path: '/v1/models', method: 'GET', description: 'قائمة النماذج المحلية النشطة'},
      {path: '/v1/chat/completions', method: 'POST', description: 'واجهة المحادثة والتوليد المباشر (OpenAI-Compatible)'},
      {path: '/v1/memory', method: 'GET', description: 'استرجاع الذاكرة المحلية المستمرة'},
    ];
  }
}
