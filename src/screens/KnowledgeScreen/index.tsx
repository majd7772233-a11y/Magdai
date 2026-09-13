import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {observer} from 'mobx-react';
import {useTheme} from 'react-native-paper';

import {GlassCard} from '../../components/ui';
import {knowledgeStore} from '../../store/KnowledgeStore';

export const KnowledgeScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📚');

  const [docName, setDocName] = useState('');
  const [selectedSpaceForDoc, setSelectedSpaceForDoc] = useState<string | null>(null);

  const handleCreateSpace = () => {
    if (!title.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال عنوان المساحة المعرفية');
      return;
    }
    knowledgeStore.createSpace(title.trim(), description.trim(), icon.trim() || '📚');
    setTitle('');
    setDescription('');
    setIsCreating(false);
  };

  const handleAddDoc = (spaceId: string) => {
    if (!docName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المستند');
      return;
    }
    knowledgeStore.addDocumentToSpace(spaceId, docName.trim(), 'محتوى الدليل والمعرفة المخصص لهذا المستند...', 'pdf');
    setDocName('');
    setSelectedSpaceForDoc(null);
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
          📚 قاعدة المعرفة وذكاء الملفات (RAG)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          أنشئ مساحات معرفية وحمّل كتبك ومستنداتك ليتذكرها ✨ MAGD AI ✨ ويستشهد بها بالصفحة والتاريخ.
        </Text>
      </GlassCard>

      {/* RAG Search Widget */}
      <GlassCard style={{marginBottom: 16}}>
        <Text style={[styles.formTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
          🔍 اختبار استرجاع RAG المباشر
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
              color: isDark ? '#FFFFFF' : '#000000',
            },
          ]}
          placeholder="ابحث في مستندات قاعدة المعرفة (مثلاً: Android architecture)..."
          placeholderTextColor="#94A3B8"
          value={knowledgeStore.searchQuery}
          onChangeText={q => knowledgeStore.setSearchQuery(q)}
        />
        {knowledgeStore.searchQuery.trim() ? (
          <View style={{marginTop: 8}}>
            <Text style={{color: '#818CF8', fontWeight: '700', marginBottom: 6}}>
              المقاطع المسترجعة دلالياً:
            </Text>
            {knowledgeStore.searchRAG(knowledgeStore.searchQuery).map((chunk, idx) => (
              <View key={idx} style={{marginBottom: 6, padding: 8, borderRadius: 6, backgroundColor: 'rgba(99, 102, 241, 0.1)'}}>
                <Text style={{fontWeight: '700', color: isDark ? '#FFF' : '#000', fontSize: 12}}>
                  📄 {chunk.docName}
                </Text>
                <Text style={{color: isDark ? '#CBD5E1' : '#334155', fontSize: 13, marginTop: 2}}>
                  "{chunk.content}"
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </GlassCard>

      {/* Action */}
      <TouchableOpacity
        style={[styles.btn, {backgroundColor: '#6366F1', marginBottom: 16}]}
        onPress={() => setIsCreating(!isCreating)}>
        <Text style={styles.btnText}>
          {isCreating ? 'إلغاء' : '+ مساحة معرفية جديدة'}
        </Text>
      </TouchableOpacity>

      {/* New Space Form */}
      {isCreating && (
        <GlassCard style={styles.formCard}>
          <Text style={[styles.formTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
            إنشاء مساحة معرفية (Knowledge Space)
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder="العنوان (مثلاً: 📱 دروس Java & Android)"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder="الوصف..."
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#10B981', marginTop: 6}]}
            onPress={handleCreateSpace}>
            <Text style={styles.btnText}>حفظ المساحة</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Knowledge Spaces List */}
      {knowledgeStore.spaces.map(space => (
        <GlassCard key={space.id} style={styles.spaceCard}>
          <View style={styles.spaceHeader}>
            <Text style={styles.spaceIcon}>{space.icon}</Text>
            <View style={styles.spaceTitleBox}>
              <Text style={[styles.spaceTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
                {space.title}
              </Text>
              <Text style={[styles.spaceDesc, {color: isDark ? '#94A3B8' : '#64748B'}]}>
                {space.description}
              </Text>
            </View>
          </View>

          {/* Docs List inside space */}
          <Text style={[styles.sectionSubtitle, {color: isDark ? '#CBD5E1' : '#334155'}]}>
            📄 المستندات المفهرسة ({space.documents.length})
          </Text>
          {space.documents.length === 0 ? (
            <Text style={{color: '#94A3B8', fontSize: 13, marginVertical: 6}}>
              لا توجد مستندات بعد في هذه المساحة.
            </Text>
          ) : (
            space.documents.map(doc => (
              <View key={doc.id} style={styles.docRow}>
                <Text style={{fontSize: 14, color: isDark ? '#E2E8F0' : '#1E293B', flex: 1}}>
                  📄 {doc.name}
                </Text>
                <Text style={styles.indexedBadge}>
                  {doc.chunksCount} مقطع محول لـ Embeddings ✓
                </Text>
              </View>
            ))
          )}

          {/* Add Doc Inline */}
          {selectedSpaceForDoc === space.id ? (
            <View style={{marginTop: 10}}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                    color: isDark ? '#FFFFFF' : '#000000',
                  },
                ]}
                placeholder="اسم الملف (PDF/DOCX/TXT)..."
                placeholderTextColor="#94A3B8"
                value={docName}
                onChangeText={setDocName}
              />
              <TouchableOpacity
                style={[styles.btn, {backgroundColor: '#10B981'}]}
                onPress={() => handleAddDoc(space.id)}>
                <Text style={styles.btnText}>إضافة وفهرسة الملف</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addDocBtn}
              onPress={() => setSelectedSpaceForDoc(space.id)}>
              <Text style={styles.addDocText}>+ إضافة مستند للمساحة</Text>
            </TouchableOpacity>
          )}
        </GlassCard>
      ))}
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
  btn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    fontSize: 14,
  },
  spaceCard: {
    marginBottom: 14,
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  spaceIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  spaceTitleBox: {
    flex: 1,
  },
  spaceTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  spaceDesc: {
    fontSize: 13,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 6,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(148, 163, 184, 0.2)',
  },
  indexedBadge: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  addDocBtn: {
    marginTop: 10,
  },
  addDocText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 13,
  },
});
