import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';
import {RAGEngineService, DocumentChunk} from '../services/rag/RAGEngineService';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'code' | 'json';
  sizeBytes: number;
  chunksCount: number;
  isIndexed: boolean;
  addedAt: string;
  chunks: DocumentChunk[];
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
          chunksCount: 3,
          isIndexed: true,
          addedAt: new Date().toISOString(),
          chunks: RAGEngineService.chunkDocument('Android_Architecture_Guide.pdf', 'Android architecture components include ViewModel, LiveData, Room Database, and Repository pattern. ViewModel handles UI data lifecycle.'),
        },
      ],
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

  addDocumentToSpace(spaceId: string, name: string, content: string, type: DocumentItem['type']) {
    const space = this.spaces.find(s => s.id === spaceId);
    if (space) {
      const chunks = RAGEngineService.chunkDocument(name, content);
      const doc: DocumentItem = {
        id: uuidv4(),
        name,
        type,
        sizeBytes: content.length,
        chunksCount: chunks.length,
        isIndexed: true,
        addedAt: new Date().toISOString(),
        chunks,
      };
      space.documents.push(doc);
    }
  }

  searchRAG(query: string): DocumentChunk[] {
    const allChunks = this.spaces.flatMap(s => s.documents.flatMap(d => d.chunks));
    return RAGEngineService.retrieveRelevantChunks(query, allChunks);
  }

  deleteSpace(spaceId: string) {
    this.spaces = this.spaces.filter(s => s.id !== spaceId);
    if (this.activeSpaceId === spaceId) this.activeSpaceId = null;
  }
}

export const knowledgeStore = new KnowledgeStore();
