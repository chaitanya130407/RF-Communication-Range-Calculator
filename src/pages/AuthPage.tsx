import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigation, PageId } from '../context/NavigationContext';
import { GlobalBackButton } from '../components/GlobalBackButton';
import { auth } from '../firebase/config';
import { User } from 'firebase/auth';
import {
  LogIn,
  UserPlus,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Radio,
  Shield,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  isLoggedIn?: boolean;
  currentUser?: User | null;
  onNavigate?: (page: PageId) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  isLoggedIn: propIsLoggedIn,
  currentUser: propCurrentUser,
  onNavigate,
}) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  const authContext = useAuth();
  const navContext = useNavigation();

  const currentUser = propCurrentUser !== undefined ? propCurrentUser : authContext.currentUser;
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : authContext.isLoggedIn;
  const navigate = onNavigate || navContext.navigate;

  const { login, signup, loginWithGoogle, resetPassword, authError, clearAuthError } = authContext;

  const effectiveIsLoggedIn = isLoggedIn || !!currentUser || !!auth.currentUser;

  // If already authenticated, redirect immediately to calculator dashboard
  React.useEffect(() => {
    if (effectiveIsLoggedIn) {
      navigate('dashboard');
    }
  }, [effectiveIsLoggedIn, navigate]);

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setLocalError(null);
    clearAuthError();
    try {
      setIsSubmitting(true);
      await loginWithGoogle();
      navigate('dashboard');
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSubmitting) return;
    setLocalError(null);
    clearAuthError();

    if (!email.trim()) {
      setLocalError('Please enter a valid email address.');
      return;
    }

    if (mode === 'forgot') {
      try {
        setIsSubmitting(true);
        await resetPassword(email.trim());
        setResetSent(true);
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setLocalError('Please enter your password.');
      return;
    }

    if (mode === 'signup') {
      if (password.length < 6) {
        setLocalError('Password must be at least 6 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }

      try {
        setIsSubmitting(true);
        const user = await signup(email.trim(), password);
        if (user) {
          navigate('dashboard');
        }
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login
      try {
        setIsSubmitting(true);
        const user = await login(email.trim(), password);
        if (user) {
          navigate('dashboard');
        }
      } catch {
        // Handled in context
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const switchMode = (newMode: 'login' | 'signup' | 'forgot') => {
    setMode(newMode);
    setLocalError(null);
    clearAuthError();
    setResetSent(false);
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 space-y-6">
      <div className="flex items-center justify-between">
        <GlobalBackButton />
        <span className="text-xs text-slate-400 font-mono">Firebase Auth</span>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            {mode === 'login' && <LogIn className="w-6 h-6" />}
            {mode === 'signup' && <UserPlus className="w-6 h-6" />}
            {mode === 'forgot' && <KeyRound className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {mode === 'login' && 'User Login'}
            {mode === 'signup' && 'Sign Up'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {mode === 'login' && 'Sign in to access your private RF calculations and dashboard.'}
            {mode === 'signup' && 'New accounts start with empty history. No fake calculations.'}
            {mode === 'forgot' && 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Error notification */}
        {(localError || authError) && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{localError || authError}</span>
          </div>
        )}

        {/* Reset Email Sent Confirmation */}
        {resetSent && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Password reset email sent! Check your inbox for instructions.</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => switchMode('forgot')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {mode !== 'forgot' && (
          <div className="space-y-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-2 text-slate-400">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Google Account</span>
            </button>
          </div>
        )}

        {/* Mode Switcher */}
        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 dark:text-slate-500">
        <Shield className="w-3.5 h-3.5 text-emerald-500" />
        <span>Firebase Authentication & Zero-Trust Firestore Security</span>
      </div>
    </div>
  );
};
