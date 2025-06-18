import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, ChevronDown, ChevronUp, FileSpreadsheet } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useExamsStore } from "@/stores/exams-store";
import { useThemeStore } from "@/stores/theme-store";
import { ExamCard } from "@/components/ExamCard";
import { AddExamModal } from "@/components/AddExamModal";

export default function ExamsScreen() {
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const { exams } = useExamsStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAddFormExpanded, setIsAddFormExpanded] = useState(false);

  const canAddExams = user?.role === 'teacher' || user?.role === 'admin';

  const handleGoogleSheetsIntegration = () => {
    console.log('Google Sheets integration for exams');
  };

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Экзамены</Text>
        {canAddExams && (
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.googleSheetsButton}
              onPress={handleGoogleSheetsIntegration}
            >
              <FileSpreadsheet size={18} color="white" />
              <Text style={styles.googleSheetsButtonText}>Google Таблицы</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.addButton, isAddFormExpanded && styles.addButtonExpanded]}
              onPress={() => setIsAddFormExpanded(!isAddFormExpanded)}
            >
              <Plus size={20} color="white" />
              <Text style={styles.addButtonText}>Добавить</Text>
              {isAddFormExpanded ? 
                <ChevronUp size={16} color="white" /> : 
                <ChevronDown size={16} color="white" />
              }
            </TouchableOpacity>
          </View>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {canAddExams && isAddFormExpanded && (
          <View style={styles.addFormContainer}>
            <View style={styles.addForm}>
              <Text style={styles.addFormTitle}>Быстрое добавление экзамена</Text>
              <Text style={styles.addFormDescription}>
                Создайте новый экзамен для студентов
              </Text>
              <TouchableOpacity 
                style={styles.fullFormButton}
                onPress={() => {
                  setShowAddModal(true);
                  setIsAddFormExpanded(false);
                }}
              >
                <Plus size={16} color={theme.primary} />
                <Text style={styles.fullFormButtonText}>Открыть полную форму</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.examsList}>
          {exams.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Нет запланированных экзаменов</Text>
              {canAddExams && (
                <Text style={styles.emptySubtext}>
                  Нажмите "Добавить" чтобы создать новый экзамен
                </Text>
              )}
            </View>
          ) : (
            exams.map((exam) => (
              <ExamCard 
                key={exam.id} 
                exam={exam}
                canEdit={canAddExams}
              />
            ))
          )}
        </View>
      </ScrollView>

      {showAddModal && (
        <AddExamModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.text,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  googleSheetsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.success,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  googleSheetsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonExpanded: {
    backgroundColor: theme.secondary,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  addFormContainer: {
    marginBottom: 20,
  },
  addForm: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  addFormTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.text,
    marginBottom: 8,
  },
  addFormDescription: {
    fontSize: 15,
    color: theme.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  fullFormButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.background,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    gap: 10,
    borderWidth: 2,
    borderColor: theme.primary,
  },
  fullFormButtonText: {
    color: theme.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  examsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    backgroundColor: theme.surface,
    borderRadius: 16,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textSecondary,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
});