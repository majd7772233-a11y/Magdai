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

    // Ground only if a user query is actively present
    if (userQuery && userQuery.trim().length > 0) {
      // 1. Smart Memory Store Grounding
      if (memoryStore && typeof memoryStore.searchRelevantMemories === 'function') {
        const memories = memoryStore.searchRelevantMemories(userQuery);
        if (memories && memories.length > 0) {
          const memoryLines = memories.map(m => `- [${m.title}]: ${m.content}`).join('\n');
          systemAdditions += `\n\n🧠 ✨ MAGD AI Persistent Memories & User Preferences ✨\n${memoryLines}`;
        }
      }

      // 2. Active Project Grounding
      const activeProject = projectStore?.activeProject;
      if (activeProject) {
        systemAdditions += `\n\n🔗 Active Project Context:\nName: ${activeProject.name}\nDescription: ${activeProject.description}`;
      }

      // 3. RAG Knowledge Search Grounding
      if (enableRAG && knowledgeStore && typeof knowledgeStore.searchRAG === 'function') {
        const chunks = knowledgeStore.searchRAG(userQuery);
        if (chunks && chunks.length > 0) {
          systemAdditions += `\n\n📚 Knowledge Base RAG Grounding (Relevant Sources):`;
          chunks.forEach((chunk, index) => {
            systemAdditions += `\n[Source #${index + 1}: ${chunk.docName}]: "${chunk.content}"`;
          });
        }
      }
    }

    const activeProjectName = userQuery ? projectStore?.activeProject?.name : undefined;

    return {
      systemPromptAdditions: systemAdditions,
      retrievedChunks: [],
      activeProjectName,
    };
  }
}
