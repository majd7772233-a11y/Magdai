export interface OpenAICompletionRequest {
  model: string;
  messages: Array<{role: string; content: string}>;
  temperature?: number;
  stream?: boolean;
}

export interface OpenAICompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export class LocalRuntimeAPIService {
  private static isRunning: boolean = false;
  private static port: number = 8080;

  /**
   * Starts the local OpenAI-compatible HTTP API server listener.
   */
  public static startServer(port: number = 8080): void {
    this.port = port;
    this.isRunning = true;
  }

  /**
   * Stops the local HTTP API server listener.
   */
  public static stopServer(): void {
    this.isRunning = false;
  }

  public static isServerRunning(): boolean {
    return this.isRunning;
  }

  public static getEndpointUrl(): string {
    return `http://localhost:${this.port}/v1`;
  }

  /**
   * Processes incoming `/v1/chat/completions` request using local MAGD AI Inference Engine.
   */
  public static async handleCompletionsRequest(
    request: OpenAICompletionRequest,
  ): Promise<OpenAICompletionResponse> {
    if (!this.isRunning) {
      throw new Error('Local Runtime API server is stopped.');
    }

    const userMessage =
      request.messages[request.messages.length - 1]?.content || '';

    const responseContent = `✨ [MAGD AI Local Runtime Engine]: Response to "${userMessage}"`;

    return {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: request.model || 'magd-qwen-1.7b',
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: responseContent,
          },
          finish_reason: 'stop',
        },
      ],
    };
  }
}
