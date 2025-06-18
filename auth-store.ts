import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  surname: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  faculty?: string;
  group?: string;
  active: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'active'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

// Mock users data
const mockUsers = [
  {
    id: 'ST001',
    name: 'Иван',
    surname: 'Иванов',
    email: 'student@tgasu.ru',
    password: 'student123',
    role: 'student' as const,
    faculty: 'fcs',
    group: 'ПГС-101',
    active: true,
  },
  {
    id: 'TE001',
    name: 'Петр',
    surname: 'Петров',
    email: 'teacher@tgasu.ru',
    password: 'teacher123',
    role: 'teacher' as const,
    active: true,
  },
  {
    id: 'AD001',
    name: 'Сергей',
    surname: 'Сергеев',
    email: 'admin@tgasu.ru',
    password: 'admin123',
    role: 'admin' as const,
    active: true,
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user && user.active) {
          const { password: _, ...userWithoutPassword } = user;
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true 
          });
          return true;
        }
        
        return false;
      },

      register: async (userData) => {
        // In a real app, this would make an API call
        const newUser: User = {
          id: `${userData.role.toUpperCase()}${Date.now()}`,
          ...userData,
          active: true,
        };
        
        set({ 
          user: newUser, 
          isAuthenticated: true 
        });
        
        return true;
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        });
      },

      updateProfile: (userData) => {
        const currentUser = get().user;
        if (currentUser) {
          set({ 
            user: { ...currentUser, ...userData } 
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);