import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exam {
  id: string;
  subject: string;
  teacher: string;
  date: string;
  time: string;
  room: string;
  building: string;
  type: 'exam' | 'credit' | 'differential_credit';
  duration: number; // in minutes
  faculty: string;
  groups: string[];
  description: string;
}

interface ExamsState {
  exams: Exam[];
  addExam: (exam: Omit<Exam, 'id'>) => void;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
}

// Generate sample exams
const generateExams = (): Exam[] => {
  const subjects = [
    'Строительная механика',
    'Железобетонные конструкции',
    'Архитектурное проектирование',
    'Теплогазоснабжение',
    'Экономическая теория',
    'Основания и фундаменты',
    'История архитектуры',
    'Водоснабжение и водоотведение',
    'Сопротивление материалов',
    'Технология строительного производства'
  ];

  const teachers = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Козлов К.К.',
    'Морозов М.М.',
    'Волков В.В.'
  ];

  const rooms = ['101', '102', '201', '202', '301', '302'];
  const buildings = ['корп. 1', 'корп. 2', 'корп. 3'];
  const faculties = ['fcs', 'fad', 'fem', 'fep'];
  const examTypes: ('exam' | 'credit' | 'differential_credit')[] = ['exam', 'credit', 'differential_credit'];
  
  const groupsByFaculty = {
    fcs: ['ПГС-101', 'ПГС-102', 'СТР-101', 'СТР-102'],
    fad: ['АРХ-101', 'ДИЗ-101', 'ГРД-101', 'ГРД-102'],
    fem: ['ТГВ-101', 'ВВ-101', 'ЭН-101', 'ЭН-102'],
    fep: ['ЭК-101', 'ЮР-101', 'МЕН-101', 'МЕН-102']
  };

  const exams: Exam[] = [];
  
  for (let i = 0; i < 12; i++) {
    const faculty = faculties[Math.floor(Math.random() * faculties.length)];
    const groups = groupsByFaculty[faculty as keyof typeof groupsByFaculty];
    const selectedGroups = groups.slice(0, Math.floor(Math.random() * 2) + 1);
    const examType = examTypes[Math.floor(Math.random() * examTypes.length)];
    
    // Generate exam dates in the future (exam session)
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 7);
    
    const getExamTypeName = (type: string) => {
      switch (type) {
        case 'exam': return 'Экзамен';
        case 'credit': return 'Зачет';
        case 'differential_credit': return 'Дифференцированный зачет';
        default: return 'Экзамен';
      }
    };

    exams.push({
      id: `exam_${i + 1}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      teacher: teachers[Math.floor(Math.random() * teachers.length)],
      date: date.toISOString().split('T')[0],
      time: ['9:00-12:00', '14:00-17:00', '9:00-11:00', '14:00-16:00'][Math.floor(Math.random() * 4)],
      room: rooms[Math.floor(Math.random() * rooms.length)],
      building: buildings[Math.floor(Math.random() * buildings.length)],
      type: examType,
      duration: examType === 'exam' ? 180 : 120,
      faculty,
      groups: selectedGroups,
      description: `${getExamTypeName(examType)} по предмету "${subjects[Math.floor(Math.random() * subjects.length)]}". Необходимо иметь при себе студенческий билет и зачетную книжку.`
    });
  }

  return exams;
};

export const useExamsStore = create<ExamsState>()(
  persist(
    (set, get) => ({
      exams: generateExams(),

      addExam: (exam: Omit<Exam, 'id'>) => {
        const newExam: Exam = {
          ...exam,
          id: `exam_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set(state => ({
          exams: [...state.exams, newExam]
        }));
      },

      updateExam: (id: string, updates: Partial<Exam>) => {
        set(state => ({
          exams: state.exams.map(exam =>
            exam.id === id ? { ...exam, ...updates } : exam
          )
        }));
      },

      deleteExam: (id: string) => {
        set(state => ({
          exams: state.exams.filter(exam => exam.id !== id)
        }));
      },
    }),
    {
      name: 'exams-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);