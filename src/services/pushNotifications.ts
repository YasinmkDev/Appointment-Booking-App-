/**
 * BookEase Push Notification Service
 *
 * Handles:
 *  - Requesting notification permissions
 *  - Registering for Expo push token (stored in AsyncStorage for backend use)
 *  - Scheduling local booking reminder notifications (1 hour before appointment)
 *  - Cancelling notifications when a booking is cancelled
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Booking } from '../types';
import { supabase } from '../lib/supabase';

const PUSH_TOKEN_KEY = 'bookease_push_token';
const REMINDER_KEY_PREFIX = 'bookease_reminder_';

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null; // simulators don't support push

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('bookease', {
      name: 'BookEase Appointments',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
    const token = tokenData.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      await supabase.from('push_tokens').upsert({
        user_id: authData.user.id,
        token,
        platform: Platform.OS,
      });
    }
    return token;
  } catch {
    return null;
  }
}

export async function getStoredPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(PUSH_TOKEN_KEY);
}

/**
 * Schedule a local reminder 1 hour before the booking start time.
 * Returns the notification identifier so it can be cancelled later.
 */
export async function scheduleBookingReminder(booking: Booking): Promise<string | null> {
  const startDate = new Date(booking.startISO);
  const reminderDate = new Date(startDate.getTime() - 60 * 60 * 1000);

  if (reminderDate <= new Date()) return null; // already in the past

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Appointment Reminder',
        body: `${booking.serviceName} at ${booking.providerName} in 1 hour`,
        data: { bookingId: booking.id, refCode: booking.refCode },
        sound: true,
        ...(Platform.OS === 'android' ? { channelId: 'bookease' } : {}),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderDate,
      },
    });
    await AsyncStorage.setItem(`${REMINDER_KEY_PREFIX}${booking.id}`, id);
    return id;
  } catch {
    return null;
  }
}

export async function cancelBookingReminder(notificationId: string): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelBookingReminderForBooking(bookingId: string): Promise<void> {
  const key = `${REMINDER_KEY_PREFIX}${bookingId}`;
  const notificationId = await AsyncStorage.getItem(key);
  if (notificationId) {
    await cancelBookingReminder(notificationId);
    await AsyncStorage.removeItem(key);
  }
}
