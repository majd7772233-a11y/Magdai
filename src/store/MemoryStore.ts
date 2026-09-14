import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';

export interface MemoryItem {
  id: string;
  category: 'short_term' | 'long_term' | 'preference' | 'project' | 'knowledge';
  title: string;
  content: string;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

class MemoryStore {
  memories: MemoryItem[] = [
    {
      id: '1',
      category: 'preference',
      title: 'اللغة المفضلة',
      content: 'اللغة: العربية، الواجهة: Dark Mode، طريقة الشرح: تدريجية ومنطقية',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      category: 'long_term',
      title: 'الهوية والتصميم',
      content: 'المشروع هو ✨ MAGD AI ✨، منصة ذكاء اصطناعي محلي بأسلوب Liquid Glass UI.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  searchQuery: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  addMemory(data: Omit<MemoryItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const newItem: MemoryItem = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.memories.push(newItem);
    return newItem;
  }

  updateMemory(id: string, content: string, title?: string) {
    const item = this.memories.find(m => m.id === id);
    if (item) {
      item.content = content;
      if (title) item.title = title;
      item.updatedAt = new Date().toISOString();
    }
  }

  deleteMemory(id: string) {
    this.memories = this.memories.filter(m => m.id !== id);
  }

  clearAllMemories() {
    this.memories = [];
  }

  get filteredMemories() {
    if (!this.searchQuery.trim()) {
      return this.memories;
    }
    const q = this.searchQuery.toLowerCase();
    return this.memories.filter(
      m =>
        m.title.toLowerCase().includes(q) ||
        m.content.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q),
    );
  }
}

export const memoryStore = new MemoryStore();
