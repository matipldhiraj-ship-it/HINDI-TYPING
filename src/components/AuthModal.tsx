import React, { useState } from 'react';
import {
  X,
  User,
  Shield,
  KeyRound,
  LogOut,
  UserCheck,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';
import { KEYBOARD_LAYOUT_LIST } from '../engine/keyboardLayouts';
import { StorageService } from '../services/storageService';
import { KeyboardLayoutId, UserAccount, UserRole } from '../types/typing';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUserChanged: (user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
}) => {
  const [tab, setTab] = useState<'profile' | 'login' | 'register'>('profile');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Register Form State
  const [regUsername, setRegUsername] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('learner');
  const [regLayout, setRegLayout] = useState<KeyboardLayoutId>('inscript');
  const [regExam, setRegExam] = useState('SSC CHSL / CGL Hindi Skill Test');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = StorageService.loginUser(loginIdentifier, loginPassword);
    if (!res.success || !res.user) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      onUserChanged(res.user);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const res = StorageService.registerUser({
      username: regUsername,
      name: regName,
      email: regEmail,
      password: regPassword,
      role: regRole,
      preferredLayout: regLayout,
      targetExam: regExam,
    });
    if (!res.success || !res.user) {
      setErrorMsg(res.message);
    } else {
      setSuccessMsg(res.message);
      onUserChanged(res.user);
      setTimeout(() => {
        onClose();
        setSuccessMsg(null);
      }, 700);
    }
  };

  const handleContinueAsGuest = () => {
    const guest = StorageService.switchToGuest();
    onUserChanged(guest);
    onClose();
  };

  const handleSwitchAccount = (userId: string) => {
    const user = StorageService.setCurrentUser(userId);
    onUserChanged(user);
  };

  const allRegisteredUsers = StorageService.getUsers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {tab === 'profile'
                ? 'Learner Account & Authentication'
                : tab === 'login'
                  ? 'Sign In to Account'
                  : 'Register New Account'}
            </h2>
            <div className="text-xs text-slate-500">
              Hindi Typing Master Pro · Local Secure Identity & Progress Segregation
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => {
              setTab('profile');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'profile'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Active Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              tab === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {errorMsg && (
          <div className="px-3 py-2 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-700 dark:text-emerald-300">
            {successMsg}
          </div>
        )}

        {/* TAB 1: ACTIVE PROFILE */}
        {tab === 'profile' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">
                    {currentUser.name}
                  </div>
                  <div className="text-slate-500 font-mono-tabular">
                    @{currentUser.username} · {currentUser.email}
                  </div>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800'
                      : currentUser.role === 'guest'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                  }`}
                >
                  {currentUser.role}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <div>
                  <span className="text-slate-400">Preferred Layout:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {currentUser.preferredLayout}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400">Target Exam:</span>{' '}
                  <strong className="text-slate-800 dark:text-slate-200">
                    {currentUser.targetExam || 'General'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Quick Switch Accounts List */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-slate-500">
                Quick Switch Registered Account:
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {allRegisteredUsers.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleSwitchAccount(u.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-left transition-colors ${
                      currentUser.id === u.id
                        ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {u.name} ({u.role.toUpperCase()})
                      </div>
                      <div className="text-[10px] text-slate-500">{u.email}</div>
                    </div>
                    {currentUser.id === u.id && (
                      <span className="text-xs font-bold text-sky-600">Active</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Switch to Guest Mode (Offline)
              </button>
              <button
                type="button"
                onClick={() => setTab('login')}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700"
              >
                Sign In With Another Account
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SIGN IN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-medium text-slate-600 dark:text-slate-400">
                Email Address or Username
              </label>
              <input
                type="text"
                required
                placeholder="admin@typingmaster.in or learner"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-medium text-slate-600 dark:text-slate-400">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Enter account password (e.g. admin123)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono-tabular"
              />
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-semibold text-slate-500">Demo Account Credentials:</div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('admin@typingmaster.in');
                    setLoginPassword('admin123');
                  }}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500"
                >
                  Admin (admin123)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginIdentifier('learner@typingmaster.in');
                    setLoginPassword('learner123');
                  }}
                  className="px-2.5 py-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-sky-500"
                >
                  Learner (learner123)
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
            >
              Sign In to Account
            </button>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={handleContinueAsGuest}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Or Continue as Guest
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                Create New Account →
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs max-h-[460px] overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Verma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. priya_typist"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="Choose password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono-tabular"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Account Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold"
                >
                  <option value="learner">Learner (Personal Practice)</option>
                  <option value="admin">Administrator (Full Dashboard)</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Primary Keyboard Layout
                </label>
                <select
                  value={regLayout}
                  onChange={(e) => setRegLayout(e.target.value as KeyboardLayoutId)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {KEYBOARD_LAYOUT_LIST.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.shortName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                Target Exam or Goal
              </label>
              <input
                type="text"
                placeholder="e.g. SSC CHSL / MP CPCT / UPSSSC"
                value={regExam}
                onChange={(e) => setRegExam(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors mt-2"
            >
              Complete Registration & Sign In
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
              >
                Already have an account? Sign in here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
