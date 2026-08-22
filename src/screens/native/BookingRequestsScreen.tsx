import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Check, X, Clock, Calendar } from 'lucide-react';
import { BookingRequest } from '../../types';
import { INITIAL_PROVIDER_REQUESTS } from '../../data/mockData';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

export const BookingRequestsScreen: React.FC = () => {
  const [requests, setRequests] = useState<BookingRequest[]>(INITIAL_PROVIDER_REQUESTS);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleAccept = (req: BookingRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    showToast(`Accepted booking for ${req.customerName}`);
  };

  const handleDecline = (req: BookingRequest) => {
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    showToast(`Declined booking for ${req.customerName}`);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Booking Requests</Text>
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingBadgeText}>{requests.length} PENDING</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Clients awaiting confirmation. Stamped decisions will update their ledger immediately.
        </Text>
      </View>

      {/* Toast Feedback */}
      {feedbackMessage && (
        <View style={styles.toastBox}>
          <Text style={styles.toastText}>{feedbackMessage}</Text>
        </View>
      )}

      {/* Requests List */}
      <View style={styles.requestsList}>
        {requests.map((req) => (
          <View key={req.id} style={styles.requestCard}>
            {/* Top Row: Ref code + Status */}
            <View style={styles.cardTopRow}>
              <Text style={styles.refCodeText}>REQ #{req.id.toUpperCase()}</Text>
              <Text style={styles.reqTimeText}>{req.isNew ? '● NEW REQUEST' : 'PENDING'}</Text>
            </View>

            {/* Client info */}
            <View style={styles.clientBlock}>
              <View style={styles.clientNameRow}>
                <Text style={styles.clientName}>{req.customerName}</Text>
                {req.isNew && (
                  <View style={styles.firstTimeBadge}>
                    <Text style={styles.firstTimeText}>FIRST VISIT</Text>
                  </View>
                )}
              </View>

              <Text style={styles.serviceName}>{req.serviceName}</Text>
            </View>

            {/* Time & Date Stamp */}
            <View style={styles.timeStampBlock}>
              <View style={styles.stampItem}>
                <Calendar size={12} color={Colors.marigoldDeep} />
                <Text style={styles.stampValue}>{req.date}</Text>
              </View>
              <View style={styles.stampItem}>
                <Clock size={12} color={Colors.slate} />
                <Text style={styles.stampValue}>{req.timeRange}</Text>
              </View>
            </View>

            {/* Action Buttons: Accept (Sage Teal) / Decline (Dusty Rose) */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleDecline(req)}
                style={styles.declineButton}
              >
                <X size={14} color={Colors.dustyRoseDark} />
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleAccept(req)}
                style={styles.acceptButton}
              >
                <Check size={14} color={Colors.white} />
                <Text style={styles.acceptButtonText}>Accept Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {requests.length === 0 && (
          <View style={styles.emptyRequestsBox}>
            <Text style={styles.emptyTitle}>All caught up!</Text>
            <Text style={styles.emptySubtitle}>
              There are no pending booking requests right now. New requests will appear here as clients reserve slots.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.warmAlabaster,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 90,
  },
  header: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  title: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  pendingBadge: {
    backgroundColor: 'rgba(232, 163, 61, 0.2)',
    borderWidth: 1,
    borderColor: Colors.marigoldLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.marigoldDeep,
  },
  subtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    lineHeight: 17,
  },
  toastBox: {
    backgroundColor: Colors.sageLight,
    borderWidth: 1,
    borderColor: Colors.sageTeal,
    borderRadius: 4,
    padding: 10,
    marginBottom: 12,
  },
  toastText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.sageDark,
    textAlign: 'center',
  },
  requestsList: {
    gap: 14,
  },
  requestCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  refCodeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  reqTimeText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.slate,
  },
  clientBlock: {
    marginBottom: 10,
  },
  clientNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clientName: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  firstTimeBadge: {
    backgroundColor: '#EBE8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
  },
  firstTimeText: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  serviceName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginTop: 2,
  },
  timeStampBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.warmAlabaster,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    marginBottom: 12,
  },
  stampItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  stampValue: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  declineButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.dustyRose,
    backgroundColor: Colors.dustyRoseLight,
  },
  declineButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.dustyRoseDark,
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: Colors.sageDark,
  },
  acceptButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  emptyRequestsBox: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  emptyTitle: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    textAlign: 'center',
    lineHeight: 16,
  },
});
