/**
 * Modular Plugin System Engine
 *
 * Manages plugin lifecycle hooks, dynamic tool registrations, version compatibility,
 * and permissions enforcement for local extension modules.
 */

export interface MAGDPluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  category: 'electronics' | 'coding' | 'system' | 'ai';
  requiredPermissions: string[];
  entryPoint: string;
  enabled: boolean;
}

export class PluginSystemManager {
  private static plugins: MAGDPluginManifest[] = [
    {
      id: 'plugin-termux',
      name: 'Termux Terminal Bridge',
      version: '1.0.0',
      description: 'Allows MAGD AI agents to dispatch commands to Termux session via Tasker Intent',
      author: 'MAGD AI Core',
      category: 'system',
      requiredPermissions: ['EXECUTE_COMMANDS', 'READ_LOCAL_STORAGE'],
      entryPoint: 'TermuxIntegrationService',
      enabled: true,
    },
    {
      id: 'plugin-electronics',
      name: 'Circuit & Microcontroller Assistant',
      version: '1.2.0',
      description: 'Provides Ohm law calculations, pinout definitions, and LED resistor values',
      author: 'MAGD AI Hardware Lab',
      category: 'electronics',
      requiredPermissions: ['ACCESS_HARDWARE_REFS'],
      entryPoint: 'ElectronicsEngine',
      enabled: true,
    },
    {
      id: 'plugin-local-api',
      name: 'OpenAI-Compatible Local API Server',
      version: '2.0.0',
      description: 'Exposes local LLM completion endpoints on http://localhost:8080/v1',
      author: 'MAGD AI Runtime',
      category: 'ai',
      requiredPermissions: ['LOCAL_NETWORK_SERVER'],
      entryPoint: 'LocalRuntimeAPIService',
      enabled: false,
    },
  ];

  public static getInstalledPlugins(): MAGDPluginManifest[] {
    return this.plugins;
  }

  public static togglePlugin(id: string, enabled: boolean): void {
    const plugin = this.plugins.find(p => p.id === id);
    if (plugin) {
      plugin.enabled = enabled;
    }
  }

  public static registerPlugin(manifest: MAGDPluginManifest): void {
    const existing = this.plugins.findIndex(p => p.id === manifest.id);
    if (existing !== -1) {
      this.plugins[existing] = manifest;
    } else {
      this.plugins.push(manifest);
    }
  }
}
