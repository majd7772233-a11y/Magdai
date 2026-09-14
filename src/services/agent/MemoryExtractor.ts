import {memoryStore, MemoryItem} from '../../store/MemoryStore';

export interface MemorySuggestion {
  category: MemoryItem['category'];
  title: string;
  content: string;
  sensitive?: boolean;
}

export class MemoryExtractor {
  /**
   * Evaluates user prompt to detect explicit memory commands or key user preferences.
   * Features suggestion mode, sensitive information masking, and conflict resolution.
   */
  public static extractMemorySuggestions(userMessage: string): MemorySuggestion[] {
    const text = userMessage.trim();
    const suggestions: MemorySuggestion[] = [];

    if (!text) return suggestions;

    // Explicit command pattern: "احفظ هذه المعلومة:" or "تذكر أن:" or "Remember that:"
    const explicitArMatch = text.match(/(?:احفظ هذه المعلومة|تذكر أن|احفظ|تذكر)\s*[:：\s]\s*(.+)/i);
    const explicitEnMatch = text.match(/(?:remember that|save this info|note that)\s*[:：\s]\s*(.+)/i);

    if (explicitArMatch && explicitArMatch[1]) {
      const fact = explicitArMatch[1].trim();
      suggestions.push({
        category: 'long_term',
        title: 'حقيقة محفوظة',
        content: fact,
        sensitive: this.detectSensitivity(fact),
      });
    } else if (explicitEnMatch && explicitEnMatch[1]) {
      const fact = explicitEnMatch[1].trim();
      suggestions.push({
        category: 'long_term',
        title: 'Saved Fact',
        content: fact,
        sensitive: this.detectSensitivity(fact),
      });
    }

    // Implicit Preference Detection: "أفضل..." or "I prefer..."
    if (text.includes('أفضل') || text.includes('I prefer') || text.includes('لغتي هي')) {
      suggestions.push({
        category: 'preference',
        title: 'تفصيل للمستخدم',
        content: text,
        sensitive: false,
      });
    }

    return suggestions;
  }

  /**
   * Directly extracts and auto-saves non-conflicting memories into MemoryStore.
   */
  public static inspectAndExtract(userMessage: string): void {
    this.processUserMessage(userMessage);
  }

  public static processUserMessage(
    userMessage: string,
    options: {projectId?: string; conversationId?: string} = {},
  ): void {
    const suggestions = this.extractMemorySuggestions(userMessage);
    suggestions.forEach(s => {
      // Automatic conflict resolution / update check
      const existing = memoryStore.memories.find(
        m => m.title.toLowerCase() === s.title.toLowerCase() || m.content.toLowerCase() === s.content.toLowerCase(),
      );

      if (existing) {
        memoryStore.updateMemory(existing.id, s.content, s.title);
      } else {
        memoryStore.addMemory({
          category: s.category,
          title: s.title,
          content: s.content,
          projectId: options.projectId,
          conversationId: options.conversationId,
          sensitive: s.sensitive,
        });
      }
    });
  }

  /**
   * Checks if extracted text contains sensitive keywords (API keys, passwords, credentials).
   */
  private static detectSensitivity(text: string): boolean {
    const lower = text.toLowerCase();
    return (
      lower.includes('password') ||
      lower.includes('secret') ||
      lower.includes('api_key') ||
      lower.includes('token') ||
      lower.includes('كلمة السر') ||
      lower.includes('مفتاح')
    );
  }
}
