import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X, Mail, Lock, Shield, Eye, EyeOff, Moon, Sun } from 'lucide-react-native';
import { useAuthStore, User } from '@/stores/auth-store';
import { useThemeStore } from '@/stores/theme-store';

interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  user: User;
}

export function EditProfileModal({ visible, onClose, user }: EditProfileModalProps) {
  const { updateProfile } = useAuthStore();
  const { isDark, theme, toggleTheme } = useThemeStore();
  
  const [formData, setFormData] = useState({
    name: user.name,
    surname: user.surname,
    email: user.email,
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [otpData, setOtpData] = useState({
    secret: '',
    enabled: false,
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleSubmit = () => {
    updateProfile(formData);
    Alert.alert('Успех', 'Профиль успешно обновлен');
    onClose();
  };

  const handlePasswordReset = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      Alert.alert('Ошибка', 'Заполните все поля пароля');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Ошибка', 'Новые пароли не совпадают');
      return;
    }
    Alert.alert('Успех', 'Пароль успешно изменен');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setExpandedSection(null);
  };

  const generateOTPSecret = () => {
    const secret = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setOtpData({ ...otpData, secret });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const styles = createStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Редактировать профиль</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          {/* Basic Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Основная информация</Text>
            
            <View style={styles.field}>
              <Text style={styles.label}>Имя</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Введите имя"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Фамилия</Text>
              <TextInput
                style={styles.input}
                value={formData.surname}
                onChangeText={(text) => setFormData({ ...formData, surname: text })}
                placeholder="Введите фамилию"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          {/* Theme Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('theme')}
            >
              <View style={styles.expandableHeaderContent}>
                {isDark ? <Moon size={20} color={theme.primary} /> : <Sun size={20} color={theme.primary} />}
                <Text style={styles.expandableTitle}>Тема приложения</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSection === 'theme' ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedSection === 'theme' && (
              <View style={styles.expandedContent}>
                <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                  <View style={styles.themeOption}>
                    {isDark ? <Moon size={24} color={theme.primary} /> : <Sun size={24} color={theme.primary} />}
                    <Text style={styles.themeText}>
                      {isDark ? 'Темная тема' : 'Светлая тема'}
                    </Text>
                  </View>
                  <View style={[styles.toggle, isDark && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, isDark && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Email Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('email')}
            >
              <View style={styles.expandableHeaderContent}>
                <Mail size={20} color={theme.primary} />
                <Text style={styles.expandableTitle}>Изменить Email</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSection === 'email' ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedSection === 'email' && (
              <View style={styles.expandedContent}>
                <View style={styles.field}>
                  <Text style={styles.label}>Текущий Email</Text>
                  <TextInput
                    style={[styles.input, styles.disabledInput]}
                    value={user.email}
                    editable={false}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Новый Email</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Введите новый email"
                    placeholderTextColor={theme.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => Alert.alert('Успех', 'Email успешно изменен')}
                >
                  <Text style={styles.actionButtonText}>Подтвердить изменение</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Password Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('password')}
            >
              <View style={styles.expandableHeaderContent}>
                <Lock size={20} color={theme.primary} />
                <Text style={styles.expandableTitle}>Сменить пароль</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSection === 'password' ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedSection === 'password' && (
              <View style={styles.expandedContent}>
                <View style={styles.field}>
                  <Text style={styles.label}>Текущий пароль</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.currentPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, currentPassword: text })}
                      placeholder="Введите текущий пароль"
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry={!showPasswords.current}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    >
                      {showPasswords.current ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.field}>
                  <Text style={styles.label}>Новый пароль</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.newPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, newPassword: text })}
                      placeholder="Введите новый пароль"
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry={!showPasswords.new}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    >
                      {showPasswords.new ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.field}>
                  <Text style={styles.label}>Подтвердите новый пароль</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      value={passwordData.confirmPassword}
                      onChangeText={(text) => setPasswordData({ ...passwordData, confirmPassword: text })}
                      placeholder="Подтвердите новый пароль"
                      placeholderTextColor={theme.textSecondary}
                      secureTextEntry={!showPasswords.confirm}
                    />
                    <TouchableOpacity 
                      style={styles.eyeButton}
                      onPress={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    >
                      {showPasswords.confirm ? <EyeOff size={20} color={theme.textSecondary} /> : <Eye size={20} color={theme.textSecondary} />}
                    </TouchableOpacity>
                  </View>
                </View>
                
                <TouchableOpacity style={styles.actionButton} onPress={handlePasswordReset}>
                  <Text style={styles.actionButtonText}>Изменить пароль</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* OTP Section */}
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.expandableHeader}
              onPress={() => toggleSection('otp')}
            >
              <View style={styles.expandableHeaderContent}>
                <Shield size={20} color={theme.primary} />
                <Text style={styles.expandableTitle}>Двухфакторная аутентификация</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSection === 'otp' ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            
            {expandedSection === 'otp' && (
              <View style={styles.expandedContent}>
                <Text style={styles.description}>
                  Настройте двухфакторную аутентификацию для повышения безопасности вашего аккаунта
                </Text>
                
                {!otpData.secret ? (
                  <TouchableOpacity style={styles.actionButton} onPress={generateOTPSecret}>
                    <Text style={styles.actionButtonText}>Настроить 2FA</Text>
                  </TouchableOpacity>
                ) : (
                  <View>
                    <View style={styles.field}>
                      <Text style={styles.label}>Секретный ключ</Text>
                      <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={otpData.secret}
                        editable={false}
                      />
                    </View>
                    <Text style={styles.description}>
                      Отсканируйте QR-код в приложении аутентификатора или введите ключ вручную
                    </Text>
                    <View style={styles.buttonRow}>
                      <TouchableOpacity 
                        style={[styles.actionButton, styles.secondaryButton]}
                        onPress={() => {
                          setOtpData({ secret: '', enabled: false });
                          Alert.alert('Успех', '2FA отключена');
                        }}
                      >
                        <Text style={styles.secondaryButtonText}>Отключить 2FA</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => {
                          setOtpData({ ...otpData, enabled: true });
                          Alert.alert('Успех', '2FA успешно настроена');
                        }}
                      >
                        <Text style={styles.actionButtonText}>Подтвердить</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Сохранить</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  closeButton: {
    padding: 4,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: theme.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    padding: 16,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: theme.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  expandableHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expandableTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
  },
  expandIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.primary,
  },
  expandedContent: {
    padding: 16,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: theme.surface,
    color: theme.text,
  },
  disabledInput: {
    backgroundColor: theme.background,
    color: theme.textSecondary,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.surface,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: theme.text,
  },
  eyeButton: {
    padding: 12,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    backgroundColor: theme.error,
    flex: 1,
    marginRight: 8,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  themeToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeText: {
    fontSize: 16,
    color: theme.text,
    fontWeight: '500',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: theme.primary,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: theme.surface,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.background,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textSecondary,
  },
  submitButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.primary,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});