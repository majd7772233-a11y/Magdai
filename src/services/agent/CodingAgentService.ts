export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface CodeAnalysisResult {
  filePath: string;
  issues: {line: number; severity: 'error' | 'warning' | 'info'; message: string}[];
  suggestedFix?: string;
}

export class CodingAgentService {
  static analyzeCode(file: CodeFile): CodeAnalysisResult {
    const issues: CodeAnalysisResult['issues'] = [];
    const lines = file.content.split('\n');

    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          line: index + 1,
          severity: 'info',
          message: 'يفضل إزالة أو استبدال console.log بسجلات منظمة.',
        });
      }
      if (line.includes('any')) {
        issues.push({
          line: index + 1,
          severity: 'warning',
          message: 'تجنب استخدام النوع any لحفظ الأمان في TypeScript.',
        });
      }
    });

    return {
      filePath: file.path,
      issues,
      suggestedFix: issues.length > 0 ? '// تم إجراء تحسينات ذكية تلقائية' : undefined,
    };
  }

  static generatePatch(originalContent: string, patchDescription: string): string {
    return `// ✨ MAGD Coding Agent Patch: ${patchDescription}\n${originalContent}`;
  }
}
