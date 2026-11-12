import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  ArrowRight,
  UserPlus,
  KeyRound,
  Sparkles,
  Mail,
  CheckCircle,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  ShoppingBag
} from 'lucide-react';
import { CourseId, UserAccount } from '../types';
import { COURSES_CATALOG, getStoredUsers, setCurrentUser } from '../services/storage';
import { isReservedAdminEmail } from '../services/adminAuth';

interface StudentLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onOpenCheckout?: (courseId: CourseId) => void;
  initialTab?: 'login' | 'register';
  initialCourseId?: CourseId;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfUse?: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenCheckout,
  initialTab = 'login',
  initialCourseId,
  onOpenPrivacyPolicy,
  onOpenTermsOfUse,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [unregisteredError, setUnregisteredError] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'error' | 'success' | 'warning' } | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    setMessage(null);
    setUnregisteredError(false);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setUnregisteredError(false);

    const users = getStoredUsers();
    const cleanEmail = loginEmail.trim().toLowerCase();

    // 0. Proteção administrativa: e-mail da administradora só pode autenticar pelo Acesso Professora
    if (isReservedAdminEmail(cleanEmail)) {
      setMessage({
        text: 'Este e-mail pertence exclusivamente à administração. Utilize o botão "Acesso Professora" no rodapé do site com sua senha de administradora.',
        type: 'warning'
      });
      return;
    }

    // 1. Procura se existe usuário cadastrado com esse e-mail
    const existing = users.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'student');

    if (!existing) {
      // REGRA: Acesso restrito a quem já comprou! Não cria conta automática.
      setUnregisteredError(true);
      setMessage({
        text: 'Nenhum cadastro com pagamento confirmado foi localizado para este e-mail. Para acessar a Área do Aluno, é necessário adquirir um dos cursos.',
        type: 'error'
      });
      return;
    }

    // 2. Verifica senha cadastrada obrigatoriamente
    if (!existing.password || !loginPassword.trim() || existing.password !== loginPassword.trim()) {
      setMessage({
        text: 'Senha incorreta. Verifique a senha cadastrada no momento da compra.',
        type: 'error'
      });
      return;
    }

    // 3. Verifica se tem cursos aguardando aprovação da professora ou nenhum curso ativo
    if (existing.role !== 'teacher' && (!existing.enrolledCourses || existing.enrolledCourses.length === 0)) {
      if (existing.pendingCourses && existing.pendingCourses.length > 0) {
        setUnregisteredError(false);
        setMessage({
          text: `⏳ Olá, ${existing.name}! Seu cadastro e pagamento já foram registrados e estão aguardando o OK de liberação da Profa. Geovana. Assim que ela aprovar no painel, seu acesso às aulas estará liberado!`,
          type: 'warning'
        });
        return;
      }

      setUnregisteredError(true);
      setMessage({
        text: 'Identificamos o seu cadastro, mas não há nenhum curso liberado para esta conta. Conclua sua matrícula para solicitar o acesso.',
        type: 'warning'
      });
      return;
    }

    // 4. Sucesso: Usuário autenticado e com pagamento aprovado!
    setCurrentUser(existing);
    setMessage({
      text: '🎉 Acesso confirmado! Liberando sua Área do Aluno...',
      type: 'success'
    });

    setTimeout(() => {
      onLoginSuccess(existing);
      onClose();
    }, 600);
  };

  const handleGoToCheckout = (courseId: CourseId = 'matematica-zero-avancado') => {
    onClose();
    if (onOpenCheckout) {
      onOpenCheckout(courseId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/80 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-[32px] p-6 sm:p-8 shadow-2xl border border-[#3B14E2]/20 max-h-[92vh] overflow-y-auto"
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-black text-xl font-heading shadow-md shadow-[#3B14E2]/30 shrink-0">
            <Lock className="w-6 h-6 text-[#F5A300]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F2EEFF] text-[#3B14E2] text-[10.5px] font-extrabold uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Acesso Restrito</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-heading text-[#0D0B24] leading-tight">
              Área do Aluno GEO
            </h3>
          </div>
        </div>

        {/* Aviso de Regra de Acesso */}
        <div className="mb-5 p-3 rounded-2xl bg-[#FAF8FF] border border-[#E9E1FA] flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#3B14E2] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            O acesso a esta área é <strong>exclusivo para alunos com cadastro e pagamento confirmados</strong>. Informe abaixo o e-mail e a senha criados na compra.
          </p>
        </div>

        {/* Mensagem de Feedback */}
        {message && (
          <div
            className={`p-3.5 rounded-2xl mb-5 text-xs font-semibold leading-relaxed ${
              message.type === 'error'
                ? 'bg-rose-50 text-rose-800 border border-rose-200'
                : message.type === 'warning'
                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-2'
            }`}
          >
            {message.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
            {message.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 inline mr-1.5" />}
            <span>{message.text}</span>

            {/* Se o e-mail não tiver cadastro/pagamento, oferece o botão direto de matrícula */}
            {unregisteredError && (
              <div className="mt-3 pt-2.5 border-t border-rose-200/80">
                <button
                  type="button"
                  onClick={() => handleGoToCheckout('matematica-zero-avancado')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-105 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Fazer Matrícula & Liberar Meu Acesso Agora</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tabs de Navegação */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl mb-5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setMessage(null);
              setUnregisteredError(false);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-[#3B14E2] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Já sou Aluno (Entrar)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setMessage(null);
              setUnregisteredError(false);
            }}
            className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-white text-[#3B14E2] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Quero ser Aluno (Comprar)</span>
          </button>
        </div>

        {activeTab === 'login' ? (
          /* ======================================================== */
          /* FORMULÁRIO DE LOGIN DE ALUNO MATRICULADO */
          /* ======================================================== */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-heading">
                E-mail cadastrado na compra *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 font-heading">
                  Sua Senha de Acesso *
                </label>
                <a
                  href={`https://wa.me/5535984121944?text=${encodeURIComponent('Olá Profa. Geovana, preciso de ajuda com minha senha da Área do Aluno.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11.5px] font-bold text-[#3B14E2] hover:underline"
                >
                  Esqueci minha senha
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Sua senha cadastrada..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#3B14E2] via-[#2F0CA8] to-[#1C0585] text-white font-black font-heading text-sm shadow-md shadow-[#3B14E2]/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>ACESSAR MINHAS AULAS</span>
              <ArrowRight className="w-4 h-4 text-[#F5A300]" />
            </button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Ainda não comprou o curso?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-[#3B14E2] hover:underline cursor-pointer"
                >
                  Fazer matrícula & liberar aulas
                </button>
              </p>
            </div>
          </form>
        ) : (
          /* ======================================================== */
          /* ABA DE MATRÍCULA: LISTA DE CURSOS PARA COMPRA DIRETA */
          /* ======================================================== */
          <div className="space-y-4">
            <div className="p-3.5 rounded-2xl bg-[#F8F7FD] border border-[#DDD0FE] text-center">
              <span className="text-[11px] font-extrabold text-[#3B14E2] uppercase tracking-wide block mb-1">
                🔒 ACESSO LIBERADO APÓS CONFIRMAÇÃO DA PROFESSORA
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Escolha o curso desejado abaixo para preencher seus dados e concluir o pagamento. Após preencher seus dados e concluir o pagamento, a Profa. Geovana dará o OK para liberar suas aulas:
              </p>
            </div>

            <div className="space-y-2.5">
              {COURSES_CATALOG.map((course) => (
                <div
                  key={course.id}
                  className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#3B14E2] hover:shadow-md transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-2xl p-2 rounded-xl bg-[#FAF8FF] border border-slate-100 shrink-0">
                      {course.icon}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-extrabold text-[#0D0B24] truncate">
                        {course.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">Videoaulas + PDFs para download</p>
                      <span className="text-xs font-black text-[#3B14E2]">R$ {course.price},00</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGoToCheckout(course.id)}
                    className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-105 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <span>Comprar</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-200" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">
                Já concluiu o pagamento?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-[#3B14E2] hover:underline cursor-pointer"
                >
                  Entrar com e-mail e senha
                </button>
              </p>
            </div>
          </div>
        )}
        {(onOpenPrivacyPolicy || onOpenTermsOfUse) && (
          <div className="pt-2 pb-4 text-center flex items-center justify-center gap-2 text-xs text-slate-400">
            {onOpenTermsOfUse && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenTermsOfUse();
                }}
                className="hover:text-[#3B14E2] underline cursor-pointer"
              >
                Termos de Uso
              </button>
            )}
            {onOpenTermsOfUse && onOpenPrivacyPolicy && <span>•</span>}
            {onOpenPrivacyPolicy && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPrivacyPolicy();
                }}
                className="hover:text-[#3B14E2] underline cursor-pointer"
              >
                Política de Privacidade
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
