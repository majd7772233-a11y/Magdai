import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {observer} from 'mobx-react';
import {useTheme} from 'react-native-paper';

import {GlassCard} from '../../components/ui';
import {studyStore} from '../../store/StudyStore';

export const StudyScreen: React.FC = observer(() => {
  const theme = useTheme();
  const isDark = theme.dark;

  const [mode, setMode] = useState<'quiz' | 'flashcards'>('quiz');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  const currentQ = studyStore.sampleQuiz[studyStore.currentQuizIndex];

  const handleSelectOption = (idx: number) => {
    setSelectedOption(idx);
    studyStore.answerQuestion(idx);
    setSelectedOption(null);
  };

  const toggleShowAnswer = (id: string) => {
    setShowAnswer(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleAddCard = () => {
    if (newQ.trim() && newA.trim()) {
      studyStore.addFlashcard(newQ.trim(), newA.trim());
      setNewQ('');
      setNewA('');
      setIsAddingCard(false);
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
          🎓 وضع الدراسة والتعلم التكيفي (Study Mode)
        </Text>
        <Text style={[styles.headerSub, {color: isDark ? '#94A3B8' : '#475569'}]}>
          اختبر معلوماتك بالأسئلة والبطاقات التعليمية Flashcards مع متابعة نقاط القوة والضعف.
        </Text>
      </GlassCard>

      {/* Mode Switcher */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, mode === 'quiz' && styles.activeTabBtn]}
          onPress={() => setMode('quiz')}>
          <Text style={[styles.tabBtnText, mode === 'quiz' && styles.activeTabText]}>
            📝 اختبارات Quiz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, mode === 'flashcards' && styles.activeTabBtn]}
          onPress={() => setMode('flashcards')}>
          <Text style={[styles.tabBtnText, mode === 'flashcards' && styles.activeTabText]}>
            🎴 بطاقات Flashcards
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'quiz' ? (
        <GlassCard style={styles.quizCard}>
          {studyStore.quizCompleted ? (
            <View style={styles.completedBox}>
              <Text style={styles.completedTitle}>🎉 اكتمل الاختبار!</Text>
              <Text style={[styles.scoreText, {color: isDark ? '#10B981' : '#059669'}]}>
                النتيجة: {studyStore.score} من {studyStore.sampleQuiz.length}
              </Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => studyStore.resetQuiz()}>
                <Text style={styles.retryBtnText}>إعادة الاختبار 🔄</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.questionNum, {color: isDark ? '#818CF8' : '#4F46E5'}]}>
                السؤال {studyStore.currentQuizIndex + 1} من {studyStore.sampleQuiz.length}
              </Text>
              <Text style={[styles.questionText, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
                {currentQ.question}
              </Text>

              {currentQ.options.map((opt, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionBtn,
                    {backgroundColor: isDark ? 'rgba(30, 41, 59, 0.8)' : '#F1F5F9'},
                  ]}
                  onPress={() => handleSelectOption(idx)}>
                  <Text style={[styles.optionText, {color: isDark ? '#F8FAFC' : '#1E293B'}]}>
                    {idx + 1}. {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </>
          )}
        </GlassCard>
      ) : (
        <>
          <TouchableOpacity
            style={[styles.retryBtn, {backgroundColor: '#6366F1', marginBottom: 12}]}
            onPress={() => setIsAddingCard(!isAddingCard)}>
            <Text style={styles.retryBtnText}>
              {isAddingCard ? 'إلغاء' : '+ إضافة بطاقة جديدة'}
            </Text>
          </TouchableOpacity>

          {isAddingCard && (
            <GlassCard style={{marginBottom: 14}}>
              <TextInput
                style={[styles.input, {backgroundColor: isDark ? '#1E293B' : '#F1F5F9', color: isDark ? '#FFF' : '#000'}]}
                placeholder="السؤال/المفهوم..."
                placeholderTextColor="#94A3B8"
                value={newQ}
                onChangeText={setNewQ}
              />
              <TextInput
                style={[styles.input, {backgroundColor: isDark ? '#1E293B' : '#F1F5F9', color: isDark ? '#FFF' : '#000'}]}
                placeholder="الإجابة/الشرح..."
                placeholderTextColor="#94A3B8"
                value={newA}
                onChangeText={setNewA}
              />
              <TouchableOpacity style={[styles.retryBtn, {backgroundColor: '#10B981'}]} onPress={handleAddCard}>
                <Text style={styles.retryBtnText}>حفظ البطاقة</Text>
              </TouchableOpacity>
            </GlassCard>
          )}

          {studyStore.flashcards.map(card => (
            <GlassCard key={card.id} style={styles.cardItem}>
              <Text style={[styles.cardQ, {color: isDark ? '#F1F5F9' : '#0F172A'}]}>
                ❓ {card.question}
              </Text>

              {showAnswer[card.id] ? (
                <Text style={[styles.cardA, {color: isDark ? '#A7F3D0' : '#047857'}]}>
                  💡 {card.answer}
                </Text>
              ) : null}

              <TouchableOpacity
                style={styles.toggleBtn}
                onPress={() => toggleShowAnswer(card.id)}>
                <Text style={styles.toggleBtnText}>
                  {showAnswer[card.id] ? 'إخفاء الإجابة' : 'عرض الإجابة 👁️'}
                </Text>
              </TouchableOpacity>
            </GlassCard>
          ))}
        </>
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
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
    alignItems: 'center',
  },
  activeTabBtn: {
    backgroundColor: '#6366F1',
  },
  tabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  quizCard: {
    padding: 16,
  },
  questionNum: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 24,
  },
  optionBtn: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  completedBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  completedTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cardItem: {
    marginBottom: 12,
  },
  cardQ: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardA: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 6,
    marginBottom: 8,
  },
  toggleBtn: {
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  toggleBtnText: {
    color: '#6366F1',
    fontWeight: '700',
    fontSize: 13,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
