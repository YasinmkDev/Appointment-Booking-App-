import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export interface Review {
  id: string;
  bookingId: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  rating: number; // 1–5
  comment: string;
  authorName: string;
  createdAt: string;
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getReviewsForProvider: (providerId: string) => Review[];
  getAverageRating: (providerId: string) => number | null;
  hasReviewed: (bookingId: string) => boolean;
}

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: (review) =>
        set((s) => {
          const created = { ...review, id: `rev-${Date.now()}`, createdAt: new Date().toISOString() };
          void supabase.auth.getUser().then(({ data }) => {
            if (!data.user) return;
            void supabase.from('reviews').insert({
              booking_id: review.bookingId,
              customer_id: data.user.id,
              provider_id: review.providerId,
              rating: review.rating,
              comment: review.comment,
            });
          });
          return { reviews: [...s.reviews, created] };
        }),

      getReviewsForProvider: (providerId) =>
        get().reviews.filter((r) => r.providerId === providerId),

      getAverageRating: (providerId) => {
        const providerReviews = get().reviews.filter((r) => r.providerId === providerId);
        if (providerReviews.length === 0) return null;
        const sum = providerReviews.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / providerReviews.length) * 10) / 10;
      },

      hasReviewed: (bookingId) =>
        get().reviews.some((r) => r.bookingId === bookingId),
    }),
    {
      name: 'bookease-reviews',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
