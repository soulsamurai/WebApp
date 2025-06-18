import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Edit, Trash2, Move } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme-store';
import { ScheduleItem } from '@/stores/schedule-store';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
  editMode?: boolean;
  onDelete?: (id: string) => void;
  onMove?: (id: string) => void;
}

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
const TIME_SLOTS = ['8:00-9:30', '9:40-11:10', '11:20-12:50', '13:40-15:10', '15:20-16:50', '17:00-18:30'];

export function ScheduleTable({ schedule, editMode = false, onDelete, onMove }: ScheduleTableProps) {
  const { theme } = useThemeStore();

  const getScheduleForDayAndTime = (dayIndex: number, timeSlot: string) => {
    return schedule.find(item => item.dayOfWeek === dayIndex && item.time === timeSlot);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lecture': return theme.primary;
      case 'practice': return theme.success;
      case 'lab': return theme.warning;
      default: return theme.textSecondary;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'lecture': return 'Лекция';
      case 'practice': return 'Практика';
      case 'lab': return 'Лабораторная';
      default: return type;
    }
  };

  const handleEdit = (item: ScheduleItem) => {
    Alert.alert('Редактирование', `Редактирование занятия "${item.subject}" будет реализовано`);
  };

  const styles = createStyles(theme);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.timeColumn}>
            <Text style={styles.headerText}>Время</Text>
          </View>
          {DAYS.map((day, index) => (
            <View key={index} style={styles.dayColumn}>
              <Text style={styles.headerText}>{day}</Text>
            </View>
          ))}
        </View>

        {TIME_SLOTS.map((timeSlot, timeIndex) => (
          <View key={timeIndex} style={styles.row}>
            <View style={styles.timeColumn}>
              <Text style={styles.timeText}>{timeSlot}</Text>
            </View>
            {DAYS.map((_, dayIndex) => {
              const scheduleItem = getScheduleForDayAndTime(dayIndex, timeSlot);
              return (
                <View key={dayIndex} style={styles.dayColumn}>
                  {scheduleItem ? (
                    <View style={[styles.scheduleItem, { borderLeftColor: getTypeColor(scheduleItem.type) }]}>
                      <View style={styles.scheduleContent}>
                        <Text style={styles.subjectText} numberOfLines={2}>
                          {scheduleItem.subject}
                        </Text>
                        <Text style={styles.teacherText} numberOfLines={1}>
                          {scheduleItem.teacher}
                        </Text>
                        <Text style={styles.roomText}>
                          {scheduleItem.room} {scheduleItem.building}
                        </Text>
                        <View style={styles.typeContainer}>
                          <Text style={[styles.typeText, { color: getTypeColor(scheduleItem.type) }]}>
                            {getTypeName(scheduleItem.type)}
                          </Text>
                        </View>
                      </View>
                      
                      {editMode && (
                        <View style={styles.editActions}>
                          <TouchableOpacity
                            style={styles.editButton}
                            onPress={() => handleEdit(scheduleItem)}
                          >
                            <Edit size={14} color={theme.primary} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.moveButton}
                            onPress={() => onMove?.(scheduleItem.id)}
                          >
                            <Move size={14} color={theme.warning} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => onDelete?.(scheduleItem.id)}
                          >
                            <Trash2 size={14} color={theme.error} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View style={styles.emptySlot} />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 800,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: theme.primary,
    paddingVertical: 12,
  },
  headerText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  timeColumn: {
    width: 100,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    borderRightWidth: 1,
    borderRightColor: theme.border,
  },
  dayColumn: {
    width: 120,
    minHeight: 80,
    borderRightWidth: 1,
    borderRightColor: theme.border,
    padding: 4,
  },
  timeText: {
    fontSize: 12,
    color: theme.textSecondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  scheduleItem: {
    flex: 1,
    backgroundColor: theme.surface,
    borderRadius: 6,
    padding: 6,
    borderLeftWidth: 3,
    position: 'relative',
  },
  scheduleContent: {
    flex: 1,
  },
  subjectText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
    lineHeight: 14,
  },
  teacherText: {
    fontSize: 10,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  roomText: {
    fontSize: 9,
    color: theme.textSecondary,
    marginBottom: 2,
  },
  typeContainer: {
    alignSelf: 'flex-start',
  },
  typeText: {
    fontSize: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  emptySlot: {
    flex: 1,
    backgroundColor: theme.background,
    borderRadius: 6,
    margin: 2,
  },
  editActions: {
    position: 'absolute',
    top: 2,
    right: 2,
    flexDirection: 'row',
    gap: 2,
  },
  editButton: {
    backgroundColor: theme.background,
    borderRadius: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  moveButton: {
    backgroundColor: theme.background,
    borderRadius: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: theme.warning,
  },
  deleteButton: {
    backgroundColor: theme.background,
    borderRadius: 4,
    padding: 2,
    borderWidth: 1,
    borderColor: theme.error,
  },
});