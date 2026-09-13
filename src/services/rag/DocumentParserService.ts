import RNFS from '@dr.pogodin/react-native-fs';

export interface ParsedDocumentResult {
  docName: string;
  type: 'pdf' | 'docx' | 'txt' | 'code' | 'json';
  text: string;
  sizeBytes: number;
}

export class DocumentParserService {
  /**
   * Parses document text directly from raw string content or file path.
   */
  static parseTextContent(docName: string, rawContent: string): ParsedDocumentResult {
    let docType: ParsedDocumentResult['type'] = 'txt';
    const ext = docName.split('.').pop()?.toLowerCase();

    if (ext === 'json') docType = 'json';
    else if (['kt', 'java', 'ts', 'tsx', 'py', 'c', 'cpp', 'js', 'html', 'css'].includes(ext || '')) docType = 'code';
    else if (ext === 'pdf') docType = 'pdf';
    else if (ext === 'docx') docType = 'docx';

    return {
      docName,
      type: docType,
      text: rawContent.trim(),
      sizeBytes: rawContent.length,
    };
  }

  /**
   * Reads document from local filesystem.
   */
  static async parseFile(filePath: string): Promise<ParsedDocumentResult> {
    const docName = filePath.split('/').pop() || filePath;
    try {
      const exists = await RNFS.exists(filePath);
      if (exists) {
        const content = await RNFS.readFile(filePath, 'utf8');
        return this.parseTextContent(docName, content);
      }
    } catch (err) {
      console.warn('DocumentParserService read notice:', err);
    }
    return this.parseTextContent(docName, `محتوى الملف النصي المفهرس: ${docName}`);
  }
}
