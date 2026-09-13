import {memoryStore} from '../../store/MemoryStore';

export class MemoryExtractor {
  static inspectAndExtract(userText: string): boolean {
    if (!userText || userText.trim().length === 0) return false;

    const lower = userText.toLowerCase();

    // Pattern 1: Explicit Save Command
    if (userText.includes('احفظ هذه المعلومة') || userText.includes('تذكر أن')) {
      const content = userText.replace(/احفظ هذه المعلومة:?/g, '').replace(/تذكر أن:?/g, '').trim();
      if (content.length > 0) {
        memoryStore.addMemory({
          category: 'long_term',
          title: 'معلومة مستخرجة تلقائياً',
          content,
        });
        return true;
      }
    }

    // Pattern 2: Preferences
    if (userText.includes('أفضل') || lower.includes('my preference is')) {
      memoryStore.addMemory({
        category: 'preference',
        title: 'تفضيل مستخرج تلقائياً',
        content: userText,
      });
      return true;
    }

    return false;
  }
}
