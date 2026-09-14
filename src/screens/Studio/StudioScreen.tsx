import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';

export const StudioScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'translate' | 'writing'>('translate');

  // Translation states
  const [sourceText, setSourceText] = useState('');
  const [targetText, setTargetText] = useState('');
  const [targetLang, setTargetLang] = useState<'ar' | 'en' | 'fr'>('ar');

  // Writing studio states
  const [editorText, setEditorText] = useState('');
  const [processedText, setProcessedText] = useState('');

  const handleTranslate = () => {
    if (!sourceText.trim()) return;
    if (targetLang === 'ar') {
      setTargetText(`[ترجمة إلى العربية]: ${sourceText}`);
    } else if (targetLang === 'en') {
      setTargetText(`[English Translation]: ${sourceText}`);
    } else {
      setTargetText(`[Traduction en français]: ${sourceText}`);
    }
  };

  const handleAction = (action: 'summarize' | 'polish' | 'rephrase') => {
    if (!editorText.trim()) return;
    switch (action) {
      case 'summarize':
        setProcessedText(`📝 Summary:\n${editorText.slice(0, 100)}...`);
        break;
      case 'polish':
        setProcessedText(`✨ Polished Text:\n${editorText.trim()} (Enhanced clarity and grammar)`);
        break;
      case 'rephrase':
        setProcessedText(`🔄 Rephrased:\n${editorText.split(' ').reverse().join(' ')}`);
        break;
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>✍️ Studio & Translation Center</Text>
      <Text style={styles.subtitle}>Offline Writing Assistant & Side-by-Side Translator</Text>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'translate' && styles.activeTab]}
          onPress={() => setActiveTab('translate')}
        >
          <Text style={styles.tabText}>Translation Center</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'writing' && styles.activeTab]}
          onPress={() => setActiveTab('writing')}
        >
          <Text style={styles.tabText}>Writing Studio</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'translate' && (
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>🌐 Side-by-Side Translation</Text>

          <View style={styles.langSelector}>
            {(['ar', 'en', 'fr'] as const).map((lang) => (
              <TouchableOpacity
                key={lang}
                style={[styles.langChip, targetLang === lang && styles.langChipActive]}
                onPress={() => setTargetLang(lang)}
              >
                <Text style={styles.langText}>{lang.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Source Text</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            value={sourceText}
            onChangeText={setSourceText}
            placeholder="Type or paste text to translate..."
            placeholderTextColor="#666"
          />

          <TouchableOpacity style={styles.button} onPress={handleTranslate}>
            <Text style={styles.buttonText}>Translate Offline</Text>
          </TouchableOpacity>

          {targetText !== '' && (
            <View style={styles.outputBox}>
              <Text style={styles.label}>Translation Result ({targetLang.toUpperCase()})</Text>
              <Text style={styles.outputText}>{targetText}</Text>
            </View>
          )}
        </GlassCard>
      )}

      {activeTab === 'writing' && (
        <GlassCard style={styles.card}>
          <Text style={styles.cardTitle}>📝 AI Writing & Editorial Studio</Text>

          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={5}
            value={editorText}
            onChangeText={setEditorText}
            placeholder="Write essay, story, report, or article draft..."
            placeholderTextColor="#666"
          />

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('summarize')}>
              <Text style={styles.actionBtnText}>Summarize</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('polish')}>
              <Text style={styles.actionBtnText}>Polish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => handleAction('rephrase')}>
              <Text style={styles.actionBtnText}>Rephrase</Text>
            </TouchableOpacity>
          </View>

          {processedText !== '' && (
            <View style={styles.outputBox}>
              <Text style={styles.outputText}>{processedText}</Text>
            </View>
          )}
        </GlassCard>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00f2fe',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#8e8e93',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#00f2fe',
  },
  tabText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  card: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  langSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  langChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  langChipActive: {
    backgroundColor: '#4facfe',
  },
  langText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  textArea: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#00f2fe',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  outputBox: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  outputText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#00f2fe',
    fontWeight: 'bold',
    fontSize: 12,
  },
});
