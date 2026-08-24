export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          avatar_url: string | null;
          role: 'customer' | 'provider';
          member_since: string;
          has_studio: boolean;
          studio_id: string | null;
          studio_name: string | null;
          studio_category: string | null;
          active_passes_count: number;
          past_passes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          email?: string;
          phone?: string;
          avatar_url?: string | null;
          role?: 'customer' | 'provider';
          member_since?: string;
          has_studio?: boolean;
          studio_id?: string | null;
          studio_name?: string | null;
          studio_category?: string | null;
          active_passes_count?: number;
          past_passes_count?: number;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
        Relationships: [];
      };
      providers: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          category: string;
          rating: number;
          review_count: number;
          distance: string;
          bio: string;
          image_url: string;
          next_available: string;
          slot_interval_minutes: number;
          buffer_minutes: number;
          instant_confirmation: boolean;
          timezone: string;
          address: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['providers']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['providers']['Insert']>;
        Relationships: [];
      };
      services: {
        Row: {
          id: string;
          provider_id: string;
          name: string;
          description: string;
          price: number;
          duration_minutes: number;
          category: string;
          buffer_minutes: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['services']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['services']['Insert']>;
        Relationships: [];
      };
      bookings: {
        Row: {
          id: string;
          customer_id: string;
          provider_id: string;
          service_id: string;
          ref_code: string;
          start_at: string;
          end_at: string;
          status: 'pending' | 'confirmed' | 'completed' | 'canceled';
          payment_status: 'unpaid' | 'paid' | 'refunded';
          price: number;
          customer_notes: string | null;
          cancel_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at' | 'ref_code'> & { id?: string; ref_code?: string };
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          customer_id: string;
          provider_id: string;
          rating: number;
          comment: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
        Relationships: [];
      };
      booking_requests: {
        Row: {
          id: string;
          booking_id: string;
          provider_id: string;
          customer_id: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['booking_requests']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['booking_requests']['Insert']>;
        Relationships: [];
      };
      push_tokens: {
        Row: { user_id: string; token: string; platform: string; updated_at: string };
        Insert: Omit<Database['public']['Tables']['push_tokens']['Row'], 'updated_at'>;
        Update: Partial<Database['public']['Tables']['push_tokens']['Insert']>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
