export interface SandboxExecutionResult {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

export class SandboxService {
  static executeJavaScript(code: string): SandboxExecutionResult {
    const startTime = Date.now();

    // Prevent unsafe expressions
    if (code.includes('process.') || code.includes('require(') || code.includes('import(')) {
      return {
        success: false,
        output: '',
        error: '⚠️ الكود يحتوي على عمليات غير مسموح بها داخل البيئة المعزولة.',
        executionTimeMs: Date.now() - startTime,
      };
    }

    try {
      const safeFn = new Function(`
        'use strict';
        ${code}
      `);
      const result = safeFn();
      const endTime = Date.now();
      return {
        success: true,
        output: result !== undefined ? String(result) : 'تم التشغيل بنجاح داخل البيئة المعزولة.',
        executionTimeMs: endTime - startTime,
      };
    } catch (err: any) {
      const endTime = Date.now();
      return {
        success: false,
        output: '',
        error: err?.message || 'خطأ أثناء التشغيل داخل Sandbox',
        executionTimeMs: endTime - startTime,
      };
    }
  }
}
