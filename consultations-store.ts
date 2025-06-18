import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Consultation {
  id: string;
  subject: string;
  teacher: string;
  date: string;
  time: string;
  room: string;
  building: string;
  description: string;
  maxStudents: number;
  registeredStudents: string[];
  faculty: string;
  groups: string[];
}

interface ConsultationsState {
  consultations: Consultation[];
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  deleteConsultation: (id: string) => void;
  registerForConsultation: (consultationId: string, studentId: string) => void;
  unregisterFromConsultation: (consultationId: string, studentId: string) => void;
}

// Generate sample consultations
const generateConsultations = (): Consultation[] => {
  const subjects = [
    'Строительная механика',
    'Железобетонные конструкции',
    'Архитектурное проектирование',
    'Теплогазоснабжение',
    'Экономическая теория',
    'Основания и фундаменты',
    'История архитектуры',
    'Водоснабжение и водоотведение'
  ];

  const teachers = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Козлов К.К.',
    'Морозов М.М.'
  ];

  const rooms = ['101', '102', '201', '202', '301'];
  const buildings = ['корп. 1', 'корп. 2', 'корп. 3'];
  const faculties = ['fcs', 'fad', 'fem', 'fep'];
  const groupsByFaculty = {
    fcs: ['ПГС-101', 'ПГС-102', 'СТР-101'],
    fad: ['АРХ-101', 'ДИЗ-101', 'ГРД-101'],
    fem: ['ТГВ-101', 'ВВ-101', 'ЭН-101'],
    fep: ['ЭК-101', 'ЮР-101', 'МЕН-101']
  };

  const consultations: Consultation[] = [];
  
  for (let i = 0; i < 8; i++) {
    const faculty = faculties[Math.floor(Math.random() * faculties.length)];
    const groups = groupsByFaculty[faculty as keyof typeof groupsByFaculty];
    const selectedGroups = groups.slice(0, Math.floor(Math.random() * groups.length) + 1);
    
    const date = new Date();
    date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
    
    consultations.push({
      id: `consultation_${i + 1}`,
      subject: subjects[Math.floor(Math.random() * subjects.length)],
      teacher: teachers[Math.floor(Math.random() * teachers.length)],
      date: date.toISOString().split('T')[0],
      time: ['14:00-15:30', '15:40-17:10', '17:20-18:50'][Math.floor(Math.random() * 3)],
      room: rooms[Math.floor(Math.random() * rooms.length)],
      building: buildings[Math.floor(Math.random() * buildings.length)],
      description: `Консультация по предмету "${subjects[Math.floor(Math.random() * subjects.length)]}". Разбор сложных тем и подготовка к экзамену.`,
      maxStudents: Math.floor(Math.random() * 20) + 10,
      registeredStudents: [],
      faculty,
      groups: selectedGroups
    });
  }

  return consultations;
};

export const useConsultationsStore = create<ConsultationsState>()(
  persist(
    (set, get) => ({
      consultations: generateConsultations(),

      addConsultation: (consultation: Omit<Consultation, 'id'>) => {
        const newConsultation: Consultation = {
          ...consultation,
          id: `consultation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set(state => ({
          consultations: [...state.consultations, newConsultation]
        }));
      },

      updateConsultation: (id: string, updates: Partial<Consultation>) => {
        set(state => ({
          consultations: state.consultations.map(consultation =>
            consultation.id === id ? { ...consultation, ...updates } : consultation
          )
        }));
      },

      deleteConsultation: (id: string) => {
        set(state => ({
          consultations: state.consultations.filter(consultation => consultation.id !== id)
        }));
      },

      registerForConsultation: (consultationId: string, studentId: string) => {
        set(state => ({
          consultations: state.consultations.map(consultation =>
            consultation.id === consultationId
              ? {
                  ...consultation,
                  registeredStudents: [...consultation.registeredStudents, studentId]
                }
              : consultation
          )
        }));
      },

      unregisterFromConsultation: (consultationId: string, studentId: string) => {
        set(state => ({
          consultations: state.consultations.map(consultation =>
            consultation.id === consultationId
              ? {
                  ...consultation,
                  registeredStudents: consultation.registeredStudents.filter(id => id !== studentId)
                }
              : consultation
          )
        }));
      },
    }),
    {
      name: 'consultations-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);