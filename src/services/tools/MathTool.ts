import {Parser} from 'expr-eval';

export class MathTool {
  static evaluate(expression: string): {success: boolean; result?: number; error?: string} {
    try {
      const parser = new Parser();
      const expr = parser.parse(expression);
      const result = expr.evaluate();
      return {success: true, result};
    } catch (err: any) {
      return {success: false, error: err?.message || 'Invalid expression'};
    }
  }

  static calculateOhmsLaw(params: {v?: number; i?: number; r?: number; p?: number}) {
    let {v, i, r, p} = params;
    if (v !== undefined && i !== undefined) {
      r = v / i;
      p = v * i;
    } else if (v !== undefined && r !== undefined) {
      i = v / r;
      p = (v * v) / r;
    } else if (i !== undefined && r !== undefined) {
      v = i * r;
      p = i * i * r;
    } else if (p !== undefined && v !== undefined) {
      i = p / v;
      r = (v * v) / p;
    }
    return {v, i, r, p};
  }
}
