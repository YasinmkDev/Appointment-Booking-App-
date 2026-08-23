import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Star, Send, CheckCircle } from 'lucide-react-native';
import { Booking } from '../../types';
import { useReviewStore } from '../../store/reviewStore';
import { useNotificationStore } from '../../store/notificationStore';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface ReviewScreenProps {
  booking: Booking;
  authorName: string;
  onSubmitted: () => void;
  onSkip: () => void;
}

export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  booking,
  authorName,
  onSubmitted,
  onSkip,
}) => {
  const addReview = useReviewStore((s) => s.addReview);
  const notify = useNotificationStore((s) => s.show);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    addReview({
      bookingId: booking.id,
      providerId: booking.providerId,
      providerName: booking.providerName,
      serviceName: booking.serviceName,
      rating,
      comment: comment.trim(),
      authorName,
    });
    setSubmitted(true);
    notify(`Review submitted for ${booking.providerName}`, 'success');
    setTimeout(onSubmitted, 1200);
  };

  if (submitted) {
    return (
      <View style={styles.successContainer}>
        <CheckCircle size={48} color={Colors.sageTeal} />
        <Text style={styles.successTitle}>Thank you!</Text>
        <Text style={styles.successSub}>Your review has been recorded.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Leave a Review</Text>
        <Text style={styles.subtitle}>
          How was your experience at {booking.providerName}?
        </Text>
      </View>

      {/* Booking context */}
      <View style={styles.contextCard}>
        <Text style={styles.contextService}>{booking.serviceName}</Text>
        <Text style={styles.contextMeta}>{booking.providerName} · {booking.date}</Text>
      </View>

      {/* Star rating */}
      <View style={styles.starsSection}>
        <Text style={styles.starsLabel}>YOUR RATING</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              activeOpacity={0.7}
              style={styles.starBtn}
            >
              <Star
                size={36}
                color={Colors.marigold}
                fill={star <= rating ? Colors.marigold : 'transparent'}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingLabel}>
            {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
          </Text>
        )}
      </View>

      {/* Comment */}
      <View style={styles.commentSection}>
        <Text style={styles.commentLabel}>COMMENTS (OPTIONAL)</Text>
        <TextInput
          style={styles.commentInput}
          value={comment}
          onChangeText={setComment}
          placeholder="Share what you loved or what could be improved..."
          placeholderTextColor={Colors.slate}
          multiline
          numberOfLines={4}
          maxLength={400}
          textAlignVertical="top"
        />
        <Text style={styles.charCount}>{comment.length}/400</Text>
      </View>

      {/* Actions */}
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handleSubmit}
        disabled={rating === 0}
        style={[styles.submitBtn, rating === 0 && styles.submitBtnDisabled]}
      >
        <Send size={14} color={Colors.inkPlum} />
        <Text style={styles.submitBtnText}>Submit Review</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
        <Text style={styles.skipBtnText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  content: { padding: 16, paddingBottom: 90, gap: 16 },
  header: { gap: 4 },
  title: { fontFamily: Fonts.serif, fontSize: 22, fontWeight: '700', color: Colors.inkPlum },
  subtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, lineHeight: 17 },
  contextCard: {
    backgroundColor: Colors.alabasterCard,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.outline,
    padding: 12,
    gap: 3,
  },
  contextService: { fontFamily: Fonts.serif, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  contextMeta: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  starsSection: { alignItems: 'center', gap: 8 },
  starsLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    alignSelf: 'flex-start',
  },
  starsRow: { flexDirection: 'row', gap: 6 },
  starBtn: { padding: 4 },
  ratingLabel: {
    fontFamily: Fonts.serif,
    fontSize: 16,
    fontWeight: '700',
    color: Colors.marigoldDeep,
  },
  commentSection: { gap: 6 },
  commentLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    fontWeight: '700',
    color: Colors.slate,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  commentInput: {
    backgroundColor: Colors.alabasterCard,
    borderWidth: 1,
    borderColor: Colors.outline,
    borderRadius: 6,
    padding: 12,
    fontFamily: Fonts.sans,
    fontSize: 13,
    color: Colors.inkPlum,
    minHeight: 100,
    lineHeight: 19,
  },
  charCount: { fontFamily: Fonts.mono, fontSize: 10, color: Colors.slate, alignSelf: 'flex-end' },
  submitBtn: {
    backgroundColor: Colors.marigoldLight,
    borderWidth: 1,
    borderColor: Colors.marigoldDeep,
    borderRadius: 4,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontFamily: Fonts.sans, fontSize: 14, fontWeight: '700', color: Colors.inkPlum },
  skipBtn: { alignItems: 'center', paddingVertical: 8 },
  skipBtnText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: Colors.warmAlabaster,
  },
  successTitle: { fontFamily: Fonts.serif, fontSize: 22, fontWeight: '700', color: Colors.inkPlum },
  successSub: { fontFamily: Fonts.sans, fontSize: 13, color: Colors.slate },
});
