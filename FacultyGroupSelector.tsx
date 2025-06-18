import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemeStore } from '@/stores/theme-store';

interface FacultyGroupSelectorProps {
  selectedFaculty: string;
  selectedGroup: string;
  onFacultyChange: (faculty: string) => void;
  onGroupChange: (group: string) => void;
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

export function FacultyGroupSelector({
  selectedFaculty,
  selectedGroup,
  onFacultyChange,
  onGroupChange,
}: FacultyGroupSelectorProps) {
  const { theme } = useThemeStore();

  const handleFacultyChange = (faculty: string) => {
    onFacultyChange(faculty);
    // Auto-select first group of the new faculty
    const firstGroup = GROUPS_BY_FACULTY[faculty as keyof typeof GROUPS_BY_FACULTY][0];
    onGroupChange(firstGroup);
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Факультет:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedFaculty}
            onValueChange={handleFacultyChange}
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

      <View style={styles.selectorContainer}>
        <Text style={styles.label}>Группа:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedGroup}
            onValueChange={onGroupChange}
            style={styles.picker}
          >
            {GROUPS_BY_FACULTY[selectedFaculty as keyof typeof GROUPS_BY_FACULTY].map((group) => (
              <Picker.Item
                key={group}
                label={group}
                value={group}
              />
            ))}
          </Picker>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectorContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: theme.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  picker: {
    color: theme.text,
  },
});