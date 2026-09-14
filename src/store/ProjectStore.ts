import {makeAutoObservable} from 'mobx';
import {makePersistable} from 'mobx-persist-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {v4 as uuidv4} from 'uuid';

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  tags: string[];
  rootPath?: string;
  createdAt: string;
  updatedAt: string;
  chatCount: number;
  filesCount: number;
}

class ProjectStore {
  projects: ProjectItem[] = [
    {
      id: 'proj-1',
      name: '📱 Android MAGD AI Project',
      description: 'مشروع تحويل PocketPal AI إلى منصة ✨ MAGD AI ✨ المحلية مع واجهة Liquid Glass',
      tags: ['Android', 'React Native', 'MAGD AI'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatCount: 4,
      filesCount: 12,
    },
  ];

  activeProjectId: string | null = 'proj-1';

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: 'MAGD_ProjectStore',
      properties: ['projects', 'activeProjectId'],
      storage: AsyncStorage,
    }).catch(err => {
      console.warn('ProjectStore persistence notice:', err);
    });
  }

  setActiveProject(id: string | null) {
    this.activeProjectId = id;
  }

  createProject(name: string, description: string, tags: string[] = []) {
    const project: ProjectItem = {
      id: uuidv4(),
      name,
      description,
      tags,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      chatCount: 0,
      filesCount: 0,
    };
    this.projects.push(project);
    return project;
  }

  deleteProject(id: string) {
    this.projects = this.projects.filter(p => p.id !== id);
    if (this.activeProjectId === id) {
      this.activeProjectId = null;
    }
  }

  get activeProject() {
    return this.projects.find(p => p.id === this.activeProjectId) || null;
  }
}

export const projectStore = new ProjectStore();
