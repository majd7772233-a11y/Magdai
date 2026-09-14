export interface DocumentChunk {
  id: string;
  docName: string;
  content: string;
  sectionIndex: number;
  score?: number;
}

export class RAGEngineService {
  /**
   * Split document content by paragraph and heading boundaries.
   */
  static chunkDocumentSemantic(docName: string, text: string): DocumentChunk[] {
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    const chunks: DocumentChunk[] = [];

    paragraphs.forEach((p, index) => {
      chunks.push({
        id: `${docName}-sec-${index + 1}`,
        docName,
        content: p.trim(),
        sectionIndex: index + 1,
      });
    });

    if (chunks.length === 0 && text.trim().length > 0) {
      chunks.push({
        id: `${docName}-sec-1`,
        docName,
        content: text.trim(),
        sectionIndex: 1,
      });
    }

    return chunks;
  }

  /**
   * Backward compatible chunker.
   */
  static chunkDocument(docName: string, text: string): DocumentChunk[] {
    return this.chunkDocumentSemantic(docName, text);
  }

  /**
   * Perform BM25-style term frequency similarity search.
   */
  static retrieveRelevantChunks(query: string, allChunks: DocumentChunk[], topK: number = 3): DocumentChunk[] {
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (queryTokens.length === 0) return [];

    const scored = allChunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;

      queryTokens.forEach(token => {
        if (contentLower.includes(token)) {
          // Term Frequency count
          const occurrences = contentLower.split(token).length - 1;
          score += 1 + Math.log(occurrences);
        }
      });

      return {...chunk, score};
    });

    return scored
      .filter(c => (c.score || 0) > 0)
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, topK);
  }
}
