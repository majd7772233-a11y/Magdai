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
import {MathTool, DevUtilsTool, UnitConverterTool} from '../../services/tools';

export const ToolsScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  // Math state
  const [expr, setExpr] = useState('2 * (15 + 35) / 5');
  const [mathResult, setMathResult] = useState('');

  // Base64 state
  const [base64Input, setBase64Input] = useState('✨ MAGD AI ✨');
  const [base64Result, setBase64Result] = useState('');

  // UUID state
  const [uuid, setUuid] = useState('');

  const handleCalc = () => {
    const res = MathTool.evaluate(expr);
    if (res.success) {
      setMathResult(String(res.result));
    } else {
      setMathResult(`خطأ: ${res.error}`);
    }
  };

  const handleBase64Encode = () => {
    setBase64Result(DevUtilsTool.encodeBase64(base64Input));
  };

  const handleBase64Decode = () => {
    try {
      setBase64Result(DevUtilsTool.decodeBase64(base64Input));
    } catch {
      setBase64Result('خطأ في تحويل Base64');
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
          🛠️ مركز الأدوات الذكية (Utilities Hub)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          أدوات حسابية وبرمجية محددة ودقيقة تنفذ المهام المباشرة محلياً بدون تخمين.
        </Text>
      </GlassCard>

      {/* Math Calculator Tool */}
      <GlassCard style={styles.toolCard}>
        <Text style={[styles.toolTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🧮 الحاسبة الرياضية
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          value={expr}
          onChangeText={setExpr}
          placeholder="أدخل معادلة رياضية..."
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity style={styles.btn} onPress={handleCalc}>
          <Text style={styles.btnText}>احسب النتيجة</Text>
        </TouchableOpacity>
        {mathResult ? (
          <Text style={[styles.resultText, {color: isDark ? '#10B981' : '#059669'}]}>
            النتيجة: {mathResult}
          </Text>
        ) : null}
      </GlassCard>

      {/* Base64 Tool */}
      <GlassCard style={styles.toolCard}>
        <Text style={[styles.toolTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🔐 محول Base64
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          value={base64Input}
          onChangeText={setBase64Input}
          placeholder="أدخل النص..."
          placeholderTextColor="#94A3B8"
        />
        <View style={styles.row}>
          <TouchableOpacity style={[styles.btn, styles.flexBtn]} onPress={handleBase64Encode}>
            <Text style={styles.btnText}>تشفير (Encode)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.flexBtn, {backgroundColor: '#3B82F6'}]} onPress={handleBase64Decode}>
            <Text style={styles.btnText}>فك التشفر (Decode)</Text>
          </TouchableOpacity>
        </View>
        {base64Result ? (
          <Text style={[styles.resultText, {color: isDark ? '#60A5FA' : '#2563EB'}]}>
            النتيجة: {base64Result}
          </Text>
        ) : null}
      </GlassCard>

      {/* UUID Tool */}
      <GlassCard style={styles.toolCard}>
        <Text style={[styles.toolTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🎲 مولد معرفات UUID v4
        </Text>
        <TouchableOpacity style={[styles.btn, {backgroundColor: '#10B981'}]} onPress={() => setUuid(DevUtilsTool.generateUUID())}>
          <Text style={styles.btnText}>توليد UUID جديد</Text>
        </TouchableOpacity>
        {uuid ? (
          <Text style={[styles.resultText, {color: isDark ? '#F59E0B' : '#D97706'}]}>
            {uuid}
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
  toolCard: {
    marginBottom: 14,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  btn: {
    backgroundColor: '#6366F1',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  flexBtn: {
    flex: 1,
  },
  resultText: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 6,
  },
});
