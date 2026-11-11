import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  signup: (email: string, pass: string) => Promise<User>;
  login: (email: string, pass: string) => Promise<User>;
  loginWithGoogle: () => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signup = async (email: string, pass: string): Promise<User> => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      
      // Update state immediately
      setCurrentUser(user);

      // Initialize isolated user root document
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || email,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create account.';
      // User friendly formatting
      if (msg.includes('email-already-in-use')) {
        setAuthError('This email is already registered. Please log in.');
      } else if (msg.includes('weak-password')) {
        setAuthError('Password is too weak. Please use at least 6 characters.');
      } else if (msg.includes('invalid-email')) {
        setAuthError('Invalid email address format.');
      } else {
        setAuthError(msg);
      }
      throw err;
    }
  };

  const login = async (email: string, pass: string): Promise<User> => {
    setAuthError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      // Update state immediately so UI and navigation sync without needing double-click
      setCurrentUser(user);
      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in.';
      if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
        setAuthError('Invalid email or password combination.');
      } else if (msg.includes('too-many-requests')) {
        setAuthError('Too many failed attempts. Please try again later or reset password.');
      } else {
        setAuthError(msg);
      }
      throw err;
    }
  };

  const loginWithGoogle = async (): Promise<User> => {
    setAuthError(null);
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth');
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Update state immediately
      setCurrentUser(user);

      // Ensure user root document exists
      try {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email || 'google_user',
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }

      return user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in with Google.';
      if (!msg.includes('popup-closed-by-user')) {
        setAuthError(msg);
      }
      throw err;
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send reset email.';
      if (msg.includes('user-not-found')) {
        setAuthError('No account found with this email address.');
      } else {
        setAuthError(msg);
      }
      throw err;
    }
  };

  const activeUser = currentUser || auth.currentUser;
  const isLoggedIn = !!activeUser;

  return (
    <AuthContext.Provider
      value={{
        currentUser: activeUser,
        isLoggedIn,
        loading,
        signup,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
