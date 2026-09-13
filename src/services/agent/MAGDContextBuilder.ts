import {memoryStore} from '../../store/MemoryStore';
import {projectStore} from '../../store/ProjectStore';
import {knowledgeStore} from '../../store/KnowledgeStore';

export interface MAGDContextOptions {
  userQuery?: string;
  palName?: string;
  enableRAG?: boolean;
}

export interface UnifiedMAGDContext {
  systemPromptAdditions: string;
  retrievedChunks: Array<{docName: string; content: string}>;
  activeProjectName?: string;
}

export class MAGDContextBuilder {
  /**
   * Assembles the complete central cognitive context payload for MAGD AI.
   */
  static buildContext(options: MAGDContextOptions = {}): UnifiedMAGDContext {
    const {userQuery, enableRAG = true} = options;

    let systemAdditions = '';

    // 1. Smart Memory Store Grounding (Retrieves only query-relevant memories)
    const memories = memoryStore.searchRelevantMemories(userQuery);
    if (memories.length > 0) {
      const memoryLines = memories.map(m => `- [${m.title}]: ${m.content}`).join('\n');
      systemAdditions += `\n\n🧠 ✨ MAGD AI Persistent Memories & User Preferences ✨\n${memoryLines}`;
    }

    // 2. Active Project Grounding
    const activeProject = projectStore.activeProject;
    let activeProjectName: string | undefined;
    if (activeProject) {
      activeProjectName = activeProject.name;
      systemAdditions += `\n\n🔗 Active Project Context:\nName: ${activeProject.name}\nDescription: ${activeProject.description}`;
    }

    // 3. RAG Knowledge Search Grounding
    const retrievedChunks: Array<{docName: string; content: string}> = [];
    if (enableRAG && userQuery && userQuery.trim().length > 0) {
      const chunks = knowledgeStore.searchRAG(userQuery);
      if (chunks.length > 0) {
        systemAdditions += `\n\n📚 Knowledge Base RAG Grounding (Relevant Sources):`;
        chunks.forEach((chunk, index) => {
          retrievedChunks.push({docName: chunk.docName, content: chunk.content});
          systemAdditions += `\n[Source #${index + 1}: ${chunk.docName}]: "${chunk.content}"`;
        });
      }
    }

    return {
      systemPromptAdditions: systemAdditions,
      retrievedChunks,
      activeProjectName,
    };
  }
}
