/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, LogIn, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { signInWithGoogle, signUpWithEmail, logInWithEmail } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface AuthFormProps {
  onSuccess?: (user: FirebaseUser) => void;
  adminMode?: boolean;
}

export default function AuthForm({ onSuccess, adminMode = false }: AuthFormProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      setSuccess('Successfully authenticated via Google!');
      if (onSuccess) {
        onSuccess(user);
      }
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      // Give a helpful instruction addressing the login conflicts of Google Sign-in inside iframes
      setError(
        'Google login popup was blocked or is restricted in this browser session. ' +
        'Please use the secure Email & Password form below to sign up/in instantly!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup') {
      if (!displayName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const user = await signUpWithEmail(email, password, displayName);
        setSuccess('Account created successfully! Welcome to Zaviya.');
        if (onSuccess) onSuccess(user);
      } else {
        const user = await logInWithEmail(email, password);
        setSuccess('Logged in successfully!');
        if (onSuccess) onSuccess(user);
      }
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      let errMsg = 'Authentication failed. Please check your network and try again.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email is already in use. Please log in instead!';
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errMsg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.message) {
        errMsg = err.message;
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto neo-convex bg-[#1b1b1a] border border-white/5 p-6 md:p-8 rounded-[2rem] space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 mx-auto rounded-xl bg-[#f2ca50]/10 flex items-center justify-center border border-[#f2ca50]/20 text-[#f2ca50]">
          {adminMode ? <Shield className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </div>
        <h3 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight">
          {adminMode 
            ? (mode === 'login' ? 'Staff Authentication' : 'Staff Inductions')
            : (mode === 'login' ? 'Welcome to Zaviya' : 'Create Member Account')
          }
        </h3>
        <p className="font-sans text-xs text-[#bab8b7]/60 tracking-wider uppercase">
          {adminMode ? 'Protected Registry Access' : 'Luxury Culinary Experience'}
        </p>
      </div>

      {/* Google Login - Keep at top but advise fallback if iframe error happens */}
      <button
        onClick={handleGoogleLoginClick}
        type="button"
        disabled={loading}
        className="w-full py-3.5 px-5 bg-white/5 hover:bg-white/10 text-white rounded-xl font-sans text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.87-2.6-2.6-4.53-5.01-4.53z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        Authenticate with Google
      </button>

      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-white/5"></div>
        <span className="flex-shrink mx-4 text-[10px] font-sans font-bold text-[#bab8b7]/40 uppercase tracking-widest">or email & password</span>
        <div className="flex-grow border-t border-white/5"></div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-sans flex items-start gap-3">
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Security Alert / Connection Info</p>
            <p className="text-[#bab8b7]/90 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-sans flex items-start gap-3">
          <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="font-semibold">Verified Successfully</p>
            <p className="text-[#bab8b7]/90 leading-relaxed">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleEmailAuth} className="space-y-4">
        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#f2ca50]" />
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Chef Oliver"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-[#131313] border border-white/5 focus:border-[#f2ca50]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-[#bab8b7]/30 focus:outline-none transition-all duration-300"
              disabled={loading}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#f2ca50]" />
            Email Address
          </label>
          <input
            type="email"
            placeholder="name@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#131313] border border-white/5 focus:border-[#f2ca50]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-[#bab8b7]/30 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#f2ca50]" />
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#131313] border border-white/5 focus:border-[#f2ca50]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-[#bab8b7]/30 focus:outline-none transition-all duration-300"
            disabled={loading}
          />
        </div>

        {mode === 'signup' && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-sans font-semibold text-[#bab8b7] uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#f2ca50]" />
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-[#131313] border border-white/5 focus:border-[#f2ca50]/40 rounded-xl px-4 py-3 text-sm text-white placeholder-[#bab8b7]/30 focus:outline-none transition-all duration-300"
              disabled={loading}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 mt-2 bg-[#f2ca50] text-[#131313] hover:bg-white hover:text-[#131313] rounded-xl font-sans text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border-0 disabled:opacity-50"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setError('');
            setSuccess('');
          }}
          className="font-sans text-xs text-[#d0c5af] hover:text-[#f2ca50] transition-colors duration-200 underline underline-offset-4 cursor-pointer bg-transparent border-0"
        >
          {mode === 'login' ? "Don't have an account? Sign up now" : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );

  function handleGoogleLoginClick(e: React.MouseEvent) {
    e.preventDefault();
    handleGoogleAuth();
  }
}
