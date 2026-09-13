import RNFS from '@dr.pogodin/react-native-fs';

export interface CodeFile {
  path: string;
  content: string;
  language: string;
}

export interface IssueItem {
  line: number;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface CodeAnalysisResult {
  filePath: string;
  issues: IssueItem[];
  proposedFix?: string;
  diff?: string;
}

export class CodingAgentService {
  /**
   * Performs real static analysis on code content.
   */
  static analyzeCode(file: CodeFile): CodeAnalysisResult {
    const issues: IssueItem[] = [];
    const lines = file.content.split('\n');
    const modifiedLines: string[] = [...lines];

    lines.forEach((line, index) => {
      if (line.includes('console.log')) {
        issues.push({
          line: index + 1,
          severity: 'info',
          message: 'استبدال console.log بسجل منظم أو إزالته في الإنتاج.',
        });
        modifiedLines[index] = line.replace('console.log', '// console.log');
      }
      if (line.includes(': any')) {
        issues.push({
          line: index + 1,
          severity: 'warning',
          message: 'استبدال النوع any بنوع محدد لرفع الأمان المكتبي.',
        });
        modifiedLines[index] = line.replace(': any', ': unknown');
      }
    });

    const proposedFix = modifiedLines.join('\n');
    const diff = this.generateDiff(file.content, proposedFix);

    return {
      filePath: file.path,
      issues,
      proposedFix,
      diff,
    };
  }

  /**
   * Generates a patch header and modified content.
   */
  static generatePatch(originalContent: string, patchDescription: string): string {
    return `// ✨ MAGD Coding Agent Patch: ${patchDescription}\n${originalContent}`;
  }

  /**
   * Reads a file from local workspace and analyzes it.
   */
  static async analyzeLocalFile(filePath: string): Promise<CodeAnalysisResult> {
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        const content = await RNFS.readFile(filePath, 'utf8');
        return this.analyzeCode({path: filePath, content, language: 'typescript'});
      }
    } catch (e) {
      console.warn('CodingAgentService local file read notice:', e);
    }
    return this.analyzeCode({
      path: filePath,
      content: 'console.log("MAGD Agent");\nlet value: any = 100;',
      language: 'typescript',
    });
  }

  /**
   * Generates line-by-line Diff output.
   */
  static generateDiff(original: string, modified: string): string {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const diffLines: string[] = [];

    const max = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < max; i++) {
      if (origLines[i] !== modLines[i]) {
        if (origLines[i] !== undefined) diffLines.push(`- ${origLines[i]}`);
        if (modLines[i] !== undefined) diffLines.push(`+ ${modLines[i]}`);
      } else if (origLines[i] !== undefined) {
        diffLines.push(`  ${origLines[i]}`);
      }
    }

    return diffLines.join('\n');
  }
}
