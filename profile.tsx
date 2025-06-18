import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Edit, LogOut, Bell, Settings, User } from "lucide-react-native";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import { useThemeStore } from "@/stores/theme-store";
import { EditProfileModal } from "@/components/EditProfileModal";
import { NotificationsList } from "@/components/NotificationsList";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount } = useNotificationsStore();
  const { theme } = useThemeStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Выход",
      "Вы уверены, что хотите выйти из системы?",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Выйти", style: "destructive", onPress: logout }
      ]
    );
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'student': return 'Студент';
      case 'teacher': return 'Преподаватель';
      case 'admin': return 'Администратор';
      default: return 'Пользователь';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student': return theme.primary;
      case 'teacher': return theme.success;
      case 'admin': return theme.error;
      default: return theme.textSecondary;
    }
  };

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.errorText, { color: theme.text }]}>Пользователь не найден</Text>
      </SafeAreaView>
    );
  }

  const styles = createStyles(theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <User size={40} color={theme.textSecondary} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.surname} {user.name}</Text>
            <Text style={[styles.userRole, { color: getRoleColor(user.role) }]}>
              {getRoleText(user.role)}
            </Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => setShowNotifications(true)}
          >
            <View style={styles.menuItemLeft}>
              <Bell size={20} color={theme.textSecondary} />
              <Text style={styles.menuItemText}>Уведомления</Text>
            </View>
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Settings size={20} color={theme.textSecondary} />
              <Text style={styles.menuItemText}>Настройки</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <View style={styles.menuItemLeft}>
              <LogOut size={20} color={theme.error} />
              <Text style={[styles.menuItemText, { color: theme.error }]}>Выйти</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showEditModal && (
        <EditProfileModal
          visible={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
        />
      )}

      {showNotifications && (
        <NotificationsList
          visible={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
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
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: theme.surface,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: theme.border,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  editButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: theme.background,
    borderWidth: 1,
    borderColor: theme.primary,
  },
  section: {
    backgroundColor: theme.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    color: theme.text,
  },
  logoutItem: {
    borderBottomWidth: 0,
  },
  badge: {
    backgroundColor: theme.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 50,
  },
});