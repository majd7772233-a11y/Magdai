import type {Pal} from '../types/pal';
import type {Model} from './types';
import {generateFinalSystemPrompt} from './palshub-template-parser';
import {memoryStore} from '../store/MemoryStore';
import {projectStore} from '../store/ProjectStore';

export interface SystemPromptDependencies {
  pal?: Pal | null;
  model?: Model | null;
}

/**
 * Resolves the system prompt based on priority:
 * 1. Pal's system prompt (with parameter rendering if needed)
 * 2. Fallback to model's chat template system prompt
 * 3. Empty string if neither exists
 */
export function resolveSystemPrompt(
  dependencies: SystemPromptDependencies,
): string {
  const {pal, model} = dependencies;

  let basePrompt = '';

  // Priority 1: Pal's system prompt
  if (pal?.systemPrompt) {
    if (pal.parameters && Object.keys(pal.parameters).length > 0) {
      basePrompt = generateFinalSystemPrompt(pal.systemPrompt, pal.parameters);
    } else {
      basePrompt = pal.systemPrompt;
    }
  } else if (model?.chatTemplate?.systemPrompt) {
    // Priority 2: Model's chat template system prompt
    basePrompt = model.chatTemplate.systemPrompt;
  }

  // Inject MAGD AI Memory Context
  const memoryItems = memoryStore?.memories || [];
  const activeProj = projectStore?.activeProject;

  let memoryContextBlock = '';
  if (memoryItems.length > 0) {
    const memoryDetails = memoryItems
      .map(m => `- [${m.title}]: ${m.content}`)
      .join('\n');
    memoryContextBlock += `\n\n🧠 ✨ MAGD AI Memory & Context ✨\n${memoryDetails}`;
  }

  if (activeProj) {
    memoryContextBlock += `\n\n🔗 Active Project Context:\nProject: ${activeProj.name}\nDescription: ${activeProj.description}`;
  }

  return basePrompt ? `${basePrompt}${memoryContextBlock}` : memoryContextBlock.trim();
}

type ChatMessage = {role: string; content?: unknown};

/**
 * Fold the system prompt + every talent fragment into ONE leading system
 * message; a second system message makes strict chat templates raise.
 */
export function assembleMessages(
  systemMessages: Array<{role: 'system'; content: string}>,
  systemPromptFragments: string[],
  followingMessages: ChatMessage[],
): ChatMessage[] {
  const parts = [
    ...systemMessages.map(msg => msg.content),
    ...systemPromptFragments,
  ].filter(part => part.trim().length > 0);

  const leadingSystemMessage: ChatMessage[] = parts.length
    ? [{role: 'system', content: parts.join('\n\n')}]
    : [];

  const messages = [...leadingSystemMessage, ...followingMessages];

  if (__DEV__) {
    const systemPositions = messages
      .map((msg, index) => (msg.role === 'system' ? index : -1))
      .filter(index => index >= 0);
    if (
      systemPositions.length > 1 ||
      (systemPositions.length === 1 && systemPositions[0] !== 0)
    ) {
      console.error(
        'assembleMessages: chat templates require at most one leading system ' +
          `message, but found system messages at [${systemPositions.join(', ')}].`,
      );
    }
  }

  return messages;
}

/**
 * Resolves system prompt and formats it as a system message array
 * Returns empty array if no system prompt is available
 */
export function resolveSystemMessages(
  dependencies: SystemPromptDependencies,
): Array<{role: 'system'; content: string}> {
  const systemPrompt = resolveSystemPrompt(dependencies);

  if (!systemPrompt.trim()) {
    return [];
  }

  return [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
  ];
}
