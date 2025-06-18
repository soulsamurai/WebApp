import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Calendar, Clock, MapPin, Timer, Edit, Trash2 } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme-store';
import { useExamsStore, Exam } from '@/stores/exams-store';

interface ExamCardProps {
  exam: Exam;
  canEdit?: boolean;
}

export function ExamCard({ exam, canEdit = false }: ExamCardProps) {
  const { theme } = useThemeStore();
  const { deleteExam } = useExamsStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getExamTypeName = (type: string) => {
    switch (type) {
      case 'exam': return 'Экзамен';
      case 'credit': return 'Зачет';
      case 'differential_credit': return 'Дифференцированный зачет';
      default: return 'Экзамен';
    }
  };

  const getExamTypeColor = (type: string) => {
    switch (type) {
      case 'exam': return theme.error;
      case 'credit': return theme.success;
      case 'differential_credit': return theme.warning;
      default: return theme.primary;
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
      return `${hours}ч ${mins}мин`;
    } else if (hours > 0) {
      return `${hours}ч`;
    } else {
      return `${mins}мин`;
    }
  };

  const handleEdit = () => {
    Alert.alert('Редактирование', 'Функция редактирования экзамена будет реализована');
  };

  const handleDelete = () => {
    Alert.alert(
      'Удаление экзамена',
      'Вы уверены, что хотите удалить этот экзамен?',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => {
            deleteExam(exam.id);
            Alert.alert('Успех', 'Экзамен удален');
          }
        }
      ]
    );
  };

  const styles = createStyles(theme, getExamTypeColor(exam.type));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.subject}>{exam.subject}</Text>
          <View style={[styles.typeBadge, { backgroundColor: getExamTypeColor(exam.type) }]}>
            <Text style={styles.typeText}>{getExamTypeName(exam.type)}</Text>
          </View>
        </View>
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

      <Text style={styles.teacher}>{exam.teacher}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>{formatDate(exam.date)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Clock size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>{exam.time}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <MapPin size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>
            {exam.room} {exam.building}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Timer size={16} color={theme.textSecondary} />
          <Text style={styles.detailText}>
            Продолжительность: {formatDuration(exam.duration)}
          </Text>
        </View>
      </View>

      <Text style={styles.description}>{exam.description}</Text>

      <View style={styles.groupsContainer}>
        <Text style={styles.groupsLabel}>Группы:</Text>
        <Text style={styles.groupsText}>{exam.groups.join(', ')}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: any, borderColor: string) => StyleSheet.create({
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
    borderLeftColor: borderColor,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  subject: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
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
});