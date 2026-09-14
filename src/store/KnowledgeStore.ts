import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';
import {RAGEngineService, DocumentChunk} from '../services/rag/RAGEngineService';
import {DocumentParserService} from '../services/rag/DocumentParserService';

export interface DocumentItem {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt' | 'code' | 'json';
  sizeBytes: number;
  chunksCount: number;
  isIndexed: boolean;
  addedAt: string;
  projectId?: string;
  chunks: DocumentChunk[];
}

export interface KnowledgeSpace {
  id: string;
  title: string;
  description: string;
  icon: string;
  projectId?: string;
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
          chunksCount: 1,
          isIndexed: true,
          addedAt: new Date().toISOString(),
          chunks: RAGEngineService.chunkDocument(
            'Android_Architecture_Guide.pdf',
            '# Android Architecture Guide\nViewModel handles UI data lifecycle and survives configuration changes.',
          ),
        },
      ],
      createdAt: new Date().toISOString(),
    },
  ];

  activeSpaceId: string | null = null;
  searchQuery: string = '';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'MAGD_KnowledgeStore',
      properties: ['spaces'],
      storage: AsyncStorage,
    }).catch(err => {
      console.warn('KnowledgeStore persistence notice:', err);
    });
  }

  setActiveSpace(id: string | null) {
    this.activeSpaceId = id;
  }

  setSearchQuery(q: string) {
    this.searchQuery = q;
  }

  createSpace(title: string, description: string, icon: string = '📚', projectId?: string) {
    const space: KnowledgeSpace = {
      id: uuidv4(),
      title,
      description,
      icon,
      projectId,
      documents: [],
      createdAt: new Date().toISOString(),
    };
    this.spaces.push(space);
    return space;
  }

  addDocumentToSpace(spaceId: string, name: string, content: string, typeOverride?: DocumentItem['type']) {
    const space = this.spaces.find(s => s.id === spaceId);
    if (space) {
      // Duplicate prevention
      const existing = space.documents.find(d => d.name.toLowerCase() === name.toLowerCase());
      if (existing) {
        this.reindexDocument(spaceId, existing.id, content);
        return;
      }

      const parsed = DocumentParserService.parseTextContent(name, content);
      const chunks = RAGEngineService.chunkDocument(name, parsed.text);
      const doc: DocumentItem = {
        id: uuidv4(),
        name,
        type: typeOverride || parsed.type,
        sizeBytes: parsed.sizeBytes,
        chunksCount: chunks.length,
        isIndexed: true,
        addedAt: new Date().toISOString(),
        projectId: space.projectId,
        chunks,
      };
      space.documents.push(doc);
    }
  }

  reindexDocument(spaceId: string, docId: string, newContent: string) {
    const space = this.spaces.find(s => s.id === spaceId);
    if (space) {
      const doc = space.documents.find(d => d.id === docId);
      if (doc) {
        const parsed = DocumentParserService.parseTextContent(doc.name, newContent);
        doc.chunks = RAGEngineService.chunkDocument(doc.name, parsed.text);
        doc.chunksCount = doc.chunks.length;
        doc.sizeBytes = parsed.sizeBytes;
        doc.isIndexed = true;
      }
    }
  }

  searchRAG(query: string): DocumentChunk[] {
    const allChunks = this.spaces.flatMap(s => s.documents.flatMap(d => d.chunks));
    return RAGEngineService.retrieveRelevantChunks(query, allChunks);
  }

  deleteDocument(spaceId: string, docId: string) {
    const space = this.spaces.find(s => s.id === spaceId);
    if (space) {
      space.documents = space.documents.filter(d => d.id !== docId);
    }
  }

  deleteSpace(spaceId: string) {
    this.spaces = this.spaces.filter(s => s.id !== spaceId);
    if (this.activeSpaceId === spaceId) this.activeSpaceId = null;
  }
}

export const knowledgeStore = new KnowledgeStore();
