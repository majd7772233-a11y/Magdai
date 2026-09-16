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
import {useNavigation} from '@react-navigation/native';

import {GlassCard} from '../../components/ui';
import {projectStore} from '../../store/ProjectStore';
import {ROUTES} from '../../utils/navigationConstants';

export const ProjectsScreen: React.FC = observer(() => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const isDark = theme.dark;

  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال اسم المشروع');
      return;
    }
    projectStore.createProject(name.trim(), description.trim());
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('حذف المشروع', 'هل أنت متأكد من حذف هذا المشروع؟', [
      {text: 'إلغاء', style: 'cancel'},
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => projectStore.deleteProject(id),
      },
    ]);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {backgroundColor: isDark ? '#0A0C14' : '#F4F6FC'},
      ]}
      contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <GlassCard
        style={styles.headerCard}
        glow
        glowColor="rgba(99, 102, 241, 0.25)">
        <Text
          style={[styles.headerTitle, {color: isDark ? '#E0E7FF' : '#312E81'}]}>
          🔗 نظام المشاريع (Projects Workspace)
        </Text>
        <Text
          style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          أنشئ مساحات عمل مستقلة تجمع المحادثات، والملفات، والذاكرة الخاصة بكل
          مشروع.
        </Text>
      </GlassCard>

      {/* Actions */}
      <TouchableOpacity
        style={[styles.createBtn, {backgroundColor: '#6366F1'}]}
        onPress={() => setIsCreating(!isCreating)}>
        <Text style={styles.createBtnText}>
          {isCreating ? 'إلغاء' : '+ مشروع جديد'}
        </Text>
      </TouchableOpacity>

      {/* New Project Form */}
      {isCreating && (
        <GlassCard style={styles.formCard}>
          <Text
            style={[styles.formTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
            إنشاء مشروع جديد
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder="اسم المشروع (مثلاً: 📱 تطبيق Android)"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder="وصف المشروع وأهدافه..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={description}
            onChangeText={setDescription}
          />
          <TouchableOpacity
            style={[
              styles.createBtn,
              {backgroundColor: '#10B981', marginTop: 8},
            ]}
            onPress={handleCreate}>
            <Text style={styles.createBtnText}>حفظ المشروع</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Project List */}
      {projectStore.projects.length === 0 ? (
        <Text
          style={[styles.emptyText, {color: isDark ? '#64748B' : '#94A3B8'}]}>
          لا توجد مشاريع قائمة حالياً. أنشئ مشروعك الأول الآن!
        </Text>
      ) : (
        projectStore.projects.map(proj => (
          <GlassCard key={proj.id} style={styles.projectCard}>
            <View style={styles.projectHeader}>
              <Text
                style={[
                  styles.projectName,
                  {color: isDark ? '#F1F5F9' : '#0F172A'},
                ]}>
                {proj.name}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(proj.id)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.projectDesc,
                {color: isDark ? '#CBD5E1' : '#334155'},
              ]}>
              {proj.description}
            </Text>

            <View style={styles.statsRow}>
              <Text style={styles.statChip}>💬 {proj.chatCount} محادثات</Text>
              <Text style={styles.statChip}>📄 {proj.filesCount} ملفات</Text>
            </View>

            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                projectStore.setActiveProject(proj.id);
                navigation.navigate(ROUTES.CHAT);
              }}>
              <Text style={styles.openBtnText}>فتح محادثات المشروع ➔</Text>
            </TouchableOpacity>
          </GlassCard>
        ))
      )}
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
  createBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  createBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
  formCard: {
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  projectCard: {
    marginBottom: 14,
  },
  projectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  projectName: {
    fontSize: 17,
    fontWeight: '700',
  },
  deleteIcon: {
    fontSize: 16,
  },
  projectDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statChip: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
    marginRight: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  openBtn: {
    alignSelf: 'flex-start',
  },
  openBtnText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
});
