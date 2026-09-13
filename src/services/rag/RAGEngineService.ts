export interface DocumentChunk {
  id: string;
  docName: string;
  content: string;
  score?: number;
}

export class RAGEngineService {
  /**
   * Split document content into overlapping chunks.
   */
  static chunkDocument(docName: string, text: string, chunkSize: number = 200): DocumentChunk[] {
    const words = text.split(/\s+/);
    const chunks: DocumentChunk[] = [];
    let currentChunk: string[] = [];

    for (let i = 0; i < words.length; i++) {
      currentChunk.push(words[i]);
      if (currentChunk.length >= chunkSize || i === words.length - 1) {
        chunks.push({
          id: `${docName}-chunk-${chunks.length + 1}`,
          docName,
          content: currentChunk.join(' '),
        });
        currentChunk = currentChunk.slice(Math.floor(chunkSize / 2));
      }
    }
    return chunks;
  }

  /**
   * Perform term-overlap similarity search across document chunks.
   */
  static retrieveRelevantChunks(query: string, allChunks: DocumentChunk[], topK: number = 3): DocumentChunk[] {
    const queryTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    if (queryTokens.length === 0) return [];

    const scored = allChunks.map(chunk => {
      const contentLower = chunk.content.toLowerCase();
      let score = 0;
      queryTokens.forEach(token => {
        if (contentLower.includes(token)) {
          score += 1;
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
