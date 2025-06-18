import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { X, Plus } from 'lucide-react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemeStore } from '@/stores/theme-store';
import { useExamsStore } from '@/stores/exams-store';

interface AddExamModalProps {
  visible: boolean;
  onClose: () => void;
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

const EXAM_TYPES = [
  { id: 'exam', name: 'Экзамен' },
  { id: 'credit', name: 'Зачет' },
  { id: 'differential_credit', name: 'Дифференцированный зачет' },
];

export function AddExamModal({ visible, onClose }: AddExamModalProps) {
  const { theme } = useThemeStore();
  const { addExam } = useExamsStore();
  
  const [formData, setFormData] = useState({
    subject: '',
    teacher: '',
    date: '',
    time: '',
    room: '',
    building: 'корп. 1',
    type: 'exam' as 'exam' | 'credit' | 'differential_credit',
    duration: '180',
    description: '',
    faculty: 'fcs',
    selectedGroups: [] as string[],
  });

  const handleSubmit = () => {
    if (!formData.subject.trim() || !formData.teacher.trim() || !formData.date || !formData.time) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (formData.selectedGroups.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одну группу');
      return;
    }

    addExam({
      subject: formData.subject.trim(),
      teacher: formData.teacher.trim(),
      date: formData.date,
      time: formData.time,
      room: formData.room.trim(),
      building: formData.building,
      type: formData.type,
      duration: parseInt(formData.duration) || 180,
      description: formData.description.trim(),
      faculty: formData.faculty,
      groups: formData.selectedGroups,
    });

    Alert.alert('Успех', 'Экзамен добавлен');
    onClose();
    
    // Reset form
    setFormData({
      subject: '',
      teacher: '',
      date: '',
      time: '',
      room: '',
      building: 'корп. 1',
      type: 'exam',
      duration: '180',
      description: '',
      faculty: 'fcs',
      selectedGroups: [],
    });
  };

  const toggleGroup = (group: string) => {
    setFormData(prev => ({
      ...prev,
      selectedGroups: prev.selectedGroups.includes(group)
        ? prev.selectedGroups.filter(g => g !== group)
        : [...prev.selectedGroups, group]
    }));
  };

  const styles = createStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Добавить экзамен</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.field}>
            <Text style={styles.label}>Предмет *</Text>
            <TextInput
              style={styles.input}
              value={formData.subject}
              onChangeText={(text) => setFormData({ ...formData, subject: text })}
              placeholder="Введите название предмета"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Преподаватель *</Text>
            <TextInput
              style={styles.input}
              value={formData.teacher}
              onChangeText={(text) => setFormData({ ...formData, teacher: text })}
              placeholder="Введите ФИО преподавателя"
              placeholderTextColor={theme.textSecondary}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Тип экзамена</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
                style={styles.picker}
              >
                {EXAM_TYPES.map((type) => (
                  <Picker.Item
                    key={type.id}
                    label={type.name}
                    value={type.id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Дата *</Text>
              <TextInput
                style={styles.input}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="ГГГГ-ММ-ДД"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Время *</Text>
              <TextInput
                style={styles.input}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="9:00-12:00"
                placeholderTextColor={theme.textSecondary}
              />
            </View>
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Аудитория</Text>
              <TextInput
                style={styles.input}
                value={formData.room}
                onChangeText={(text) => setFormData({ ...formData, room: text })}
                placeholder="101"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={[styles.field, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Корпус</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.building}
                  onValueChange={(value) => setFormData({ ...formData, building: value })}
                  style={styles.picker}
                >
                  <Picker.Item label="корп. 1" value="корп. 1" />
                  <Picker.Item label="корп. 2" value="корп. 2" />
                  <Picker.Item label="корп. 3" value="корп. 3" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Продолжительность (минуты)</Text>
            <TextInput
              style={styles.input}
              value={formData.duration}
              onChangeText={(text) => setFormData({ ...formData, duration: text })}
              placeholder="180"
              placeholderTextColor={theme.textSecondary}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Факультет</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={formData.faculty}
                onValueChange={(value) => setFormData({ ...formData, faculty: value, selectedGroups: [] })}
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

          <View style={styles.field}>
            <Text style={styles.label}>Группы *</Text>
            <View style={styles.groupsContainer}>
              {GROUPS_BY_FACULTY[formData.faculty as keyof typeof GROUPS_BY_FACULTY].map((group) => (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.groupButton,
                    formData.selectedGroups.includes(group) && styles.groupButtonSelected
                  ]}
                  onPress={() => toggleGroup(group)}
                >
                  <Text
                    style={[
                      styles.groupButtonText,
                      formData.selectedGroups.includes(group) && styles.groupButtonTextSelected
                    ]}
                  >
                    {group}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Описание</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              placeholder="Описание экзамена..."
              placeholderTextColor={theme.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Отмена</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Plus size={20} color="white" />
            <Text style={styles.submitButtonText}>Добавить</Text>
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
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.border,
    borderRadius: 8,
    backgroundColor: theme.surface,
  },
  picker: {
    color: theme.text,
  },
  groupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
  },
  groupButtonSelected: {
    backgroundColor: theme.primary,
    borderColor: theme.primary,
  },
  groupButtonText: {
    fontSize: 14,
    color: theme.text,
  },
  groupButtonTextSelected: {
    color: 'white',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.primary,
    gap: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});