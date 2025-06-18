import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, ChevronRight, Filter, Edit, Trash2, Move } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useScheduleStore } from "@/stores/schedule-store";
import { useThemeStore } from "@/stores/theme-store";
import { ScheduleTable } from "@/components/ScheduleTable";
import { FacultyGroupSelector } from "@/components/FacultyGroupSelector";

export default function ScheduleScreen() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { 
    currentWeekStart, 
    selectedFaculty, 
    selectedGroup,
    setCurrentWeekStart,
    setSelectedFaculty,
    setSelectedGroup,
    getScheduleForWeek,
    deleteScheduleItem,
    moveScheduleItem
  } = useScheduleStore();

  const [showFilters, setShowFilters] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeekStart);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeekStart(newDate);
  };

  const formatWeekRange = (startDate: Date) => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { 
      day: 'numeric', 
      month: 'long' 
    };
    
    return `${startDate.toLocaleDateString('ru-RU', options)} - ${endDate.toLocaleDateString('ru-RU', options)}`;
  };

  const isEvenWeek = () => {
    const weekNumber = Math.ceil((currentWeekStart.getTime() - new Date(2024, 8, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return weekNumber % 2 === 0;
  };

  const handleDeleteScheduleItem = (id: string) => {
    Alert.alert(
      'Удаление занятия',
      'Вы уверены, что хотите удалить это занятие?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            deleteScheduleItem(id);
            Alert.alert('Успех', 'Занятие удалено');
          }
        }
      ]
    );
  };

  const handleMoveScheduleItem = (id: string) => {
    Alert.alert('Перенос занятия', 'Функция переноса занятия будет реализована');
  };

  const schedule = getScheduleForWeek(currentWeekStart, selectedFaculty, selectedGroup);

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Расписание занятий</Text>
          <View style={styles.headerActions}>
            {isStudent && (
              <TouchableOpacity 
                style={styles.filterButton}
                onPress={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} color={theme.primary} />
              </TouchableOpacity>
            )}
            {isTeacher && (
              <TouchableOpacity 
                style={[styles.editButton, editMode && styles.editButtonActive]}
                onPress={() => setEditMode(!editMode)}
              >
                <Edit size={20} color={editMode ? 'white' : theme.primary} />
                <Text style={[styles.editButtonText, editMode && styles.editButtonTextActive]}>
                  {editMode ? 'Готово' : 'Редактировать'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {isStudent && showFilters && (
          <FacultyGroupSelector
            selectedFaculty={selectedFaculty}
            selectedGroup={selectedGroup}
            onFacultyChange={setSelectedFaculty}
            onGroupChange={setSelectedGroup}
          />
        )}

        <View style={styles.weekNavigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('prev')}
          >
            <ChevronLeft size={20} color={theme.primary} />
          </TouchableOpacity>
          
          <View style={styles.weekInfo}>
            <Text style={styles.weekText}>{formatWeekRange(currentWeekStart)}</Text>
            <Text style={styles.weekType}>
              {isEvenWeek() ? 'Четная неделя' : 'Нечетная неделя'}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigateWeek('next')}
          >
            <ChevronRight size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <ScheduleTable 
          schedule={schedule} 
          editMode={editMode && isTeacher}
          onDelete={handleDeleteScheduleItem}
          onMove={handleMoveScheduleItem}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
    gap: 6,
  },
  editButtonActive: {
    backgroundColor: theme.primary,
  },
  editButtonText: {
    color: theme.primary,
    fontWeight: '500',
    fontSize: 14,
  },
  editButtonTextActive: {
    color: 'white',
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.background,
  },
  weekInfo: {
    alignItems: 'center',
  },
  weekText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
  },
  weekType: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
  },
});