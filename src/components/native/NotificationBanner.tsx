import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { useNotificationStore, AppNotification, NotificationType } from '../../store/notificationStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

const ICON_MAP: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle size={15} color={Colors.sageDark} />,
  error: <AlertCircle size={15} color={Colors.dustyRoseDark} />,
  info: <Info size={15} color={Colors.inkPlum} />,
  warning: <AlertTriangle size={15} color={Colors.marigoldDeep} />,
};

const BG_MAP: Record<NotificationType, string> = {
  success: Colors.sageLight,
  error: Colors.dustyRoseLight,
  info: Colors.alabasterCard,
  warning: Colors.marigoldFaded,
};

const BORDER_MAP: Record<NotificationType, string> = {
  success: Colors.sageTeal,
  error: Colors.dustyRose,
  info: Colors.outline,
  warning: Colors.marigold,
};

function BannerItem({ notif }: { notif: AppNotification }) {
  const dismiss = useNotificationStore((s) => s.dismiss);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.banner,
        { backgroundColor: BG_MAP[notif.type], borderColor: BORDER_MAP[notif.type] },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={styles.iconWrap}>{ICON_MAP[notif.type]}</View>
      <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
      <TouchableOpacity onPress={() => dismiss(notif.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <X size={13} color={Colors.slate} />
      </TouchableOpacity>
    </Animated.View>
  );
}

export function NotificationBanner() {
  const notifications = useNotificationStore((s) => s.notifications);
  if (notifications.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {notifications.map((n) => (
        <BannerItem key={n.id} notif={n} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 8,
    left: 12,
    right: 12,
    zIndex: 9999,
    gap: 6,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: Colors.inkPlum,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  iconWrap: { flexShrink: 0 },
  message: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.inkPlum,
    lineHeight: 17,
  },
});
