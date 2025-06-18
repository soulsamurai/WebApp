import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Mail, Lock, User, UserPlus, GraduationCap } from 'lucide-react-native';
import { useAuthStore } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';
import { Picker } from '@react-native-picker/picker';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

const FACULTIES = [
  { id: 'fcs', name: 'Факультет строительства' },
  { id: 'fad', name: 'Факультет архитектуры и дизайна' },
  { id: 'fem', name: 'Факультет инженерных систем' },
  { id: 'fep', name: 'Факультет экономики и права' },
];

const GROUPS_BY_FACULTY = {
  fcs: ['ПГС-101', 'ПГС-102', 'ПГС-201', 'ПГС-202', 'СТР-101', 'СТР-102'],
  fad: ['АРХ-101', 'АРХ-102', 'ДИЗ-101', 'ДИЗ-102', 'ГРД-101', 'ГРД-102'],
  fem: ['ТГВ-101', 'ТГВ-102', 'ВВ-101', 'ВВ-102', 'ЭН-101', 'ЭН-102'],
  fep: ['ЭК-101', 'ЭК-102', 'ЮР-101', 'ЮР-102', 'МЕН-101', 'МЕН-102'],
};

export function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const { register } = useAuthStore();
  const { theme } = useThemeStore();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    faculty: 'fcs',
    group: 'ПГС-101',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!formData.name.trim() || !formData.surname.trim() || !formData.email.trim() || !formData.password.trim()) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Ошибка', 'Пароль должен содержать минимум 6 символов');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
        role: formData.role,
        password: formData.password,
        ...(formData.role === 'student' && {
          faculty: formData.faculty,
          group: formData.group,
        }),
      };

      const success = await register(userData);
      if (success) {
        Alert.alert('Успех', 'Регистрация прошла успешно!');
      } else {
        Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
      }
    } catch (error) {
      Alert.alert('Ошибка', 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Регистрация</Text>
              <Text style={styles.subtitle}>Создайте аккаунт в системе ТГАСУ</Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputContainer}>
                <User size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Имя"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <User size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Фамилия"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.surname}
                  onChangeText={(text) => setFormData({ ...formData, surname: text })}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Mail size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Роль:</Text>
                <View style={styles.roleButtons}>
                  <TouchableOpacity
                    style={[styles.roleButton, formData.role === 'student' && styles.roleButtonActive]}
                    onPress={() => setFormData({ ...formData, role: 'student' })}
                  >
                    <GraduationCap size={16} color={formData.role === 'student' ? 'white' : theme.primary} />
                    <Text style={[styles.roleButtonText, formData.role === 'student' && styles.roleButtonTextActive]}>
                      Студент
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.roleButton, formData.role === 'teacher' && styles.roleButtonActive]}
                    onPress={() => setFormData({ ...formData, role: 'teacher' })}
                  >
                    <User size={16} color={formData.role === 'teacher' ? 'white' : theme.primary} />
                    <Text style={[styles.roleButtonText, formData.role === 'teacher' && styles.roleButtonTextActive]}>
                      Преподаватель
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {formData.role === 'student' && (
                <>
                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Факультет:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={formData.faculty}
                        onValueChange={(value) => {
                          const firstGroup = GROUPS_BY_FACULTY[value as keyof typeof GROUPS_BY_FACULTY][0];
                          setFormData({ ...formData, faculty: value, group: firstGroup });
                        }}
                        style={styles.picker}
                      >
                        {FACULTIES.map((faculty) => (
                          <Picker.Item
                            key={faculty.id}
                            label={faculty.name}
                            value={faculty.id}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>

                  <View style={styles.pickerContainer}>
                    <Text style={styles.pickerLabel}>Группа:</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={formData.group}
                        onValueChange={(value) => setFormData({ ...formData, group: value })}
                        style={styles.picker}
                      >
                        {GROUPS_BY_FACULTY[formData.faculty as keyof typeof GROUPS_BY_FACULTY].map((group) => (
                          <Picker.Item
                            key={group}
                            label={group}
                            value={group}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </>
              )}

              <View style={styles.inputContainer}>
                <Lock size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Пароль"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.password}
                  onChangeText={(text) => setFormData({ ...formData, password: text })}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Lock size={20} color={theme.textSecondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Подтвердите пароль"
                  placeholderTextColor={theme.textSecondary}
                  value={formData.confirmPassword}
                  onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.textSecondary} />
                  ) : (
                    <Eye size={20} color={theme.textSecondary} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
              >
                <UserPlus size={20} color="white" />
                <Text style={styles.registerButtonText}>
                  {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={onSwitchToLogin}
              >
                <Text style={styles.loginLinkText}>
                  Уже есть аккаунт? Войти
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: theme.text,
  },
  eyeButton: {
    padding: 4,
  },
  roleContainer: {
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.primary,
    gap: 8,
  },
  roleButtonActive: {
    backgroundColor: theme.primary,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.primary,
  },
  roleButtonTextActive: {
    color: 'white',
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  picker: {
    color: theme.text,
  },
  registerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  loginLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  loginLinkText: {
    color: theme.primary,
    fontSize: 16,
    fontWeight: '500',
  },
});