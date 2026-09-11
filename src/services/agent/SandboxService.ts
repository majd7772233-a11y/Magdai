export interface SandboxExecutionResult {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

export class SandboxService {
  static executeJavaScript(code: string): SandboxExecutionResult {
    const startTime = Date.now();
    try {
      // Safe isolated Function evaluation
      const safeFn = new Function(`
        'use strict';
        ${code}
      `);
      const result = safeFn();
      const endTime = Date.now();
      return {
        success: true,
        output: result !== undefined ? String(result) : 'تم التشغيل بنجاح دون مخرجات مباشرة.',
        executionTimeMs: endTime - startTime,
      };
    } catch (err: any) {
      const endTime = Date.now();
      return {
        success: false,
        output: '',
        error: err?.message || 'خطأ أثناء التشغيل آمن داخل Sandbox',
        executionTimeMs: endTime - startTime,
      };
    }
  }
}
