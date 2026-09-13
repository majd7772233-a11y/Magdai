import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {observer} from 'mobx-react';
import {useTheme} from 'react-native-paper';

import {GlassCard} from '../../components/ui';
import {agentWorkflowStore} from '../../store/AgentWorkflowStore';
import {SandboxService} from '../../services/agent/SandboxService';
import {CodingAgentService, CodeAnalysisResult} from '../../services/agent/CodingAgentService';

export const AgentsScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [sandboxCode, setSandboxCode] = useState('const a = 15; const b = 27; a + b;');
  const [sandboxResult, setSandboxResult] = useState('');

  const [codeToAnalyze, setCodeToAnalyze] = useState('console.log("Analyzing file...");\nlet data: any = "test";');
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [patchStatus, setPatchStatus] = useState<string | null>(null);

  const activeWf = agentWorkflowStore.activeWorkflow;

  const handleAnalyzeCode = () => {
    const res = CodingAgentService.analyzeCode({
      path: 'App.tsx',
      content: codeToAnalyze,
      language: 'typescript',
    });
    setAnalysisResult(res);
    setPatchStatus(null);
  };

  const handleApprovePatch = () => {
    if (analysisResult?.proposedFix) {
      setCodeToAnalyze(analysisResult.proposedFix);
      setPatchStatus('✓ تم تطبيق التعديل بنجاح على الملف');
    }
  };

  const handleRunSandbox = () => {
    const res = SandboxService.executeJavaScript(sandboxCode);
    if (res.success) {
      setSandboxResult(`مخرجات الساندبوكس (وقت التشغيل: ${res.executionTimeMs}ms):\n${res.output}`);
    } else {
      setSandboxResult(`خطأ في التشغيل: ${res.error}`);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDark ? '#0A0C14' : '#F4F6FC'},
      ]}
      contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <GlassCard style={styles.headerCard} glow glowColor="rgba(99, 102, 241, 0.25)">
        <Text style={[styles.headerTitle, {color: isDark ? '#E0E7FF' : '#312E81'}]}>
          🤖 نظام الوكلاء المتقدم (Agent System & Graph)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          تشغيل خوارزميات ووكلاء أذكياء (Coding, Research, File, Android) مع بيئة تشغيل آمنة Sandbox.
        </Text>
      </GlassCard>

      {/* Agent Graph Visualizer */}
      <GlassCard style={styles.graphCard}>
        <Text style={[styles.sectionTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🕸️ عرض الرسم البياني للوكلاء (Agent Graph)
        </Text>
        <View style={styles.nodesRow}>
          {activeWf.nodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <View style={styles.nodeBox}>
                <Text style={styles.nodeIcon}>{node.icon}</Text>
                <Text style={[styles.nodeName, {color: isDark ? '#F8FAFC' : '#1E293B'}]}>
                  {node.name}
                </Text>
                <Text
                  style={[
                    styles.nodeStatus,
                    {
                      color:
                        node.status === 'completed'
                          ? '#10B981'
                          : node.status === 'running'
                          ? '#F59E0B'
                          : '#94A3B8',
                    },
                  ]}>
                  ● {node.status}
                </Text>
              </View>
              {idx < activeWf.nodes.length - 1 ? (
                <Text style={styles.arrowText}>➔</Text>
              ) : null}
            </React.Fragment>
          ))}
        </View>
      </GlassCard>

      {/* Active Workflow Steps */}
      <GlassCard style={styles.workflowCard}>
        <Text style={[styles.sectionTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          {activeWf.name}
        </Text>
        <Text style={[styles.wfDesc, {color: isDark ? '#94A3B8' : '#64748B'}]}>
          {activeWf.description}
        </Text>

        {activeWf.steps.map(step => (
          <View key={step.id} style={styles.stepRow}>
            <Text
              style={[
                styles.stepBadge,
                {
                  backgroundColor:
                    step.status === 'done'
                      ? 'rgba(16, 185, 129, 0.15)'
                      : step.status === 'active'
                      ? 'rgba(245, 158, 11, 0.15)'
                      : 'rgba(148, 163, 184, 0.15)',
                  color:
                    step.status === 'done'
                      ? '#10B981'
                      : step.status === 'active'
                      ? '#F59E0B'
                      : '#94A3B8',
                },
              ]}>
              {step.status === 'done' ? '✓ مكتمل' : step.status === 'active' ? '⚙️ نشط' : 'قيد الانتظار'}
            </Text>
            <Text style={[styles.stepTitle, {color: isDark ? '#E2E8F0' : '#1E293B'}]}>
              {step.title}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={[styles.runBtn, {backgroundColor: '#6366F1'}]}
          disabled={activeWf.isExecuting}
          onPress={() => agentWorkflowStore.runWorkflow(activeWf.id)}>
          <Text style={styles.runBtnText}>
            {activeWf.isExecuting ? 'جاري تشغيل تسلسل الوكلاء...' : '▶ تشغيل التسلسل الذكي (Run Workflow)'}
          </Text>
        </TouchableOpacity>
      </GlassCard>

      {/* Coding Agent Diff & Patch Inspector */}
      <GlassCard style={styles.workflowCard}>
        <Text style={[styles.sectionTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          💀 فحص الكود وتوليد الترقيع (Coding Agent Diff)
        </Text>
        <TextInput
          style={[
            styles.codeInput,
            {backgroundColor: isDark ? '#0F172A' : '#1E293B', color: '#A7F3D0'},
          ]}
          multiline
          numberOfLines={3}
          value={codeToAnalyze}
          onChangeText={setCodeToAnalyze}
        />
        <TouchableOpacity
          style={[styles.runBtn, {backgroundColor: '#3B82F6'}]}
          onPress={handleAnalyzeCode}>
          <Text style={styles.runBtnText}>فحص الكود واستخراج Diff 🔍</Text>
        </TouchableOpacity>

        {analysisResult ? (
          <View style={{marginTop: 10}}>
            <Text style={{color: '#F59E0B', fontWeight: '700', marginBottom: 4}}>
              الملاحظات والأخطاء ({analysisResult.issues.length}):
            </Text>
            {analysisResult.issues.map((iss, i) => (
              <Text key={i} style={{color: isDark ? '#CBD5E1' : '#334155', fontSize: 13}}>
                - السطر {iss.line}: {iss.message}
              </Text>
            ))}

            {analysisResult.diff ? (
              <View style={{marginTop: 8, padding: 8, borderRadius: 6, backgroundColor: isDark ? '#020617' : '#0F172A'}}>
                <Text style={{color: '#38BDF8', fontWeight: '700', fontSize: 12, marginBottom: 4}}>
                  فروقات Diff المعتمدة:
                </Text>
                <Text style={{fontFamily: 'monospace', color: '#E2E8F0', fontSize: 12}}>
                  {analysisResult.diff}
                </Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.runBtn, {backgroundColor: '#10B981', marginTop: 10}]}
              onPress={handleApprovePatch}>
              <Text style={styles.runBtnText}>✓ موافقة وتطبيق الترقيع (Approve Patch)</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {patchStatus ? (
          <Text style={{color: '#10B981', fontWeight: '700', marginTop: 8}}>
            {patchStatus}
          </Text>
        ) : null}
      </GlassCard>

      {/* Code Sandbox */}
      <GlassCard style={styles.sandboxCard}>
        <Text style={[styles.sectionTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🧪 بيئة تشغيل الكود الآمنة (Code Sandbox)
        </Text>
        <TextInput
          style={[
            styles.codeInput,
            {
              backgroundColor: isDark ? '#0F172A' : '#1E293B',
              color: '#38BDF8',
            },
          ]}
          multiline
          numberOfLines={3}
          value={sandboxCode}
          onChangeText={setSandboxCode}
        />
        <TouchableOpacity
          style={[styles.runBtn, {backgroundColor: '#10B981'}]}
          onPress={handleRunSandbox}>
          <Text style={styles.runBtnText}>تشغيل آمن داخل Sandbox ⚡</Text>
        </TouchableOpacity>
        {sandboxResult ? (
          <Text style={[styles.resultBox, {color: isDark ? '#A7F3D0' : '#047857'}]}>
            {sandboxResult}
          </Text>
        ) : null}
      </GlassCard>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  headerCard: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  headerSub: {
    fontSize: 14,
    lineHeight: 20,
  },
  graphCard: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  nodesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  nodeBox: {
    alignItems: 'center',
    padding: 8,
  },
  nodeIcon: {
    fontSize: 26,
    marginBottom: 4,
  },
  nodeName: {
    fontSize: 13,
    fontWeight: '700',
  },
  nodeStatus: {
    fontSize: 11,
    fontWeight: '600',
  },
  arrowText: {
    fontSize: 18,
    color: '#6366F1',
  },
  workflowCard: {
    marginBottom: 14,
  },
  wfDesc: {
    fontSize: 13,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  runBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  runBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  sandboxCard: {
    marginBottom: 14,
  },
  codeInput: {
    fontFamily: 'monospace',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    marginBottom: 10,
  },
  resultBox: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
