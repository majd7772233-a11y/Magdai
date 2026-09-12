export interface LocalAPIEndpoint {
  path: string;
  method: 'GET' | 'POST';
  description: string;
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

  static getAvailableEndpoints(): LocalAPIEndpoint[] {
    return [
      {path: '/v1/models', method: 'GET', description: 'قائمة النماذج المحلية النشطة'},
      {path: '/v1/chat/completions', method: 'POST', description: 'واجهة المحادثة والتوليد المباشر (OpenAI-Compatible)'},
      {path: '/v1/memory', method: 'GET', description: 'استرجاع الذاكرة المحلية'},
    ];
  }
}
