import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ScheduleItem {
  id: string;
  subject: string;
  teacher: string;
  room: string;
  building: string;
  time: string;
  type: 'lecture' | 'practice' | 'lab';
  faculty: string;
  group: string;
  dayOfWeek: number; // 0-6 (Monday-Sunday)
  weekType: 'even' | 'odd' | 'both';
}

interface ScheduleState {
  scheduleItems: ScheduleItem[];
  currentWeekStart: Date;
  selectedFaculty: string;
  selectedGroup: string;
  setCurrentWeekStart: (date: Date) => void;
  setSelectedFaculty: (faculty: string) => void;
  setSelectedGroup: (group: string) => void;
  getScheduleForWeek: (weekStart: Date, faculty?: string, group?: string) => ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => void;
  deleteScheduleItem: (id: string) => void;
  moveScheduleItem: (id: string, newDay: number, newTime: string) => void;
}

// Generate comprehensive schedule data for all faculties and groups
const generateScheduleData = (): ScheduleItem[] => {
  const subjects = {
    fcs: [
      'Строительная механика',
      'Железобетонные конструкции',
      'Основания и фундаменты',
      'Технология строительного производства',
      'Строительные материалы',
      'Архитектура зданий',
      'Инженерная геодезия',
      'Сопротивление материалов'
    ],
    fad: [
      'Архитектурное проектирование',
      'История архитектуры',
      'Рисунок и живопись',
      'Композиция в архитектуре',
      'Градостроительство',
      'Дизайн интерьера',
      '3D моделирование',
      'Ландшафтная архитектура'
    ],
    fem: [
      'Теплогазоснабжение',
      'Водоснабжение и водоотведение',
      'Вентиляция и кондиционирование',
      'Энергосбережение',
      'Гидравлика',
      'Теплотехника',
      'Автоматизация систем',
      'Экология'
    ],
    fep: [
      'Экономическая теория',
      'Менеджмент',
      'Маркетинг',
      'Финансы и кредит',
      'Гражданское право',
      'Трудовое право',
      'Налоговое право',
      'Бухгалтерский учет'
    ]
  };

  const teachers = [
    'Иванов И.И.',
    'Петров П.П.',
    'Сидоров С.С.',
    'Козлов К.К.',
    'Морозов М.М.',
    'Волков В.В.',
    'Смирнов А.А.',
    'Кузнецов Н.Н.',
    'Попов О.О.',
    'Лебедев Л.Л.'
  ];

  const rooms = ['101', '102', '201', '202', '301', '302', '401', '402', '501', '502'];
  const buildings = ['корп. 1', 'корп. 2', 'корп. 3'];
  const times = ['8:00-9:30', '9:40-11:10', '11:20-12:50', '13:40-15:10', '15:20-16:50', '17:00-18:30'];
  const types: ('lecture' | 'practice' | 'lab')[] = ['lecture', 'practice', 'lab'];
  const weekTypes: ('even' | 'odd' | 'both')[] = ['even', 'odd', 'both'];

  const faculties = ['fcs', 'fad', 'fem', 'fep'];
  const groupsByFaculty = {
    fcs: ['ПГС-101', 'ПГС-102', 'ПГС-201', 'ПГС-202', 'СТР-101', 'СТР-102'],
    fad: ['АРХ-101', 'АРХ-102', 'ДИЗ-101', 'ДИЗ-102', 'ГРД-101', 'ГРД-102'],
    fem: ['ТГВ-101', 'ТГВ-102', 'ВВ-101', 'ВВ-102', 'ЭН-101', 'ЭН-102'],
    fep: ['ЭК-101', 'ЭК-102', 'ЮР-101', 'ЮР-102', 'МЕН-101', 'МЕН-102']
  };

  const scheduleItems: ScheduleItem[] = [];
  let idCounter = 1;

  faculties.forEach(faculty => {
    const facultySubjects = subjects[faculty as keyof typeof subjects];
    const groups = groupsByFaculty[faculty as keyof typeof groupsByFaculty];

    groups.forEach(group => {
      // Generate 3-4 classes per day for each group
      for (let day = 0; day < 6; day++) { // Monday to Saturday
        const classesPerDay = Math.floor(Math.random() * 2) + 3; // 3-4 classes
        
        for (let classIndex = 0; classIndex < classesPerDay; classIndex++) {
          const subject = facultySubjects[Math.floor(Math.random() * facultySubjects.length)];
          const teacher = teachers[Math.floor(Math.random() * teachers.length)];
          const room = rooms[Math.floor(Math.random() * rooms.length)];
          const building = buildings[Math.floor(Math.random() * buildings.length)];
          const time = times[classIndex] || times[Math.floor(Math.random() * times.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const weekType = weekTypes[Math.floor(Math.random() * weekTypes.length)];

          scheduleItems.push({
            id: `schedule_${idCounter++}`,
            subject,
            teacher,
            room,
            building,
            time,
            type,
            faculty,
            group,
            dayOfWeek: day,
            weekType
          });
        }
      }
    });
  });

  return scheduleItems;
};

const getMonday = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      scheduleItems: generateScheduleData(),
      currentWeekStart: getMonday(new Date()),
      selectedFaculty: 'fcs',
      selectedGroup: 'ПГС-101',

      setCurrentWeekStart: (date: Date) => {
        set({ currentWeekStart: getMonday(date) });
      },

      setSelectedFaculty: (faculty: string) => {
        set({ selectedFaculty: faculty });
      },

      setSelectedGroup: (group: string) => {
        set({ selectedGroup: group });
      },

      getScheduleForWeek: (weekStart: Date, faculty?: string, group?: string) => {
        const { scheduleItems } = get();
        const targetFaculty = faculty || get().selectedFaculty;
        const targetGroup = group || get().selectedGroup;
        
        // Calculate week number to determine if it's even or odd
        const weekNumber = Math.ceil((weekStart.getTime() - new Date(2024, 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
        const isEvenWeek = weekNumber % 2 === 0;
        
        return scheduleItems.filter(item => {
          const facultyMatch = item.faculty === targetFaculty;
          const groupMatch = item.group === targetGroup;
          const weekMatch = item.weekType === 'both' || 
                           (item.weekType === 'even' && isEvenWeek) ||
                           (item.weekType === 'odd' && !isEvenWeek);
          
          return facultyMatch && groupMatch && weekMatch;
        });
      },

      addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => {
        const newItem: ScheduleItem = {
          ...item,
          id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set(state => ({
          scheduleItems: [...state.scheduleItems, newItem]
        }));
      },

      updateScheduleItem: (id: string, updates: Partial<ScheduleItem>) => {
        set(state => ({
          scheduleItems: state.scheduleItems.map(item =>
            item.id === id ? { ...item, ...updates } : item
          )
        }));
      },

      deleteScheduleItem: (id: string) => {
        set(state => ({
          scheduleItems: state.scheduleItems.filter(item => item.id !== id)
        }));
      },

      moveScheduleItem: (id: string, newDay: number, newTime: string) => {
        set(state => ({
          scheduleItems: state.scheduleItems.map(item =>
            item.id === id ? { ...item, dayOfWeek: newDay, time: newTime } : item
          )
        }));
      },
    }),
    {
      name: 'schedule-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        scheduleItems: state.scheduleItems,
        selectedFaculty: state.selectedFaculty,
        selectedGroup: state.selectedGroup,
      }),
    }
  )
);