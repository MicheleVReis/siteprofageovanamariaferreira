import React, { useState } from 'react';
import { X, Lock, User, ArrowRight, UserPlus, KeyRound, Sparkles, Mail, CheckCircle, BookOpen, Check } from 'lucide-react';
import { CourseId, UserAccount } from '../types';
import { COURSES_CATALOG, getStoredUsers, saveUser, setCurrentUser } from '../services/storage';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'student' | 'teacher'>('student');
  const [selectedCourses, setSelectedCourses] = useState<CourseId[]>(['matematica-zero-avancado']);

  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' } | null>(null);

  if (!isOpen) return null;

  const toggleCourseSelection = (courseId: CourseId) => {
    if (selectedCourses.includes(courseId)) {
      if (selectedCourses.length === 1) return; // Mínimo 1 curso selecionado
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const users = getStoredUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // Se já houver usuário cadastrado com esse e-mail
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.password && existing.password !== loginPassword) {
        setMessage({ text: 'Senha incorreta. Verifique e tente novamente.', type: 'error' });
        return;
      }
      setCurrentUser(existing);
      onLoginSuccess(existing);
      onClose();
    } else {
      // Usuário novo fazendo login: cria e libera o curso padrão
      const newUser: UserAccount = {
        id: `user-${Date.now()}`,
        name: cleanEmail.split('@')[0].replace('.', ' '),
        email: cleanEmail,
        password: loginPassword,
        role: 'student',
        enrolledCourses: ['matematica-zero-avancado'],
        createdAt: new Date().toISOString()
      };
      saveUser(newUser);
      setCurrentUser(newUser);
      onLoginSuccess(newUser);
      onClose();
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const cleanEmail = regEmail.trim().toLowerCase();
    const users = getStoredUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setMessage({ text: 'Esse e-mail já está cadastrado. Vá para a aba "Entrar".', type: 'error' });
      return;
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      name: regName.trim(),
      email: cleanEmail,
      password: regPassword,
      role: regRole,
      enrolledCourses: regRole === 'teacher' ? ['combo-exatas-turbo'] : selectedCourses,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);
    setCurrentUser(newUser);
    setMessage({ text: 'Cadastro realizado com sucesso! Liberando acesso...', type: 'success' });

    setTimeout(() => {
      onLoginSuccess(newUser);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#3B14E2]/20 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2.5 rounded-full text-[#0D0B24]/50 hover:text-[#0D0B24] hover:bg-[#F1EDFF] transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-black text-xl font-heading shadow-md shadow-[#3B14E2]/30 shrink-0">
            <Lock className="w-6 h-6 text-[#F5A300]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2EEFF] text-[#3B14E2] text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Espaço Exclusivo</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0D0B24] leading-tight">
              Área do Aluno GEO
            </h3>
            <p className="text-xs text-[#0D0B24]/70 font-medium">
              Acesse as aulas liberadas do seu curso adquirido
            </p>
          </div>
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div
            className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2'
            }`}
          >
            {message.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Tabs de Navegação: Login ou Cadastrar */}
        <div className="grid grid-cols-2 p-1.5 bg-[#FAF8FF] rounded-2xl border border-[#EAE3FB] mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-[#3B14E2] text-white shadow-sm'
                : 'text-[#0D0B24]/70 hover:text-[#3B14E2]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Já sou Aluno (Entrar)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'register'
                ? 'bg-[#3B14E2] text-white shadow-sm'
                : 'text-[#0D0B24]/70 hover:text-[#3B14E2]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Criar Cadastro</span>
          </button>
        </div>

        {activeTab === 'login' ? (
          /* FORMULÁRIO DE LOGIN */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                E-mail cadastrado
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B14E2]/50" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all bg-[#FAF8FF] focus:bg-white text-[#0D0B24]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 font-heading">
                  Sua Senha
                </label>
                <a
                  href="https://wa.me/5535984121944?text=Olá Profa Geovana, esqueci minha senha da área do aluno"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#3B14E2] hover:underline"
                >
                  Esqueci a senha
                </a>
              </div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B14E2]/50" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Digite sua senha..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all bg-[#FAF8FF] focus:bg-white text-[#0D0B24]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#3B14E2] via-[#2F0CA8] to-[#1C0585] text-white font-bold font-heading text-[14.5px] shadow-[0_4px_16px_rgba(59,20,226,0.3)] hover:shadow-[0_6px_20px_rgba(59,20,226,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>ACESSAR MINHAS AULAS</span>
              <ArrowRight className="w-4 h-4 text-[#F5A300]" />
            </button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-[#0D0B24]/70">
                Primeira vez aqui?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#3B14E2] hover:underline"
                >
                  Criar cadastro de aluno
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* FORMULÁRIO DE CADASTRO COM SELEÇÃO DO CURSO COMPRADO */
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                Nome Completo do Aluno
              </label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B14E2]/50" />
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ex: Michele Vieira Reis"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all bg-[#FAF8FF] focus:bg-white text-[#0D0B24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                E-mail para Acesso
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B14E2]/50" />
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="michele.vieira.reis@educacao.mg.gov.br"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all bg-[#FAF8FF] focus:bg-white text-[#0D0B24]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                Criar uma Senha
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3B14E2]/50" />
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Crie uma senha segura..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all bg-[#FAF8FF] focus:bg-white text-[#0D0B24]"
                />
              </div>
            </div>

            {/* Seleção do Curso Adquirido */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 font-heading">
                  Curso(s) Adquirido(s) *
                </label>
                <span className="text-[10px] text-[#3B14E2] font-semibold">
                  Acesso liberado apenas ao curso escolhido
                </span>
              </div>
              <div className="space-y-2">
                {COURSES_CATALOG.map((course) => {
                  const isSelected = selectedCourses.includes(course.id);
                  return (
                    <div
                      key={course.id}
                      onClick={() => toggleCourseSelection(course.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#3B14E2] bg-[#F2EEFF] text-[#0D0B24]'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 text-xs font-semibold">
                        <span className="text-base">{course.icon}</span>
                        <span>{course.name}</span>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center text-white ${
                          isSelected ? 'bg-[#3B14E2]' : 'border border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#3B14E2] via-[#2F0CA8] to-[#1C0585] text-white font-bold font-heading text-[14.5px] shadow-[0_4px_16px_rgba(59,20,226,0.3)] hover:shadow-[0_6px_20px_rgba(59,20,226,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>CONCLUIR CADASTRO E ACESSAR AULAS</span>
              <ArrowRight className="w-4 h-4 text-[#F5A300]" />
            </button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-[#0D0B24]/70">
                Já tem um cadastro feito?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-[#3B14E2] hover:underline"
                >
                  Clique aqui para entrar
                </button>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
