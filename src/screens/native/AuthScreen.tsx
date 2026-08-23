import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator,
} from 'react-native';
import { Mail, Lock, User, Store, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { UserRole, UserProfile } from '../../types';
import { useAuthStore } from '../../store/authStore';
import { api, ApiError } from '../../api/client';
import { Colors } from '../../theme/colors';
import { Fonts } from '../../theme/fonts';

interface AuthScreenProps {
  onAuthSuccess: (user: UserProfile, targetRole: UserRole) => void;
  onContinueAsGuest: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess, onContinueAsGuest }) => {
  const loginWithCredentials = useAuthStore((s) => s.loginWithCredentials);
  const authError = useAuthStore((s) => s.authError);

  const [authMode, setAuthMode] = useState<'signin' | 'register' | 'forgot'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisteringStudio, setIsRegisteringStudio] = useState(false);
  const [studioName, setStudioName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const switchMode = (mode: 'signin' | 'register') => {
    setAuthMode(mode);
    setForgotSent(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await loginWithCredentials(email.trim(), password);
    } catch (err) {
      if (err instanceof ApiError && err.status === 0) {
        // No backend — fall back to local demo login
        const user: UserProfile = {
          id: `usr-${Date.now().toString().slice(-6)}`,
          name: name.trim() || (authMode === 'register' ? 'New Member' : 'Eleanor Vance'),
          email: email.trim() || 'member@bookease.app',
          phone: '+1 (555) 234-8901',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          role: isRegisteringStudio ? 'provider' : 'customer',
          hasStudio: isRegisteringStudio,
          studioName: isRegisteringStudio ? (studioName.trim() || 'My Artisan Studio') : undefined,
          studioCategory: isRegisteringStudio ? 'Boutique Studio' : undefined,
          activePassesCount: 0,
          pastPassesCount: 0,
        };
        onAuthSuccess(user, isRegisteringStudio ? 'provider' : 'customer');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: email.trim() });
    } catch {
      // Always show success — never confirm whether email exists (security best practice)
    } finally {
      setIsLoading(false);
      setForgotSent(true);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    if (role === 'customer') {
      onAuthSuccess({
        id: 'usr-8821',
        name: 'Eleanor Vance',
        email: 'eleanor.vance@studio.co',
        phone: '+1 (555) 389-2041',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        memberSince: 'October 2023',
        role: 'customer',
        hasStudio: true,
        studioName: 'Wren & Co. Studio',
        studioCategory: 'Boutique Hair Studio',
        activePassesCount: 2,
        pastPassesCount: 6,
      }, 'customer');
    } else {
      onAuthSuccess({
        id: 'usr-wren',
        name: 'Rowan Wren',
        email: 'rowan@wrenandco.studio',
        phone: '+1 (555) 819-4402',
        avatar: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=400&q=80',
        memberSince: 'January 2023',
        role: 'provider',
        hasStudio: true,
        studioId: 'wren-co',
        studioName: 'Wren & Co. Studio',
        studioCategory: 'Boutique Hair Studio',
        activePassesCount: 0,
        pastPassesCount: 142,
      }, 'provider');
    }
  };

  const renderForgotForm = () => {
    if (forgotSent) {
      return (
        <View style={styles.forgotSuccessBox}>
          <Text style={styles.forgotSuccessTitle}>Check your inbox</Text>
          <Text style={styles.forgotSuccessText}>
            If an account exists for {email.trim() || 'that email'}, a reset link has been sent.
          </Text>
          <TouchableOpacity onPress={() => switchMode('signin')} style={styles.forgotBackBtn}>
            <Text style={styles.forgotBackBtnText}>← Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.forgotForm}>
        <Text style={styles.forgotTitle}>Reset Password</Text>
        <Text style={styles.forgotSubtitle}>Enter your email and we'll send a reset link.</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>EMAIL</Text>
          <View style={styles.inputWrapper}>
            <Mail size={16} color={Colors.slate} style={styles.inputIcon} />
            <TextInput
              placeholder="name@example.com"
              placeholderTextColor={Colors.slate}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleForgotPassword}
          disabled={isLoading || !email.trim()}
          style={[styles.submitButton, (!email.trim() || isLoading) && styles.submitButtonDisabled]}
        >
          {isLoading
            ? <ActivityIndicator size="small" color={Colors.white} />
            : <Text style={styles.submitButtonText}>Send Reset Link</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => switchMode('signin')} style={styles.forgotBackBtn}>
          <Text style={styles.forgotBackBtnText}>← Back to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderMainForm = () => (
    <View style={styles.formBody}>
      {authMode === 'register' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>FULL NAME</Text>
          <View style={styles.inputWrapper}>
            <User size={16} color={Colors.slate} style={styles.inputIcon} />
            <TextInput placeholder="e.g. Eleanor Vance" placeholderTextColor={Colors.slate}
              value={name} onChangeText={setName} style={styles.textInput} />
          </View>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>EMAIL OR PHONE</Text>
        <View style={styles.inputWrapper}>
          <Mail size={16} color={Colors.slate} style={styles.inputIcon} />
          <TextInput placeholder="name@example.com" placeholderTextColor={Colors.slate}
            keyboardType="email-address" autoCapitalize="none"
            value={email} onChangeText={setEmail} style={styles.textInput} />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>PASSWORD</Text>
          {authMode === 'signin' && (
            <TouchableOpacity activeOpacity={0.7} onPress={() => setAuthMode('forgot')}>
              <Text style={styles.forgotPasswordText}>Forgot?</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.inputWrapper}>
          <Lock size={16} color={Colors.slate} style={styles.inputIcon} />
          <TextInput placeholder="••••••••••••" placeholderTextColor={Colors.slate}
            secureTextEntry value={password} onChangeText={setPassword} style={styles.textInput} />
        </View>
      </View>

      {authMode === 'register' && (
        <TouchableOpacity activeOpacity={0.85} onPress={() => setIsRegisteringStudio(!isRegisteringStudio)}
          style={[styles.studioOptionBox, isRegisteringStudio && styles.studioOptionBoxActive]}>
          <View style={styles.studioOptionHeader}>
            <View style={styles.studioIconBadge}>
              <Store size={15} color={isRegisteringStudio ? Colors.inkPlum : Colors.slate} />
            </View>
            <View style={styles.studioOptionTextCol}>
              <Text style={styles.studioOptionTitle}>I want to accept appointments</Text>
              <Text style={styles.studioOptionSub}>Enables studio catalog, working hours & appointment ledger</Text>
            </View>
            <View style={[styles.checkboxCircle, isRegisteringStudio && styles.checkboxCircleActive]}>
              {isRegisteringStudio && <CheckCircle2 size={16} color={Colors.marigoldDeep} />}
            </View>
          </View>
          {isRegisteringStudio && (
            <View style={styles.studioSubInputBox}>
              <Text style={styles.inputLabel}>STUDIO / PRACTICE NAME</Text>
              <TextInput placeholder="e.g. Rowan Hair Atelier" placeholderTextColor={Colors.slate}
                value={studioName} onChangeText={setStudioName} style={styles.studioNameInput} />
            </View>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity activeOpacity={0.85} onPress={handleSubmit} disabled={isLoading}
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}>
        {isLoading
          ? <ActivityIndicator size="small" color={Colors.white} />
          : <>
              <Text style={styles.submitButtonText}>
                {authMode === 'signin' ? 'Enter Ledger Passbook' : isRegisteringStudio ? 'Register & Open Studio' : 'Create Client Account'}
              </Text>
              <ArrowRight size={16} color={Colors.white} />
            </>
        }
      </TouchableOpacity>

      {authError ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{authError}</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.topSealBox}>
        <View style={styles.sealBadge}>
          <Text style={styles.sealBadgeText}>SECURE LEDGER ACCESS</Text>
        </View>
        <Text style={styles.topTitle}>BookEase Identity</Text>
        <Text style={styles.topSubtitle}>Single unified passbook for booking artisans & managing your studio</Text>
      </View>

      {authMode !== 'forgot' && (
        <View style={styles.tabContainer}>
          {(['signin', 'register'] as const).map((mode) => (
            <TouchableOpacity key={mode} activeOpacity={0.8} onPress={() => switchMode(mode)}
              style={[styles.tabButton, authMode === mode && styles.tabButtonActive]}>
              <Text style={[styles.tabText, authMode === mode && styles.tabTextActive]}>
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.formCard}>
        <View style={styles.cardHeaderStub}>
          <Text style={styles.cardStubNumber}>
            {authMode === 'forgot' ? 'PASSWORD RECOVERY • 003' : authMode === 'signin' ? 'LEDGER PASS ENTRY • 001' : 'NEW REGISTRATION • 002'}
          </Text>
          <ShieldCheck size={14} color={Colors.sageTeal} />
        </View>

        {authMode === 'forgot' ? renderForgotForm() : renderMainForm()}

        {authMode !== 'forgot' && (
          <>
            <View style={styles.perforatedRow}>
              <View style={styles.circleCutoutLeft} />
              <View style={styles.dashedLine} />
              <View style={styles.circleCutoutRight} />
            </View>

            <View style={styles.demoSection}>
              <View style={styles.demoHeaderRow}>
                <Sparkles size={13} color={Colors.marigoldDeep} />
                <Text style={styles.demoHeaderText}>ONE-TAP DEMO PRESETS</Text>
              </View>
              <View style={styles.demoButtonsRow}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleDemoLogin('customer')} style={styles.demoClientBtn}>
                  <Text style={styles.demoRoleTag}>CLIENT PASS</Text>
                  <Text style={styles.demoPersonName}>Eleanor Vance</Text>
                  <Text style={styles.demoSub}>Browse & Book</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={() => handleDemoLogin('provider')} style={styles.demoStudioBtn}>
                  <Text style={styles.demoStudioTag}>STUDIO HOST</Text>
                  <Text style={styles.demoStudioName}>Wren & Co.</Text>
                  <Text style={styles.demoStudioSub}>Manage Agenda</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.7} onPress={onContinueAsGuest} style={styles.guestLink}>
        <Text style={styles.guestLinkText}>Continue browsing as guest without account →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.warmAlabaster },
  contentContainer: { padding: 16, paddingBottom: 40 },
  topSealBox: { alignItems: 'center', marginBottom: 18, marginTop: 4 },
  sealBadge: { backgroundColor: 'rgba(232,163,61,0.18)', borderWidth: 1, borderColor: Colors.marigoldLight, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 8 },
  sealBadgeText: { fontFamily: Fonts.mono, fontSize: 9, fontWeight: '700', color: Colors.marigoldDeep, letterSpacing: 0.8 },
  topTitle: { fontFamily: Fonts.serif, fontSize: 24, fontWeight: '700', color: Colors.inkPlum, textAlign: 'center' },
  topSubtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, textAlign: 'center', marginTop: 4, maxWidth: 300, lineHeight: 16 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#EAE6DD', borderRadius: 6, padding: 3, marginBottom: 14, borderWidth: 1, borderColor: Colors.outline },
  tabButton: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 4 },
  tabButtonActive: { backgroundColor: Colors.inkPlum, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.15, shadowRadius: 2, elevation: 2 },
  tabText: { fontFamily: Fonts.mono, fontSize: 12, fontWeight: '600', color: Colors.slate },
  tabTextActive: { color: Colors.white, fontWeight: '700' },
  formCard: { backgroundColor: Colors.alabasterCard, borderRadius: 8, borderWidth: 1, borderColor: Colors.outline, overflow: 'hidden', shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardHeaderStub: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#F3EFE7', borderBottomWidth: 1, borderBottomColor: Colors.outline },
  cardStubNumber: { fontFamily: Fonts.mono, fontSize: 10, fontWeight: '700', color: Colors.inkPlum, letterSpacing: 0.5 },
  formBody: { padding: 16 },
  inputGroup: { marginBottom: 12 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  inputLabel: { fontFamily: Fonts.mono, fontSize: 10, fontWeight: '700', color: Colors.slate, letterSpacing: 0.5, marginBottom: 4 },
  forgotPasswordText: { fontFamily: Fonts.sans, fontSize: 11, color: Colors.marigoldDeep, fontWeight: '600' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.warmAlabaster, borderWidth: 1, borderColor: Colors.outline, borderRadius: 6, paddingHorizontal: 10, height: 42 },
  inputIcon: { marginRight: 8 },
  textInput: { flex: 1, fontFamily: Fonts.sans, fontSize: 13, color: Colors.inkPlum, padding: 0 },
  studioOptionBox: { backgroundColor: '#F4EFEA', borderWidth: 1, borderColor: Colors.outline, borderRadius: 6, padding: 10, marginTop: 4, marginBottom: 14 },
  studioOptionBoxActive: { borderColor: Colors.marigoldLight, backgroundColor: 'rgba(232,163,61,0.08)' },
  studioOptionHeader: { flexDirection: 'row', alignItems: 'center' },
  studioIconBadge: { width: 28, height: 28, borderRadius: 4, backgroundColor: Colors.alabasterCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.outline, marginRight: 8 },
  studioOptionTextCol: { flex: 1 },
  studioOptionTitle: { fontFamily: Fonts.sans, fontSize: 12, fontWeight: '700', color: Colors.inkPlum },
  studioOptionSub: { fontFamily: Fonts.sans, fontSize: 10, color: Colors.slate, marginTop: 1 },
  checkboxCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.outline, alignItems: 'center', justifyContent: 'center' },
  checkboxCircleActive: { borderColor: Colors.marigoldDeep, backgroundColor: 'rgba(232,163,61,0.2)' },
  studioSubInputBox: { marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: 'rgba(206,196,203,0.5)' },
  studioNameInput: { backgroundColor: Colors.alabasterCard, borderWidth: 1, borderColor: Colors.outline, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 6, fontFamily: Fonts.sans, fontSize: 12, color: Colors.inkPlum, marginTop: 2 },
  submitButton: { backgroundColor: Colors.inkPlum, borderRadius: 6, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: { fontFamily: Fonts.mono, fontSize: 12, fontWeight: '700', color: Colors.white, letterSpacing: 0.5 },
  errorBox: { marginTop: 8, backgroundColor: Colors.dustyRoseLight, borderWidth: 1, borderColor: Colors.dustyRose, borderRadius: 4, padding: 8 },
  errorText: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.dustyRoseDark, textAlign: 'center' },
  forgotForm: { padding: 16, gap: 12 },
  forgotTitle: { fontFamily: Fonts.serif, fontSize: 18, fontWeight: '700', color: Colors.inkPlum },
  forgotSubtitle: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, lineHeight: 17 },
  forgotSuccessBox: { padding: 24, alignItems: 'center', gap: 8 },
  forgotSuccessTitle: { fontFamily: Fonts.serif, fontSize: 16, fontWeight: '700', color: Colors.inkPlum },
  forgotSuccessText: { fontFamily: Fonts.sans, fontSize: 12, color: Colors.slate, textAlign: 'center', lineHeight: 17 },
  forgotBackBtn: { alignItems: 'center', paddingVertical: 8 },
  forgotBackBtnText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate },
  perforatedRow: { flexDirection: 'row', alignItems: 'center', height: 20, backgroundColor: Colors.alabasterCard },
  circleCutoutLeft: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.warmAlabaster, marginLeft: -7, borderWidth: 1, borderColor: Colors.outline },
  circleCutoutRight: { width: 14, height: 14, borderRadius: 7, backgroundColor: Colors.warmAlabaster, marginRight: -7, borderWidth: 1, borderColor: Colors.outline },
  dashedLine: { flex: 1, borderBottomWidth: 1, borderBottomColor: Colors.outline, borderStyle: 'dashed', marginHorizontal: 4 },
  demoSection: { padding: 14, backgroundColor: '#FAF7F2' },
  demoHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  demoHeaderText: { fontFamily: Fonts.mono, fontSize: 9, fontWeight: '700', color: Colors.slate, letterSpacing: 0.8 },
  demoButtonsRow: { flexDirection: 'row', gap: 8 },
  demoClientBtn: { flex: 1, backgroundColor: Colors.alabasterCard, borderWidth: 1, borderColor: Colors.outline, borderRadius: 6, padding: 10 },
  demoRoleTag: { fontFamily: Fonts.mono, fontSize: 8, fontWeight: '700', color: Colors.marigoldDeep, letterSpacing: 0.5, marginBottom: 2 },
  demoPersonName: { fontFamily: Fonts.serif, fontSize: 13, fontWeight: '700', color: Colors.inkPlum },
  demoSub: { fontFamily: Fonts.sans, fontSize: 10, color: Colors.slate, marginTop: 1 },
  demoStudioBtn: { flex: 1, backgroundColor: Colors.inkPlum, borderRadius: 6, padding: 10 },
  demoStudioTag: { fontFamily: Fonts.mono, fontSize: 8, fontWeight: '700', color: Colors.marigoldLight, letterSpacing: 0.5, marginBottom: 2 },
  demoStudioName: { fontFamily: Fonts.serif, fontSize: 13, fontWeight: '700', color: Colors.warmAlabaster },
  demoStudioSub: { fontFamily: Fonts.sans, fontSize: 10, color: Colors.outline, marginTop: 1 },
  guestLink: { marginTop: 14, alignItems: 'center', paddingVertical: 6 },
  guestLinkText: { fontFamily: Fonts.mono, fontSize: 11, color: Colors.slate, textDecorationLine: 'underline' },
});
