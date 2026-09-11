import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';

export interface AgentNode {
  id: string;
  name: string;
  role: 'Coding Agent' | 'Research Agent' | 'Study Agent' | 'Electronics Agent' | 'File Agent' | 'Android Agent';
  status: 'idle' | 'running' | 'completed' | 'failed';
  icon: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  agentRole: string;
  status: 'pending' | 'active' | 'done';
}

export interface AgentWorkflow {
  id: string;
  name: string;
  description: string;
  nodes: AgentNode[];
  steps: WorkflowStep[];
  isExecuting: boolean;
}

class AgentWorkflowStore {
  workflows: AgentWorkflow[] = [
    {
      id: 'wf-1',
      name: '⚙️ إصلاح وتطوير المشروع التلقائي (Auto-Fix & Refactor)',
      description: 'فحص ملفات الكود ➔ تحديد الأخطاء ➔ اقتراح الحلول ➔ تطبيق التعديلات',
      nodes: [
        {id: 'n1', name: 'File Agent', role: 'File Agent', status: 'completed', icon: '📄'},
        {id: 'n2', name: 'Coding Agent', role: 'Coding Agent', status: 'running', icon: '💀'},
        {id: 'n3', name: 'Android Agent', role: 'Android Agent', status: 'idle', icon: '📱'},
      ],
      steps: [
        {id: 's1', title: 'قراءة وفهرسة ملفات المشروع', agentRole: 'File Agent', status: 'done'},
        {id: 's2', title: 'تحليل الأخطاء البرمجية وإصلاح Gradle', agentRole: 'Coding Agent', status: 'active'},
        {id: 's3', title: 'التحقق من حزمة APK والتصاريح', agentRole: 'Android Agent', status: 'pending'},
      ],
      isExecuting: false,
    },
    {
      id: 'wf-2',
      name: '🔍 البحث العلمي وتوليد التقرير (Deep Research)',
      description: 'البحث عن المصادر ➔ التجميع والمقارنة ➔ صياغة التقرير المعرفي',
      nodes: [
        {id: 'n4', name: 'Research Agent', role: 'Research Agent', status: 'idle', icon: '🔍'},
        {id: 'n5', name: 'Study Agent', role: 'Study Agent', status: 'idle', icon: '🎓'},
      ],
      steps: [
        {id: 's4', title: 'البحث وجمع المصادر الأولية', agentRole: 'Research Agent', status: 'pending'},
        {id: 's5', title: 'تحليل البيانات وصياغة الملخص الخاتم', agentRole: 'Study Agent', status: 'pending'},
      ],
      isExecuting: false,
    },
  ];

  activeWorkflowId: string = 'wf-1';

  constructor() {
    makeAutoObservable(this);
  }

  runWorkflow(id: string) {
    const wf = this.workflows.find(w => w.id === id);
    if (wf) {
      wf.isExecuting = true;
      let stepIndex = 0;
      const interval = setInterval(() => {
        if (stepIndex < wf.steps.length) {
          wf.steps[stepIndex].status = 'done';
          stepIndex++;
          if (stepIndex < wf.steps.length) {
            wf.steps[stepIndex].status = 'active';
          }
        } else {
          wf.isExecuting = false;
          clearInterval(interval);
        }
      }, 1000);
    }
  }

  get activeWorkflow() {
    return this.workflows.find(w => w.id === this.activeWorkflowId) || this.workflows[0];
  }
}

export const agentWorkflowStore = new AgentWorkflowStore();
