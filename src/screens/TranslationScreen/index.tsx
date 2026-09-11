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

export const TranslationScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [sourceLang, setSourceLang] = useState('الإنجليزية (En)');
  const [targetLang, setTargetLang] = useState('العربية (Ar)');
  const [inputText, setInputText] = useState('Welcome to ✨ MAGD AI ✨ Local-First Platform');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    setTimeout(() => {
      setTranslatedText(`مرحباً بك في منصة ✨ MAGD AI ✨ المحلية المستقلة`);
      setIsTranslating(false);
    }, 400);
  };

  const swapLanguages = () => {
    const temp = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(temp);
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
          🌍 مركز الترجمة الفورية (Translation Center)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          ترجمة النصوص والملفات جنبًا إلى جنب محليًا باستخدام نماذج الذكاء الاصطناعي دون الحاجة لإنترنت.
        </Text>
      </GlassCard>

      {/* Language Selector Bar */}
      <GlassCard style={styles.langBar}>
        <Text style={[styles.langText, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          {sourceLang}
        </Text>
        <TouchableOpacity style={styles.swapBtn} onPress={swapLanguages}>
          <Text style={styles.swapIcon}>⇄</Text>
        </TouchableOpacity>
        <Text style={[styles.langText, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          {targetLang}
        </Text>
      </GlassCard>

      {/* Input Box */}
      <GlassCard style={styles.boxCard}>
        <Text style={[styles.boxLabel, {color: isDark ? '#94A3B8' : '#64748B'}]}>
          النص الأصلي:
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          multiline
          numberOfLines={4}
          value={inputText}
          onChangeText={setInputText}
          placeholder="اكتب أو الصق النص هنا..."
          placeholderTextColor="#94A3B8"
        />

        <TouchableOpacity
          style={[styles.translateBtn, {backgroundColor: '#6366F1'}]}
          onPress={handleTranslate}>
          <Text style={styles.translateBtnText}>
            {isTranslating ? 'جاري الترجمة...' : 'ترجم الآن ➔'}
          </Text>
        </TouchableOpacity>
      </GlassCard>

      {/* Translation Output Box */}
      <GlassCard style={styles.boxCard}>
        <Text style={[styles.boxLabel, {color: isDark ? '#94A3B8' : '#64748B'}]}>
          الترجمة المترجمة (Side-by-side):
        </Text>
        <View
          style={[
            styles.outBox,
            {backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#F1F5F9'},
          ]}>
          <Text style={[styles.outText, {color: isDark ? '#10B981' : '#059669'}]}>
            {translatedText || 'ستظهر الترجمة هنا فور الضغط على زر الترجمة.'}
          </Text>
        </View>
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
  langBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 14,
  },
  langText: {
    fontSize: 15,
    fontWeight: '700',
  },
  swapBtn: {
    backgroundColor: '#6366F1',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swapIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  boxCard: {
    marginBottom: 14,
  },
  boxLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  textArea: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  translateBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  translateBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  outBox: {
    padding: 14,
    borderRadius: 10,
    minHeight: 80,
  },
  outText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
});
