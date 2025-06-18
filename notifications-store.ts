import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  date: string;
  read: boolean;
  targetRoles?: ('student' | 'teacher' | 'admin')[];
  targetFaculties?: string[];
  targetGroups?: string[];
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  getNotificationsForUser: (userRole: string, userFaculty?: string, userGroup?: string) => Notification[];
}

// Generate sample notifications
const generateNotifications = (): Notification[] => {
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      title: 'Изменение в расписании',
      message: 'Занятие по строительной механике 15 января перенесено с 8:00 на 10:00',
      type: 'warning',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      targetRoles: ['student'],
      targetFaculties: ['fcs'],
      targetGroups: ['ПГС-101', 'ПГС-102']
    },
    {
      id: 'notif_2',
      title: 'Новая консультация',
      message: 'Добавлена консультация по архитектурному проектированию на 18 января в 14:00',
      type: 'info',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      targetRoles: ['student'],
      targetFaculties: ['fad']
    },
    {
      id: 'notif_3',
      title: 'Экзаменационная сессия',
      message: 'Расписание зимней экзаменационной сессии опубликовано. Проверьте даты ваших экзаменов.',
      type: 'success',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      targetRoles: ['student', 'teacher']
    },
    {
      id: 'notif_4',
      title: 'Техническое обслуживание',
      message: 'Система будет недоступна 20 января с 2:00 до 4:00 по причине технического обслуживания',
      type: 'warning',
      date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      targetRoles: ['student', 'teacher', 'admin']
    },
    {
      id: 'notif_5',
      title: 'Новые материалы',
      message: 'Загружены новые методические материалы по курсу "Теплогазоснабжение"',
      type: 'info',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      targetRoles: ['student'],
      targetFaculties: ['fem'],
      targetGroups: ['ТГВ-101', 'ТГВ-102']
    },
    {
      id: 'notif_6',
      title: 'Отмена занятия',
      message: 'Занятие по экономической теории 16 января отменено по болезни преподавателя',
      type: 'error',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      targetRoles: ['student'],
      targetFaculties: ['fep']
    },
    {
      id: 'notif_7',
      title: 'Дополнительная консультация',
      message: 'Назначена дополнительная консультация по железобетонным конструкциям на 19 января',
      type: 'info',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      read: false,
      targetRoles: ['student'],
      targetFaculties: ['fcs']
    }
  ];

  return notifications;
};

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: generateNotifications(),
      unreadCount: 0,

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const newNotification: Notification = {
          ...notification,
          id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },

      markAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },

      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadCount: 0
        }));
      },

      deleteNotification: (id: string) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === id);
          const wasUnread = notification && !notification.read;
          return {
            notifications: state.notifications.filter(notif => notif.id !== id),
            unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
          };
        });
      },

      getNotificationsForUser: (userRole: string, userFaculty?: string, userGroup?: string) => {
        const { notifications } = get();
        return notifications.filter(notification => {
          // Check role targeting
          if (notification.targetRoles && !notification.targetRoles.includes(userRole as any)) {
            return false;
          }
          
          // Check faculty targeting
          if (notification.targetFaculties && userFaculty && !notification.targetFaculties.includes(userFaculty)) {
            return false;
          }
          
          // Check group targeting
          if (notification.targetGroups && userGroup && !notification.targetGroups.includes(userGroup)) {
            return false;
          }
          
          return true;
        });
      },
    }),
    {
      name: 'notifications-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Calculate unread count on app start
          const unreadCount = state.notifications.filter(n => !n.read).length;
          state.unreadCount = unreadCount;
        }
      },
    }
  )
);