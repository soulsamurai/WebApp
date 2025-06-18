import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, MapPin, Users, Edit, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme-store';
import { useAuthStore } from '@/stores/auth-store';
import { useConsultationsStore, Consultation } from '@/stores/consultations-store';

interface ConsultationCardProps {
  consultation: Consultation;
  canEdit?: boolean;
}

export function ConsultationCard({ consultation, canEdit = false }: ConsultationCardProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { deleteConsultation, registerForConsultation, unregisterFromConsultation } = useConsultationsStore();

  const isRegistered = user ? consultation.registeredStudents.includes(user.id) : false;
  const isFull = consultation.registeredStudents.length >= consultation.maxStudents;
  const canRegister = user?.role === 'student' && !isRegistered && !isFull;
  const canUnregister = user?.role === 'student' && isRegistered;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleRegister = () => {
    if (user) {
      registerForConsultation(consultation.id, user.id);
      Alert.alert('Успех', 'Вы записались на консультацию');
    }
  };

  const handleUnregister = () => {
    if (user) {
      unregisterFromConsultation(consultation.id, user.id);
      Alert.alert('Успех', 'Вы отменили запись на консультацию');
    }
  };

  const handleEdit = () => {
    Alert.alert('Редактирование', 'Функция редактирования консультации будет реализована');
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление консультации',
      'Вы уверены, что хотите удалить эту консультацию?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteConsultation(consultation.id);
            Alert.alert('Успех', 'Консультация удалена');
          }
        }
      ]
    );
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.subject}>{consultation.subject}</Text>
        {canEdit && (
          <View style={styles.actions}>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Edit size={16} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Trash2 size={16} color={theme.error} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.teacher}>{consultation.teacher}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>{formatDate(consultation.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>{consultation.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>
            {consultation.room} {consultation.building}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Users size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>
            {consultation.registeredStudents.length}/{consultation.maxStudents} мест
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{consultation.description}</Text>

      <View style={styles.groupsContainer}>
        <Text style={styles.groupsLabel}>Группы:</Text>
        <Text style={styles.groupsText}>{consultation.groups.join(', ')}</Text>
      </View>

      {user?.role === 'student' && (
        <View style={styles.registrationContainer}>
          {canRegister && (
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Записаться</Text>
            </TouchableOpacity>
          )}
          
          {canUnregister && (
            <TouchableOpacity style={styles.unregisterButton} onPress={handleUnregister}>
              <Text style={styles.unregisterButtonText}>Отменить запись</Text>
            </TouchableOpacity>
          )}
          
          {isFull && !isRegistered && (
            <View style={styles.fullContainer}>
              <Text style={styles.fullText}>Нет свободных мест</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  subject: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    flex: 1,
    marginRight: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.error,
  },
  teacher: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.textSecondary,
    marginBottom: 12,
  },
  details: {
    marginBottom: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: theme.text,
  },
  description: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  groupsLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.text,
  },
  groupsText: {
    fontSize: 14,
    color: theme.textSecondary,
    flex: 1,
  },
  registrationContainer: {
    marginTop: 8,
  },
  registerButton: {
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  unregisterButton: {
    backgroundColor: theme.error,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  unregisterButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  fullContainer: {
    backgroundColor: theme.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  fullText: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});