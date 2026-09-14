import {memoryStore} from '../../store/MemoryStore';
import {projectStore} from '../../store/ProjectStore';
import {knowledgeStore} from '../../store/KnowledgeStore';
import {PluginSystemManager} from './PluginSystemManager';

export interface MAGDContextOptions {
  userQuery?: string;
  palName?: string;
  enableRAG?: boolean;
  conversationId?: string;
}

export interface UnifiedMAGDContext {
  systemPromptAdditions: string;
  retrievedChunks: Array<{docName: string; content: string}>;
  activeProjectName?: string;
  enabledTools: string[];
}

export class MAGDContextBuilder {
  /**
   * Assembles the complete central cognitive context payload for MAGD AI.
   * Unifies Memory, Active Project, RAG Grounding, and Active Plugin Tools.
   */
  static buildContext(options: MAGDContextOptions = {}): UnifiedMAGDContext {
    const {userQuery, enableRAG = true, conversationId} = options;

    let systemAdditions = '';
    const enabledTools: string[] = [];


    // Ground only if user query is actively present
    if (userQuery && userQuery.trim().length > 0) {
      // 1. Smart Memory Store Grounding (Query-relevant + Conversation/Project Scoped)
      if (memoryStore && typeof memoryStore.searchRelevantMemories === 'function') {
        const memories = memoryStore.searchRelevantMemories(userQuery, 5, {
          projectId: projectStore?.activeProject?.id,
          conversationId,
        });
        if (memories && memories.length > 0) {
          const memoryLines = memories.map(m => `- [${m.title}]: ${m.content}`).join('\n');
          systemAdditions += `\n\n🧠 ✨ MAGD AI Persistent Memories & User Preferences ✨\n${memoryLines}`;
        }
      }

      // 2. Active Project Workspace Grounding
      const activeProject = projectStore?.activeProject;
      if (activeProject) {
        systemAdditions += `\n\n📁 Active Project Context:\nID: ${activeProject.id}\nName: ${activeProject.name}\nDescription: ${activeProject.description}\nRoot Path: ${activeProject.rootPath || '/app'}`;
      }

      // 3. RAG Knowledge Base Search Grounding
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
      enabledTools,
    };
  }
}
