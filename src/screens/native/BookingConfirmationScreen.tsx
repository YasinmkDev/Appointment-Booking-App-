import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { CheckCircle, CalendarPlus, Check, QrCode, ArrowLeft } from 'lucide-react';
import { Booking } from '../../types';
import { PerforatedDivider, StatusPill } from '../../components/native/TicketStub';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface BookingConfirmationScreenProps {
  booking: Booking;
  onBackToBrowse: () => void;
  onViewMyBookings: () => void;
}

export const BookingConfirmationScreen: React.FC<BookingConfirmationScreenProps> = ({
  booking,
  onBackToBrowse,
  onViewMyBookings,
}) => {
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const handleAddCalendar = () => {
    setAddedToCalendar(true);
    setTimeout(() => setAddedToCalendar(false), 3000);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Celebration Stamped Header */}
      <View style={styles.celebrationContainer}>
        <View style={styles.iconCircle}>
          <CheckCircle size={28} color={Colors.marigoldDeep} />
        </View>
        <Text style={styles.celebrationTitle}>Booking Confirmed</Text>
        <Text style={styles.celebrationSubtitle}>
          Your appointment has been successfully secured and stamped in the ledger.
        </Text>
      </View>

      {/* Signature Element: Large Ticket Card */}
      <View style={styles.ticketCard}>
        {/* Top Details Section */}
        <View style={styles.ticketTop}>
          <Text style={styles.sectionKicker}>APPOINTMENT DETAILS</Text>
          <Text style={styles.serviceName}>{booking.serviceName}</Text>
          <Text style={styles.providerName}>at {booking.providerName}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>DATE</Text>
              <Text style={styles.gridValue}>{booking.date}</Text>
            </View>
            <View style={styles.gridColumn}>
              <Text style={styles.gridLabel}>TIME</Text>
              <Text style={styles.gridValueMono}>{booking.time}</Text>
            </View>
          </View>
        </View>

        {/* Perforated Tear Line with Circular Notches */}
        <PerforatedDivider orientation="horizontal" withNotches={true} />

        {/* Bottom Section: The Ticket Stub */}
        <View style={styles.ticketStub}>
          <View style={styles.stubMetaRow}>
            <View>
              <Text style={styles.stubLabel}>REF CODE</Text>
              <View style={styles.refCodeBadge}>
                <Text style={styles.refCodeText}>{booking.refCode}</Text>
              </View>
            </View>

            <View style={styles.statusContainer}>
              <Text style={styles.stubLabel}>STATUS</Text>
              <StatusPill status="confirmed" />
            </View>
          </View>

          {/* Decorative Barcode / QR Stamp Box */}
          <View style={styles.qrStampBox}>
            <View style={styles.qrLeft}>
              <QrCode size={30} color={Colors.inkPlum} />
              <View style={styles.qrTextCol}>
                <Text style={styles.qrCodeHeader}>PASS #{booking.refCode}</Text>
                <Text style={styles.qrCodeSub}>PRESENT AT CHECK-IN</Text>
              </View>
            </View>
            <Text style={styles.qrPrice}>${booking.price.toFixed(2)}</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsGroup}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleAddCalendar}
              style={styles.calendarButton}
            >
              {addedToCalendar ? (
                <>
                  <Check size={16} color={Colors.marigoldLight} />
                  <Text style={styles.calendarButtonText}>Added to Device Calendar</Text>
                </>
              ) : (
                <>
                  <CalendarPlus size={16} color={Colors.marigoldLight} />
                  <Text style={styles.calendarButtonText}>Add to Calendar</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onViewMyBookings}
              style={styles.viewBookingsButton}
            >
              <Text style={styles.viewBookingsButtonText}>View in My Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onBackToBrowse}
              style={styles.backBrowseButton}
            >
              <Text style={styles.backBrowseText}>← Back to Browse</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    alignItems: 'center',
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 8,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.marigoldFaded,
    borderWidth: 1,
    borderColor: Colors.marigoldLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  celebrationTitle: {
    fontFamily: Fonts.serif,
    fontSize: 22,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 4,
  },
  celebrationSubtitle: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 17,
  },
  ticketCard: {
    width: '100%',
    backgroundColor: Colors.alabasterCard,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  ticketTop: {
    padding: 18,
    backgroundColor: Colors.white,
  },
  sectionKicker: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: Colors.slate,
    marginBottom: 6,
  },
  serviceName: {
    fontFamily: Fonts.serif,
    fontSize: 19,
    fontWeight: '700',
    color: Colors.inkPlum,
    marginBottom: 2,
  },
  providerName: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    color: Colors.slate,
    marginBottom: 14,
  },
  detailsGrid: {
    flexDirection: 'row',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
  },
  gridColumn: {
    flex: 1,
  },
  gridLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    marginBottom: 2,
  },
  gridValue: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '600',
    color: Colors.inkPlum,
  },
  gridValueMono: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  ticketStub: {
    padding: 18,
    backgroundColor: Colors.warmAlabaster,
    gap: 16,
  },
  stubMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stubLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    color: Colors.slate,
    marginBottom: 4,
  },
  refCodeBadge: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  refCodeText: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
    letterSpacing: 1,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  qrStampBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderStyle: 'dashed',
    borderRadius: 6,
    padding: 10,
  },
  qrLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qrTextCol: {
    gap: 1,
  },
  qrCodeHeader: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  qrCodeSub: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    color: Colors.slate,
  },
  qrPrice: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  actionsGroup: {
    gap: 8,
    paddingTop: 4,
  },
  calendarButton: {
    backgroundColor: Colors.inkPlum,
    paddingVertical: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  calendarButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.warmAlabaster,
  },
  viewBookingsButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.inkPlum,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBookingsButtonText: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.inkPlum,
  },
  backBrowseButton: {
    paddingVertical: 6,
    alignItems: 'center',
  },
  backBrowseText: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.slate,
  },
});
