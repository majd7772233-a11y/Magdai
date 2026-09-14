/**
 * Study Engine Service
 *
 * Manages flashcards, practice quizzes, and adaptive learning score tracking.
 */

export interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface MasteryTracker {
  topic: string;
  strongCount: number;
  weakCount: number;
  uncertainCount: number;
}

export class StudyEngine {
  private static mockQuizzes: Record<string, QuizQuestion[]> = {
    Java: [
      {
        id: 'java-1',
        topic: 'Java',
        question: 'Which of the following keywords is used to inherit a class in Java?',
        options: ['implements', 'extends', 'inherits', 'super'],
        correctOptionIndex: 1,
        explanation: 'In Java, the "extends" keyword is used by a child class to inherit from a parent class.',
      },
      {
        id: 'java-2',
        topic: 'Java',
        question: 'What is the default value of a boolean primitive variable in Java?',
        options: ['true', 'false', 'null', '0'],
        correctOptionIndex: 1,
        explanation: 'Primitive boolean variables default to "false" in class-level instance or static declarations.',
      },
    ],
    Android: [
      {
        id: 'and-1',
        topic: 'Android',
        question: 'Which component is responsible for presenting UI screens in classic Android development?',
        options: ['Service', 'BroadcastReceiver', 'Activity', 'ContentProvider'],
        correctOptionIndex: 2,
        explanation: 'An Activity provides the window in which the app draws its UI.',
      },
    ],
  };

  /**
   * Retrieves practice questions for a given topic.
   */
  public static getQuizQuestions(topic: string): QuizQuestion[] {
    return this.mockQuizzes[topic] || this.mockQuizzes['Java'];
  }

  /**
   * Evaluates user answer choice.
   */
  public static evaluateAnswer(question: QuizQuestion, selectedIndex: number): { isCorrect: boolean; explanation: string } {
    const isCorrect = selectedIndex === question.correctOptionIndex;
    return {
      isCorrect,
      explanation: question.explanation,
    };
  }
}
