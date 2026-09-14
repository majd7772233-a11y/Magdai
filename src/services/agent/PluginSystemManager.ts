/**
 * MAGD AI Plugin System Manager
 *
 * Manages dynamically loaded local plugins, extensions, and tool manifests.
 */

export interface MAGDPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  enabled: boolean;
  permissions: string[];
  category: 'electronics' | 'coding' | 'system' | 'ai';
}

export class PluginSystemManager {
  private static plugins: MAGDPlugin[] = [
    {
      id: 'plugin-termux',
      name: 'Termux Terminal Bridge',
      version: '1.0.0',
      description: 'Allows MAGD AI agents to dispatch commands to Termux session via Tasker Intent',
      author: 'MAGD AI Core',
      enabled: true,
      permissions: ['EXECUTE_COMMANDS', 'READ_LOCAL_STORAGE'],
      category: 'system',
    },
    {
      id: 'plugin-electronics',
      name: 'Circuit & Microcontroller Assistant',
      version: '1.2.0',
      description: 'Provides Ohm law calculations, pinout definitions, and LED resistor values',
      author: 'MAGD AI Hardware Lab',
      enabled: true,
      permissions: ['ACCESS_HARDWARE_REFS'],
      category: 'electronics',
    },
    {
      id: 'plugin-local-api',
      name: 'OpenAI-Compatible Local API Server',
      version: '2.0.0',
      description: 'Exposes local LLM completion endpoints on http://localhost:8080/v1',
      author: 'MAGD AI Runtime',
      enabled: false,
      permissions: ['LOCAL_NETWORK_SERVER'],
      category: 'ai',
    },
  ];

  public static getInstalledPlugins(): MAGDPlugin[] {
    return this.plugins;
  }

  public static togglePlugin(id: string, enabled: boolean): void {
    const plugin = this.plugins.find(p => p.id === id);
    if (plugin) {
      plugin.enabled = enabled;
    }
  }
}
