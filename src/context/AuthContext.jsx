import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext(null);

/**
 * useAuth — consume auth state anywhere in the tree.
 * Returns: { user, loading, displayName, avatarInitial, signIn, signUp, signOut, resetPassword }
 */
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // true while Supabase resolves the persisted session on first load
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Resolve any existing session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Listen for future auth events (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Auth actions ──────────────────────────────────────────────────────────

  /**
   * Sign in with email + password.
   * Returns { error } — null error means success.
   */
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  /**
   * Create a new account.
   * Stores full_name in user_metadata so it's accessible everywhere.
   * Returns { error, needsConfirmation }
   */
  const signUp = async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    // Supabase returns a user even before confirmation; check identities
    // to detect if email confirmation is required.
    const needsConfirmation =
      !error && data?.user && data.user.identities?.length === 0;

    return { error, needsConfirmation };
  };

  /**
   * Sign out the current user.
   */
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  /**
   * Send a password-reset email.
   * Returns { error }
   */
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });
    return { error };
  };

  // ── Derived helpers ───────────────────────────────────────────────────────

  /** Display name from user_metadata, falling back to email prefix. */
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    '';

  /** First letter for avatar. */
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        displayName,
        avatarInitial,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
