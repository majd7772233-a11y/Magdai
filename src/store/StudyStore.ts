import {makeAutoObservable} from 'mobx';
import {v4 as uuidv4} from 'uuid';

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  level: 'strong' | 'weak' | 'uncertain';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

class StudyStore {
  flashcards: Flashcard[] = [
    {
      id: 'fc-1',
      question: 'ما هو الفارق بين Val و Var في لغة Kotlin؟',
      answer: 'val هي متغيرات غير قابلة لتعديل القيمة (Read-only)، بينما var متغيرة وقابلة للتعديل.',
      level: 'strong',
    },
    {
      id: 'fc-2',
      question: 'ما هو قانون أوم (Ohm’s Law)؟',
      answer: 'V = I × R (الجهد = التيار × المقاومة)',
      level: 'strong',
    },
  ];

  sampleQuiz: QuizQuestion[] = [
    {
      id: 'q-1',
      question: 'أي من الكلمات التالية تستخدم لتعريف دالة في Kotlin؟',
      options: ['function', 'def', 'fun', 'void'],
      correctIndex: 2,
      explanation: 'تستخدم الكلمة المفتاحية fun لتعريف الدوال في Kotlin.',
    },
    {
      id: 'q-2',
      question: 'ما هي وحدة قياس المقاومة الكهربائية؟',
      options: ['فولت (Volt)', 'أمبير (Ampere)', 'أوم (Ohm)', 'وات (Watt)'],
      correctIndex: 2,
      explanation: 'المقاومة تقاس بوحدة الأوم (Ohm - Ω).',
    },
  ];

  currentQuizIndex: number = 0;
  score: number = 0;
  quizCompleted: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  answerQuestion(selectedIndex: number) {
    if (this.currentQuizIndex < this.sampleQuiz.length) {
      if (selectedIndex === this.sampleQuiz[this.currentQuizIndex].correctIndex) {
        this.score += 1;
      }
      if (this.currentQuizIndex + 1 < this.sampleQuiz.length) {
        this.currentQuizIndex += 1;
      } else {
        this.quizCompleted = true;
      }
    }
  }

  resetQuiz() {
    this.currentQuizIndex = 0;
    this.score = 0;
    this.quizCompleted = false;
  }

  addFlashcard(question: string, answer: string) {
    this.flashcards.push({
      id: uuidv4(),
      question,
      answer,
      level: 'uncertain',
    });
  }

  updateCardLevel(id: string, level: 'strong' | 'weak' | 'uncertain') {
    const card = this.flashcards.find(f => f.id === id);
    if (card) card.level = level;
  }
}

export const studyStore = new StudyStore();
