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
import {memoryStore} from '../../store/MemoryStore';

export const MemoryScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const categories = [
    {id: 'all', label: 'الكل'},
    {id: 'preference', label: 'تفضيلات'},
    {id: 'long_term', label: 'طويلة المدى'},
    {id: 'project', label: 'مشاريع'},
    {id: 'knowledge', label: 'معرفة'},
  ];

  const filtered = memoryStore.filteredMemories.filter(m => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const handleAddMemory = () => {
    if (!newTitle.trim() || !newContent.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال العنوان والمحتوى');
      return;
    }
    memoryStore.addMemory({
      category: (activeCategory === 'all'
        ? 'long_term'
        : activeCategory) as any,
      title: newTitle.trim(),
      content: newContent.trim(),
    });
    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      'حذف المعلومة',
      'هل أنت تأكد من حذف هذه المعلومة من ذاكرة MAGD AI؟',
      [
        {text: 'إلغاء', style: 'cancel'},
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => memoryStore.deleteMemory(id),
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert('مسح الذاكرة بالكامل', 'هل أنت متأكد من مسح جميع الذكريات؟', [
      {text: 'إلغاء', style: 'cancel'},
      {
        text: 'مسح الكل',
        style: 'destructive',
        onPress: () => memoryStore.clearAllMemories(),
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
          🧠 مركز الذاكرة (Memory Control Center)
        </Text>
        <Text
          style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          ما يعرفه ✨ MAGD AI ✨ عنك وعن مشاريعك لتوفير تجربة مخصصة ودقيقة.
        </Text>
      </GlassCard>

      {/* Search Input */}
      <View style={styles.searchBox}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#FFFFFF',
              color: isDark ? '#F8FAFC' : '#0F172A',
            },
          ]}
          placeholder="ابحث في الذاكرة..."
          placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
          value={memoryStore.searchQuery}
          onChangeText={text => memoryStore.setSearchQuery(text)}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            onPress={() => setActiveCategory(cat.id)}
            style={[
              styles.tabChip,
              {
                backgroundColor:
                  activeCategory === cat.id
                    ? '#6366F1'
                    : isDark
                      ? 'rgba(30, 41, 59, 0.6)'
                      : '#E2E8F0',
              },
            ]}>
            <Text
              style={[
                styles.tabChipText,
                {
                  color:
                    activeCategory === cat.id
                      ? '#FFFFFF'
                      : isDark
                        ? '#CBD5E1'
                        : '#334155',
                },
              ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: '#6366F1'}]}
          onPress={() => setIsAdding(!isAdding)}>
          <Text style={styles.btnText}>
            {isAdding ? 'إلغاء' : '+ إضافة معلومة'}
          </Text>
        </TouchableOpacity>

        {memoryStore.memories.length > 0 && (
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: 'rgba(239, 68, 68, 0.2)'}]}
            onPress={handleClearAll}>
            <Text style={{color: '#EF4444', fontWeight: '700'}}>مسح الكل</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Add Form */}
      {isAdding && (
        <GlassCard style={styles.addCard}>
          <Text
            style={[styles.formTitle, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
            إضافة حقيقة/تفضيل جديد إلى الذاكرة
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                color: isDark ? '#FFFFFF' : '#000000',
              },
            ]}
            placeholder="العنوان (مثلاً: طريقة الشرح)"
            placeholderTextColor="#94A3B8"
            value={newTitle}
            onChangeText={setNewTitle}
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
            placeholder="المحتوى والمعلومات..."
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            value={newContent}
            onChangeText={setNewContent}
          />
          <TouchableOpacity
            style={[styles.btn, {backgroundColor: '#10B981', marginTop: 8}]}
            onPress={handleAddMemory}>
            <Text style={styles.btnText}>حفظ في الذاكرة</Text>
          </TouchableOpacity>
        </GlassCard>
      )}

      {/* Memory List */}
      {filtered.length === 0 ? (
        <Text
          style={[styles.emptyText, {color: isDark ? '#64748B' : '#94A3B8'}]}>
          لا توجد ذكريات محفوظة في هذه الفئة.
        </Text>
      ) : (
        filtered.map(item => (
          <GlassCard key={item.id} style={styles.memoryCard}>
            <View style={styles.cardHeader}>
              <Text
                style={[
                  styles.itemTitle,
                  {color: isDark ? '#F1F5F9' : '#0F172A'},
                ]}>
                {item.title}
              </Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.itemContent,
                {color: isDark ? '#CBD5E1' : '#334155'},
              ]}>
              {item.content}
            </Text>
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
  searchBox: {
    marginBottom: 12,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  tabsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tabChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  tabChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  btn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  addCard: {
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  memoryCard: {
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  deleteIcon: {
    fontSize: 16,
  },
  itemContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 15,
  },
});
