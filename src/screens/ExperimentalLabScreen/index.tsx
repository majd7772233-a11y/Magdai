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
import {TermuxIntegrationService, LocalRuntimeAPIService} from '../../services/integration';
import {APKAnalyzerService, APKAnalysisReport} from '../../services/tools/APKAnalyzerService';
import {LiveVisionService, LiveVisionFrame} from '../../services/vision/LiveVisionService';

export const ExperimentalLabScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  // Termux state
  const [termuxCmd, setTermuxCmd] = useState('python --version');
  const [termuxOut, setTermuxCmdOut] = useState('');

  // Local API state
  const [apiRunning, setApiRunning] = useState(false);

  // APK Analyzer state
  const [apkReport, setApkReport] = useState<APKAnalysisReport | null>(null);

  // Live Vision state
  const [isVisionActive, setIsVisionActive] = useState(false);
  const [lastFrame, setLastFrame] = useState<LiveVisionFrame | null>(null);

  const handleRunTermux = async () => {
    const res = await TermuxIntegrationService.executeCommand(termuxCmd);
    setTermuxCmdOut(res.output);
  };

  const toggleLocalAPI = () => {
    if (apiRunning) {
      LocalRuntimeAPIService.stopServer();
      setApiRunning(false);
    } else {
      LocalRuntimeAPIService.startServer(8080);
      setApiRunning(true);
    }
  };

  const handleAnalyzeAPK = () => {
    const rep = APKAnalyzerService.analyzeAPK('sample.apk');
    setApkReport(rep);
  };

  const toggleLiveVision = () => {
    if (isVisionActive) {
      LiveVisionService.stopLiveVision();
      setIsVisionActive(false);
    } else {
      setIsVisionActive(true);
      LiveVisionService.startLiveVision(frame => setLastFrame(frame));
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
      <GlassCard style={styles.headerCard} glow glowColor="rgba(236, 72, 153, 0.35)">
        <Text style={[styles.headerTitle, {color: isDark ? '#FCE7F3' : '#831843'}]}>
          🌱 المختبر التجريبي المتقدم (Experimental Lab 💀)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          تقنيات ومميزات المستقبل: Live Vision، تكامل Termux، خادم Local API، وتحليل ملفات APK.
        </Text>
      </GlassCard>

      {/* Live Vision Card */}
      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          📷 الرؤية الحية المستمرة (Live Vision)
        </Text>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: isVisionActive ? '#EF4444' : '#10B981'}]}
          onPress={toggleLiveVision}>
          <Text style={styles.btnText}>
            {isVisionActive ? 'إيقاف البث الحي' : 'بدء الرؤية الحية بالكاميرا 🎥'}
          </Text>
        </TouchableOpacity>
        {lastFrame ? (
          <View style={styles.frameBox}>
            <Text style={[styles.frameDesc, {color: isDark ? '#A7F3D0' : '#047857'}]}>
              {lastFrame.description}
            </Text>
            <Text style={{color: '#94A3B8', fontSize: 12, marginTop: 4}}>
              العناصر المكتشفة: {lastFrame.detectedObjects.join(', ')}
            </Text>
          </View>
        ) : null}
      </GlassCard>

      {/* Local API Server Card */}
      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          📡 Local AI Runtime API Server
        </Text>
        <Text style={[styles.infoText, {color: isDark ? '#94A3B8' : '#64748B'}]}>
          تشغيل خادم محلي على الجهاز لتوصيل تطبيقات أخرى بـ ✨ MAGD AI ✨ عبر http://localhost:8080.
        </Text>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: apiRunning ? '#EF4444' : '#6366F1'}]}
          onPress={toggleLocalAPI}>
          <Text style={styles.btnText}>
            {apiRunning ? 'إيقاف Local API' : 'تفعيل Local API Server'}
          </Text>
        </TouchableOpacity>
        {apiRunning ? (
          <Text style={styles.statusActive}>● الخادم يعمل الآن على الميناء 8080</Text>
        ) : null}
      </GlassCard>

      {/* Termux Integration Card */}
      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          💻 تكامل Termux (Termux Integration Bridge)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          value={termuxCmd}
          onChangeText={setTermuxCmd}
          placeholder="أمر Termux..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#3B82F6'}]} onPress={handleRunTermux}>
          <Text style={styles.btnText}>إرسال الأمر لـ Termux ➔</Text>
        </TouchableOpacity>
        {termuxOut ? (
          <Text style={[styles.outBox, {color: isDark ? '#60A5FA' : '#1D4ED8'}]}>
            {termuxOut}
          </Text>
        ) : null}
      </GlassCard>

      {/* APK Analyzer Card */}
      <GlassCard style={styles.card}>
        <Text style={[styles.cardTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🧪 محرر ومحلل تطبيق APK (APK Analyzer)
        </Text>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#8B5CF6'}]} onPress={handleAnalyzeAPK}>
          <Text style={styles.btnText}>فحص وتحليل حزمة APK</Text>
        </TouchableOpacity>
        {apkReport ? (
          <View style={styles.apkBox}>
            <Text style={{fontWeight: '700', color: isDark ? '#FFF' : '#000'}}>
              اسم الحزمة: {apkReport.packageName} ({apkReport.versionName})
            </Text>
            <Text style={{color: '#94A3B8', fontSize: 13, marginTop: 4}}>
              التصاريح المطلوبة: {apkReport.permissions.length} تصاريح
            </Text>
          </View>
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
  card: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    marginBottom: 10,
    lineHeight: 18,
  },
  btn: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  frameBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  frameDesc: {
    fontSize: 14,
    fontWeight: '600',
  },
  statusActive: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  outBox: {
    marginTop: 6,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  apkBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});
