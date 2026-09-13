import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';
import {CodingAgentService} from '../services/agent/CodingAgentService';
import {APKAnalyzerService} from '../services/tools/APKAnalyzerService';

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
  output?: string;
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
        {id: 'n1', name: 'File Agent', role: 'File Agent', status: 'idle', icon: '📄'},
        {id: 'n2', name: 'Coding Agent', role: 'Coding Agent', status: 'idle', icon: '💀'},
        {id: 'n3', name: 'Android Agent', role: 'Android Agent', status: 'idle', icon: '📱'},
      ],
      steps: [
        {id: 's1', title: 'قراءة وفهرسة ملفات المشروع', agentRole: 'File Agent', status: 'pending'},
        {id: 's2', title: 'تحليل الأخطاء البرمجية وإصلاح الكود', agentRole: 'Coding Agent', status: 'pending'},
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

  async runWorkflow(id: string) {
    const wf = this.workflows.find(w => w.id === id);
    if (!wf || wf.isExecuting) return;

    wf.isExecuting = true;

    // Step 1: File Agent
    wf.steps[0].status = 'active';
    wf.nodes[0].status = 'running';
    await new Promise(r => setTimeout(r, 600));

    const sampleFile = {path: 'App.tsx', content: 'console.log("Hello MAGD"); const x: any = 10;', language: 'typescript'};
    const analysis = CodingAgentService.analyzeCode(sampleFile);
    wf.steps[0].output = `تم فحص ${sampleFile.path}: وُجد ${analysis.issues.length} ملاحظة.`;
    wf.steps[0].status = 'done';
    wf.nodes[0].status = 'completed';

    // Step 2: Coding Agent
    if (wf.steps.length > 1) {
      wf.steps[1].status = 'active';
      wf.nodes[1].status = 'running';
      await new Promise(r => setTimeout(r, 600));

      const patch = CodingAgentService.generatePatch(sampleFile.content, 'إزالة any واستبدال console.log');
      wf.steps[1].output = `تم توليد الترقيع:\n${patch.slice(0, 80)}...`;
      wf.steps[1].status = 'done';
      wf.nodes[1].status = 'completed';
    }

    // Step 3: Android Agent
    if (wf.steps.length > 2) {
      wf.steps[2].status = 'active';
      wf.nodes[2].status = 'running';
      await new Promise(r => setTimeout(r, 600));

      const apkReport = APKAnalyzerService.analyzeAPK('com.magd.ai.apk');
      wf.steps[2].output = `تم فحص ${apkReport.packageName}: ${apkReport.permissions.length} تصاريح أمان.`;
      wf.steps[2].status = 'done';
      wf.nodes[2].status = 'completed';
    }

    wf.isExecuting = false;
  }

  get activeWorkflow() {
    return this.workflows.find(w => w.id === this.activeWorkflowId) || this.workflows[0];
  }
}

export const agentWorkflowStore = new AgentWorkflowStore();
