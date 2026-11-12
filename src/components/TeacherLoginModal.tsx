import React, { useEffect, useState } from 'react';
import {
  X,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  ArrowLeft,
  ShieldAlert
} from 'lucide-react';
import { UserAccount } from '../types';
import { setCurrentUser } from '../services/storage';
import {
  authenticateAdmin,
  getAdminSecurityConfig,
  getRemainingLockoutSeconds,
  recoverAdminPasswordWithKey,
  updateAdminSecurity
} from '../services/adminAuth';

interface TeacherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const TeacherLoginModal: React.FC<TeacherLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'change' | 'recover'>('login');

  // Login fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Change password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Recovery key field
  const [recoveryKey, setRecoveryKey] = useState('');

  // Status & Lockout
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState<number>(0);

  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setPassword('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setRecoveryKey('');
      setErrorMessage('');
      setSuccessMessage('');
      setLockoutSeconds(getRemainingLockoutSeconds());
    }
  }, [isOpen]);

  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      const rem = getRemainingLockoutSeconds();
      setLockoutSeconds(rem);
      if (rem <= 0) {
        setErrorMessage('');
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  if (!isOpen) return null;

  const switchMode = (nextMode: 'login' | 'change' | 'recover') => {
    setMode(nextMode);
    setErrorMessage('');
    setSuccessMessage('');
    setPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setRecoveryKey('');
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const result = authenticateAdmin(email, password);
    if (!result.success || !result.user) {
      if (result.lockedSeconds) {
        setLockoutSeconds(result.lockedSeconds);
      }
      setErrorMessage(result.error || 'Credenciais administrativas inválidas.');
      return;
    }

    const authenticatedUser = result.user;
    setSuccessMessage('Autenticação autorizada! Abrindo painel administrativo...');
    setCurrentUser(authenticatedUser);

    setTimeout(() => {
      onLoginSuccess(authenticatedUser);
      setSuccessMessage('');
      onClose();
    }, 650);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const config = getAdminSecurityConfig();
    if (email.trim().toLowerCase() !== config.email.toLowerCase()) {
      setErrorMessage('O e-mail administrativo informado não corresponde ao administrador cadastrado.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('A confirmação da nova senha não confere.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('A nova senha deve ser diferente da senha atual.');
      return;
    }

    const res = updateAdminSecurity({
      currentPassword,
      newPassword
    });

    if (!res.success) {
      setErrorMessage(res.error);
      return;
    }

    setPassword('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setMode('login');
    setSuccessMessage('✅ Senha de administradora alterada com sucesso! Entre abaixo com sua nova senha.');
  };

  const handleRecoverPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (newPassword !== confirmNewPassword) {
      setErrorMessage('A confirmação da nova senha não confere.');
      return;
    }

    const res = recoverAdminPasswordWithKey({
      email,
      recoveryKey,
      newPassword
    });

    if (!res.success) {
      setLockoutSeconds(getRemainingLockoutSeconds());
      setErrorMessage(res.error);
      return;
    }

    setRecoveryKey('');
    setNewPassword('');
    setConfirmNewPassword('');
    setMode('login');
    setSuccessMessage('✅ Senha redefinida com sucesso! Entre com sua nova senha.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/25 shrink-0">
            👑
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-black uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Acesso Exclusivo Admin</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 leading-tight">
              {mode === 'login'
                ? 'Acesso Professora'
                : mode === 'change'
                ? 'Alterar Senha Admin'
                : 'Recuperar Acesso'}
            </h3>
          </div>
        </div>

        {/* Card Informativo de Segurança */}
        <div className="mb-5 p-3.5 rounded-2xl bg-gradient-to-br from-[#FAF8FF] to-[#F2EEFF] border border-[#DDD0FE] text-xs text-slate-700 space-y-1">
          <div className="flex items-center gap-1.5 text-[#3B14E2] font-black uppercase text-[11px]">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Área Blindada da Administradora</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11.5px]">
            {mode === 'login' &&
              'Acesso restrito exclusivamente à administradora da plataforma com criptografia SHA-256 e bloqueio automático contra tentativas indevidas.'}
            {mode === 'change' &&
              'Confirme seu e-mail e sua senha atual para definir uma nova senha exclusiva de administradora.'}
            {mode === 'recover' &&
              'Informe o e-mail administrativo e a Chave Secreta de Recuperação cadastrada nas configurações de segurança do painel.'}
          </p>
        </div>

        {/* Alerta de Bloqueio Temporário */}
        {lockoutSeconds > 0 && (
          <div className="p-3.5 rounded-2xl mb-4 bg-rose-100 text-rose-900 border border-rose-300 text-xs font-bold flex items-start gap-2 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <span>
              Proteção ativa contra tentativas indevidas. Tente novamente em <strong>{lockoutSeconds}s</strong>.
            </span>
          </div>
        )}

        {/* Alerta de Erro */}
        {errorMessage && lockoutSeconds <= 0 && (
          <div className="p-3.5 rounded-2xl mb-4 bg-rose-50 text-rose-800 border border-rose-200 text-xs font-semibold flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Alerta de Sucesso */}
        {successMessage && (
          <div className="p-3.5 rounded-2xl mb-4 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-start gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODO 1: LOGIN ADMINISTRATIVO */}
        {mode === 'login' && (
          <form onSubmit={handleTeacherLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1.5 font-heading">
                E-mail da Administradora *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  disabled={lockoutSeconds > 0}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o e-mail administrativo..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all disabled:bg-slate-100"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
                  Senha de Administradora *
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('recover')}
                  className="text-[11px] font-bold text-amber-700 hover:underline cursor-pointer"
                >
                  Esqueci a senha
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  disabled={lockoutSeconds > 0}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha exclusiva..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all disabled:bg-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={() => switchMode('change')}
                className="text-xs font-extrabold text-[#3B14E2] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Alterar senha de administradora</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="w-full mt-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black font-heading text-sm shadow-md shadow-amber-400/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>ENTRAR NO PAINEL ADMINISTRATIVO</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>
          </form>
        )}

        {/* MODO 2: ALTERAR SENHA DIRETO NO MODAL (COM SENHA ATUAL) */}
        {mode === 'change' && (
          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                E-mail da Administradora *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Confirme seu e-mail administrativo..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                Senha Atual *
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
                  Nova Senha (mín. 6 caracteres) *
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  {showNewPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Crie uma nova senha forte..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                Confirmar Nova Senha *
              </label>
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white font-extrabold text-xs shadow-md hover:brightness-105 cursor-pointer"
              >
                Salvar Nova Senha
              </button>
            </div>
          </form>
        )}

        {/* MODO 3: RECUPERAÇÃO COM CHAVE SECRETA */}
        {mode === 'recover' && (
          <form onSubmit={handleRecoverPassword} className="space-y-3.5">
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                E-mail da Administradora *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Informe o e-mail administrativo..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                Chave Secreta de Recuperação *
              </label>
              <input
                type="password"
                required
                value={recoveryKey}
                onChange={(e) => setRecoveryKey(e.target.value)}
                placeholder="Chave configurada no painel de segurança..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                Nova Senha (mín. 6 caracteres) *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite a nova senha..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1 font-heading">
                Confirmar Nova Senha *
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Repita a nova senha..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
              />
            </div>

            <div className="pt-2 flex gap-2.5">
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
              <button
                type="submit"
                disabled={lockoutSeconds > 0}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md hover:brightness-105 cursor-pointer disabled:opacity-50"
              >
                Redefinir Senha
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[11.5px] text-slate-400">
            🔒 Acesso exclusivo da administradora • Sessão criptografada
          </p>
        </div>
      </div>
    </div>
  );
};
