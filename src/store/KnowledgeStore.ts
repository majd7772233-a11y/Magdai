import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'code' | 'json';
  sizeBytes: number;
  chunksCount: number;
  isIndexed: boolean;
  addedAt: string;
}

export interface KnowledgeSpace {
  id: string;
  title: string;
  description: string;
  icon: string;
  documents: DocumentItem[];
  createdAt: string;
}

class KnowledgeStore {
  spaces: KnowledgeSpace[] = [
    {
      id: 'ks-1',
      title: '📱 Android & Kotlin',
      description: 'مستندات وأكواد تطوير تطبيقات Android باستخدام Kotlin وJetpack Compose',
      icon: '📱',
      documents: [
        {
          id: 'doc-1',
          name: 'Android_Architecture_Guide.pdf',
          type: 'pdf',
          sizeBytes: 2450000,
          chunksCount: 42,
          isIndexed: true,
          addedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: 'ks-2',
      title: '🔧 الإلكترونيات والميكروكنترولر',
      description: 'معلومات الدوائر الكهربائية، حسّاسات Arduino، ودليل قطع ESP32',
      icon: '🔧',
      documents: [],
      createdAt: new Date().toISOString(),
    },
  ];

  activeSpaceId: string | null = null;
  searchQuery: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setActiveSpace(id: string | null) {
    this.activeSpaceId = id;
  }

  setSearchQuery(q: string) {
    this.searchQuery = q;
  }

  createSpace(title: string, description: string, icon: string = '📚') {
    const space: KnowledgeSpace = {
      id: uuidv4(),
      title,
      description,
      icon,
      documents: [],
      createdAt: new Date().toISOString(),
    };
    this.spaces.push(space);
    return space;
  }

  addDocumentToSpace(spaceId: string, name: string, type: DocumentItem['type'], sizeBytes: number) {
    const space = this.spaces.find(s => s.id === spaceId);
    if (space) {
      const doc: DocumentItem = {
        id: uuidv4(),
        name,
        type,
        sizeBytes,
        chunksCount: Math.ceil(sizeBytes / 500),
        isIndexed: true,
        addedAt: new Date().toISOString(),
      };
      space.documents.push(doc);
    }
  }

  deleteSpace(spaceId: string) {
    this.spaces = this.spaces.filter(s => s.id !== spaceId);
    if (this.activeSpaceId === spaceId) this.activeSpaceId = null;
  }
}

export const knowledgeStore = new KnowledgeStore();
