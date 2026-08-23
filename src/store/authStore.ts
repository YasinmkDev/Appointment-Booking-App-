import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole, UserProfile, Screen } from '../types';
import { INITIAL_USER_PROFILE } from '../data/mockData';
import { api, ApiError } from '../api/client';

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
  loginAsGuest: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = 'bookease_auth';
const PROFILE_KEY = 'bookease_profile';

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
    try {
      const res = await api.post<{ user: UserProfile; role: UserRole; token: string }>(
        '/auth/login',
        { email, password }
      );
      get().login(res.user, res.role, res.token);
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        // No backend — fall through to demo login handled by AuthScreen
        throw err;
      }
      const msg = err instanceof ApiError
        ? (err.status === 401 ? 'Invalid email or password.' : 'Login failed. Please try again.')
        : 'Network error. Check your connection.';
      set({ authError: msg });
      throw err;
    }
  },

  loginAsGuest: () => {
    set({ isGuest: true, isAuthenticated: false, token: null, currentScreen: 'browse' });
  },

  logout: () => {
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
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
      const [raw, storedProfile] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(PROFILE_KEY),
      ]);
      const profile = storedProfile ? JSON.parse(storedProfile) as UserProfile : null;
      if (profile) set({ user: profile });
      if (raw) {
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
