import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, UserProfile, Screen } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

interface AuthState {
  user: UserProfile;
  role: UserRole;
  currentScreen: Screen;
  isAuthenticated: boolean;
  isGuest: boolean;
  token: string | null;
  isHydrated: boolean;
  authError: string | null;

  setUser: (user: UserProfile) => void;
  setRole: (role: UserRole) => void;
  setCurrentScreen: (screen: Screen) => void;
  login: (user: UserProfile, role: UserRole, token?: string) => void;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  registerWithCredentials: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'bookease_auth';
const PROFILE_KEY = 'bookease_profile';

function mapProfile(row: DatabaseProfile, fallback: UserProfile): UserProfile {
  return {
    ...fallback,
    id: row.id,
    name: row.name || fallback.name,
    email: row.email || fallback.email,
    phone: row.phone || fallback.phone,
    avatar: row.avatar_url || fallback.avatar,
    memberSince: row.member_since,
    role: row.role,
    hasStudio: row.has_studio,
    studioId: row.studio_id ?? undefined,
    studioName: row.studio_name ?? undefined,
    studioCategory: row.studio_category ?? undefined,
    activePassesCount: row.active_passes_count,
    pastPassesCount: row.past_passes_count,
  };
}

type DatabaseProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  role: UserRole;
  member_since: string;
  has_studio: boolean;
  studio_id: string | null;
  studio_name: string | null;
  studio_category: string | null;
  active_passes_count: number;
  past_passes_count: number;
};

function persistProfile(user: UserProfile): void {
  AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(user)).catch(() => {});
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: INITIAL_USER_PROFILE,
  role: 'customer',
  currentScreen: 'welcome',
  isAuthenticated: false,
  isGuest: false,
  token: null,
  isHydrated: false,
  authError: null,

  setUser: (user) => {
    set({ user });
    persistProfile(user);
    if (!user.id.startsWith('usr-')) {
      void supabase.from('profiles').upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar,
        role: user.role,
        member_since: user.memberSince,
        has_studio: user.hasStudio,
        studio_id: user.studioId ?? null,
        studio_name: user.studioName ?? null,
        studio_category: user.studioCategory ?? null,
        active_passes_count: user.activePassesCount,
        past_passes_count: user.pastPassesCount,
      } satisfies ProfileInsert).then(() => undefined, () => undefined);
    }
  },
  setRole: (role) => set({ role }),
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  login: (user, role, token) => {
    const resolvedToken = token ?? `demo-jwt-${Date.now()}`;
    set({ user, role, isAuthenticated: true, isGuest: false, token: resolvedToken, authError: null });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ user, role, token: resolvedToken })).catch(() => {});
    persistProfile(user);
    set({ currentScreen: role === 'provider' ? 'dashboard' : 'browse' });
  },

  loginWithCredentials: async (email, password) => {
    set({ authError: null });
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user || !data.session) {
      const message = error?.message ?? 'Unable to sign in.';
      set({ authError: message });
      throw new Error(message);
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();
    const fallback = { ...INITIAL_USER_PROFILE, id: data.user.id, email };
    const user = profile ? mapProfile(profile, fallback) : fallback;
    get().login(user, user.role, data.session.access_token);
  },

  registerWithCredentials: async (name, email, password, role) => {
    set({ authError: null });
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error || !data.user || !data.session) {
      const message = error?.message ?? 'Check your email to confirm your account before signing in.';
      set({ authError: message });
      throw new Error(message);
    }

    const profile: UserProfile = {
      ...INITIAL_USER_PROFILE,
      id: data.user.id,
      name: name || 'New Member',
      email,
      role,
    };
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      name: profile.name,
      email,
      role,
      member_since: new Date().toISOString().slice(0, 10),
    } satisfies ProfileInsert);
    if (profileError) throw profileError;
    get().login(profile, role, data.session.access_token);
  },

  loginAsGuest: () => {
    set({ isGuest: true, isAuthenticated: false, token: null, currentScreen: 'browse' });
  },

  logout: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    void supabase.auth.signOut().catch(() => {});
    set({
      user: INITIAL_USER_PROFILE,
      role: 'customer',
      currentScreen: 'auth',
      isAuthenticated: false,
      isGuest: false,
      token: null,
    });
  },

  switchRole: (role) => {
    set({ role, currentScreen: role === 'provider' ? 'dashboard' : 'browse' });
  },

  hydrate: async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const [raw, storedProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      const profile = storedProfile ? JSON.parse(storedProfile) as UserProfile : null;
      if (profile) set({ user: profile });
      if (sessionData.session?.user) {
        const authUser = sessionData.session.user;
        const { data: remoteProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .maybeSingle();
        const fallback = profile ?? { ...INITIAL_USER_PROFILE, id: authUser.id, email: authUser.email ?? '' };
        const hydratedUser = remoteProfile ? mapProfile(remoteProfile, fallback) : fallback;
        set({
          user: hydratedUser,
          role: hydratedUser.role,
          token: sessionData.session.access_token,
          isAuthenticated: true,
          isGuest: false,
          currentScreen: hydratedUser.role === 'provider' ? 'dashboard' : 'browse',
        });
      } else if (raw) {
        const { user, role, token } = JSON.parse(raw) as {
          user: UserProfile;
          role: UserRole;
          token: string;
        };
        set({
          user: profile ?? user,
          role,
          token,
          isAuthenticated: true,
          isGuest: false,
          currentScreen: role === 'provider' ? 'dashboard' : 'browse',
        });
      }
    } catch {
      // corrupted storage — start fresh
    } finally {
      set({ isHydrated: true });
    }
  },
}));
