import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { X, Bell, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react-native';
import { useThemeStore } from '@/stores/theme-store';
import { useAuthStore } from '@/stores/auth-store';
import { useNotificationsStore, Notification } from '@/stores/notifications-store';

interface NotificationsListProps {
  visible: boolean;
  onClose: () => void;
  notifications: Notification[];
}

export function NotificationsList({ visible, onClose, notifications }: NotificationsListProps) {
  const { theme } = useThemeStore();
  const { user } = useAuthStore();
  const { markAsRead, markAllAsRead, deleteNotification, getNotificationsForUser } = useNotificationsStore();

  const userNotifications = user 
    ? getNotificationsForUser(user.role, user.faculty, user.group)
    : notifications;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} color={theme.success} />;
      case 'warning': return <AlertTriangle size={20} color={theme.warning} />;
      case 'error': return <AlertCircle size={20} color={theme.error} />;
      default: return <Info size={20} color={theme.primary} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Сегодня';
    } else if (diffDays === 2) {
      return 'Вчера';
    } else if (diffDays <= 7) {
      return `${diffDays - 1} дня назад`;
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <View style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </View>
        <View style={styles.notificationContent}>
          <Text style={[styles.notificationTitle, !item.read && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.notificationDate}>
            {formatDate(item.date)}
          </Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </View>
      <Text style={styles.notificationMessage}>
        {item.message}
      </Text>
    </TouchableOpacity>
  );

  const styles = createStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Bell size={24} color={theme.primary} />
            <Text style={styles.title}>Уведомления</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.markAllButton}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAllButtonText}>Прочитать все</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        <FlatList
          data={userNotifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Bell size={48} color={theme.textSecondary} />
              <Text style={styles.emptyText}>Нет уведомлений</Text>
              <Text style={styles.emptySubtext}>
                Здесь будут отображаться важные уведомления
              </Text>
            </View>
          }
        />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: theme.primary,
  },
  markAllButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 4,
  },
  list: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: theme.primary,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  notificationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.text,
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '600',
  },
  notificationDate: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.primary,
    marginLeft: 8,
    marginTop: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
    textAlign: 'center',
    opacity: 0.7,
  },
});