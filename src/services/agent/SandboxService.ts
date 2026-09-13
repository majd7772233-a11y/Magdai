import {Parser} from 'expr-eval';

export interface SandboxExecutionResult {
  success: boolean;
  output: string;
  executionTimeMs: number;
  error?: string;
}

export class SandboxService {
  /**
   * Safe expression and math logic sandbox using expr-eval AST parser.
   */
  static executeJavaScript(code: string): SandboxExecutionResult {
    const startTime = Date.now();
    try {
      const parser = new Parser();
      const expr = parser.parse(code);
      const result = expr.evaluate();
      const endTime = Date.now();
      return {
        success: true,
        output: result !== undefined ? String(result) : 'تم التشغيل الآمن بنجاح.',
        executionTimeMs: endTime - startTime,
      };
    } catch (err: any) {
      const endTime = Date.now();
      return {
        success: false,
        output: '',
        error: err?.message || 'خطأ أثناء المعالجة داخل Sandbox',
        executionTimeMs: endTime - startTime,
      };
    }
  }
}
