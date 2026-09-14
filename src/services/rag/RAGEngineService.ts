export interface DocumentChunk {
  id: string;
  docName: string;
  chunkIndex: number;
  content: string;
  score?: number;
  pageNumber?: number;
  sectionTitle?: string;
  metadata?: Record<string, string>;
}

export class RAGEngineService {
  /**
   * Chunks text content using paragraph breaks, section headings, and max token thresholds.
   */
  public static chunkDocument(
    docName: string,
    text: string,
    maxChunkChars: number = 400,
    overlapChars: number = 80,
  ): DocumentChunk[] {
    if (!text || !text.trim()) return [];

    const chunks: DocumentChunk[] = [];
    const paragraphs = text.split(/\n\s*\n/);
    let currentChunk = '';
    let chunkIndex = 0;
    let pageNumber = 1;
    let currentSection = 'General';

    paragraphs.forEach(p => {
      const trimmed = p.trim();
      if (!trimmed) return;

      // Detect Section Heading
      if (trimmed.startsWith('#') || (trimmed.length < 50 && trimmed.toUpperCase() === trimmed)) {
        currentSection = trimmed.replace(/^#+\s*/, '');
      }

      if ((currentChunk + '\n' + trimmed).length <= maxChunkChars) {
        currentChunk += (currentChunk ? '\n\n' : '') + trimmed;
      } else {
        if (currentChunk.trim()) {
          chunks.push({
            id: `${docName}-chunk-${chunkIndex}`,
            docName,
            chunkIndex,
            content: currentChunk.trim(),
            pageNumber,
            sectionTitle: currentSection,
          });
          chunkIndex++;
          // Carry over overlapping context
          const overlap = currentChunk.slice(-overlapChars);
          currentChunk = overlap + '\n\n' + trimmed;
        } else {
          currentChunk = trimmed;
        }
      }
    });

    if (currentChunk.trim()) {
      chunks.push({
        id: `${docName}-chunk-${chunkIndex}`,
        docName,
        chunkIndex,
        content: currentChunk.trim(),
        pageNumber,
        sectionTitle: currentSection,
      });
    }

    return chunks;
  }

  /**
   * BM25 TF-IDF Hybrid Relevance Search
   */
  public static retrieveRelevantChunks(
    query: string,
    chunks: DocumentChunk[],
    topK: number = 3,
    similarityThreshold: number = 0.2,
  ): DocumentChunk[] {
    if (!query || !query.trim() || chunks.length === 0) return [];

    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (queryTokens.length === 0) return [];

    const scored = chunks.map(chunk => {
      let score = 0;
      const contentLower = chunk.content.toLowerCase();
      const sectionLower = (chunk.sectionTitle || '').toLowerCase();

      queryTokens.forEach(token => {
        // BM25 term frequency bonus
        const matches = (contentLower.match(new RegExp(token, 'g')) || []).length;
        if (matches > 0) {
          score += (matches / (matches + 1.0)) * 1.5;
        }
        if (sectionLower.includes(token)) {
          score += 1.0;
        }
      });

      return { ...chunk, score };
    });

    return scored
      .filter(c => (c.score || 0) >= similarityThreshold)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }

  /**
   * Generates formatted citations for model output.
   */
  public static generateCitations(chunks: DocumentChunk[]): string {
    if (chunks.length === 0) return '';
    return chunks
      .map(
        (c, idx) =>
          `[Source ${idx + 1}]: ${c.docName} (Section: ${c.sectionTitle || 'N/A'}, Page: ${c.pageNumber || 1})`,
      )
      .join('\n');
  }
}
