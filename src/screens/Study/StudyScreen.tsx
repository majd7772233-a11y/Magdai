import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard } from '../../components/ui/GlassCard';
import { StudyEngine, QuizQuestion } from '../../services/agent/StudyEngine';

export const StudyScreen: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'Java' | 'Android'>('Java');
  const [questions, setQuestions] = useState<QuizQuestion[]>(StudyEngine.getQuizQuestions('Java'));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [scores, setScores] = useState({ strong: 0, weak: 0, uncertain: 0 });

  const currentQ = questions[currentIndex];

  const handleSelectTopic = (topic: 'Java' | 'Android') => {
    setSelectedTopic(topic);
    setQuestions(StudyEngine.getQuizQuestions(topic));
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleSelectOption = (index: number) => {
    if (showExplanation) return;
    setSelectedOption(index);
    setShowExplanation(true);

    const { isCorrect } = StudyEngine.evaluateAnswer(currentQ, index);
    if (isCorrect) {
      setScores((prev) => ({ ...prev, strong: prev.strong + 1 }));
    } else {
      setScores((prev) => ({ ...prev, weak: prev.weak + 1 }));
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>🎓 Study & Learning Hub</Text>
      <Text style={styles.subtitle}>MAGD AI Adaptive Knowledge Evaluation</Text>

      {/* Topic selection */}
      <View style={styles.topicRow}>
        {(['Java', 'Android'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.topicChip, selectedTopic === t && styles.topicChipActive]}
            onPress={() => handleSelectTopic(t)}
          >
            <Text style={styles.topicText}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Score Tracker */}
      <GlassCard style={styles.scoreCard}>
        <Text style={styles.scoreTitle}>Adaptive Learning Progress</Text>
        <View style={styles.scoreStats}>
          <Text style={styles.statStrong}>Mastered: {scores.strong}</Text>
          <Text style={styles.statWeak}>Needs Review: {scores.weak}</Text>
        </View>
      </GlassCard>

      {/* Question Card */}
      {currentQ && (
        <GlassCard style={styles.card}>
          <Text style={styles.qCounter}>
            Question {currentIndex + 1} of {questions.length}
          </Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>

          {currentQ.options.map((opt, idx) => {
            const isCorrect = showExplanation && idx === currentQ.correctOptionIndex;
            const isWrong = showExplanation && idx === selectedOption && idx !== currentQ.correctOptionIndex;

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.optionButton,
                  isCorrect && styles.correctOption,
                  isWrong && styles.wrongOption,
                ]}
                onPress={() => handleSelectOption(idx)}
                disabled={showExplanation}
              >
                <Text style={styles.optionText}>
                  {String.fromCharCode(65 + idx)}. {opt}
                </Text>
              </TouchableOpacity>
            );
          })}

          {showExplanation && (
            <View style={styles.explanationBox}>
              <Text style={styles.explanationTitle}>Explanation:</Text>
              <Text style={styles.explanationText}>{currentQ.explanation}</Text>

              {currentIndex < questions.length - 1 && (
                <TouchableOpacity style={styles.nextBtn} onPress={handleNextQuestion}>
                  <Text style={styles.nextBtnText}>Next Question ➔</Text>
                </TouchableOpacity>
              )}
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
  topicRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  topicChipActive: {
    backgroundColor: '#00f2fe',
  },
  topicText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  scoreCard: {
    padding: 12,
    marginBottom: 16,
  },
  scoreTitle: {
    color: '#aaa',
    fontSize: 12,
    marginBottom: 6,
  },
  scoreStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statStrong: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  statWeak: {
    color: '#ff5252',
    fontWeight: 'bold',
  },
  card: {
    padding: 16,
  },
  qCounter: {
    color: '#8e8e93',
    fontSize: 12,
    marginBottom: 8,
  },
  questionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 22,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  correctOption: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderColor: '#4caf50',
  },
  wrongOption: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderColor: '#ff5252',
  },
  optionText: {
    color: '#fff',
    fontSize: 14,
  },
  explanationBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: 'rgba(0, 242, 254, 0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 242, 254, 0.3)',
  },
  explanationTitle: {
    color: '#00f2fe',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 4,
  },
  explanationText: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 18,
  },
  nextBtn: {
    marginTop: 12,
    backgroundColor: '#00f2fe',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  nextBtnText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
