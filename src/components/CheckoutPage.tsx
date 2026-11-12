import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  Zap,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Phone,
  FileText,
  Check,
  Copy,
  Clock,
  Eye,
  EyeOff,
  Tag,
  Star,
  MessageCircle,
  HelpCircle,
  Award,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { CourseId, UserAccount } from '../types';
import {
  COURSES_CATALOG,
  getStoredUsers,
  saveUser,
  saveOrder,
  formatPhoneBR,
  formatCpfBR,
  normalizeFullName,
  isValidFullName,
  isValidPhoneBR,
  isValidCpfBR,
  formatDateTimeBR,
  INFINITEPAY_TAG,
  ADMIN_PIX_KEY,
  buildPixCopiaECola,
  buildInfinitePayCheckoutUrl,
  createInfinitePayCheckoutLink
} from '../services/storage';
import { isReservedAdminEmail } from '../services/adminAuth';

interface CheckoutCourseData {
  id: CourseId;
  title: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  currentPrice: string;
  priceValue: number;
  oldPrice: string;
  installments: string;
  discount: string;
  icon: string;
  description: string;
  benefits: string[];
}

const CHECKOUT_COURSES: Record<CourseId, CheckoutCourseData> = {
  'mentoria-vip-individual': {
    id: 'mentoria-vip-individual',
    title: 'Mentoria VIP 1-on-1 (Pacote 6 Meses)',
    badge: '💎 01 AULA POR SEMANA • 6 MESES',
    badgeColor: 'text-[#047857]',
    badgeBg: 'bg-[#ECFDF5] border border-[#A7F3D0]',
    currentPrice: 'R$ 2.879',
    priceValue: 2879,
    oldPrice: 'R$ 3.600,00',
    installments: '12x de R$ 239,92 sem juros',
    discount: 'PACOTE 6 MESES',
    icon: '💎',
    description: 'Acompanhamento individualizado semanal (01 aula por semana ao vivo via Meet) com plano sob medida e suporte no WhatsApp por 6 meses.',
    benefits: [
      '01 aula individual semanal e ao vivo via Google Meet',
      '6 meses de acompanhamento individual contínuo',
      'Plano de estudos 100% individualizado para o seu ritmo',
      'Diagnóstico contínuo e resolução comentada das suas dúvidas',
      'Acesso direto ao WhatsApp pessoal da Profa. Geovana',
      'Apoio especializado para alunos com TDAH, TEA e bloqueios',
      'Inclui acesso TOTAL e livre a todos os cursos gravados'
    ]
  },
  'mentoria-vip-10-meses': {
    id: 'mentoria-vip-10-meses',
    title: 'Mentoria VIP 1-on-1 (Plano 10 Meses)',
    badge: '💎 ANO COMPLETO • 10 MESES',
    badgeColor: 'text-[#7C3AED]',
    badgeBg: 'bg-[#FAF5FF] border border-[#E9D5FF]',
    currentPrice: 'R$ 4.500',
    priceValue: 4500,
    oldPrice: 'R$ 5.500,00',
    installments: '12x de R$ 375,00 sem juros',
    discount: 'PLANO 10 MESES',
    icon: '💎',
    description: 'Acompanhamento individual completo por 10 meses de estudo (janeiro e fevereiro não tem aula, férias).',
    benefits: [
      '01 aula individual semanal ao vivo via Google Meet por 10 meses',
      '10 meses de acompanhamento escolar e preparação para ENEM / vestibulares',
      'Janeiro e fevereiro não têm aula (período de férias)',
      'Plano de estudos 100% individualizado para o seu ritmo',
      'Acesso direto ao WhatsApp pessoal da Profa. Geovana',
      'Apoio especializado para alunos com TDAH, TEA e bloqueios',
      'Inclui acesso TOTAL e livre a todos os cursos gravados'
    ]
  },
  'matematica-zero-avancado': {
    id: 'matematica-zero-avancado',
    title: 'Matemática do Zero ao Avançado',
    badge: 'MAIS PROCURADO',
    badgeColor: 'text-[#3B14E2]',
    badgeBg: 'bg-[#F2EEFF] border border-[#DDD0FE]',
    currentPrice: 'R$ 297',
    priceValue: 297,
    oldPrice: 'R$ 497,00',
    installments: '12x de R$ 24,75 sem juros',
    discount: '40% OFF',
    icon: '📐',
    description: 'Curso completo do básico ao avançado com resolução passo a passo e PDFs comentados.',
    benefits: [
      'Curso completo de Matemática do básico ao avançado',
      'Método GEO com resolução passo a passo sem decoreba',
      'Cadernos e listas de exercícios em PDF com gabarito',
      'Plantão de dúvidas direto no WhatsApp da professora',
      'Acesso livre por 1 ano + todas as atualizações',
      'Certificado digital oficial de conclusão'
    ]
  },
  'fisica-descomplicada': {
    id: 'fisica-descomplicada',
    title: 'Física Descomplicada & Prática',
    badge: 'TEORIA + PRÁTICA',
    badgeColor: 'text-[#7C3AED]',
    badgeBg: 'bg-[#FAF5FF] border border-[#E9D5FF]',
    currentPrice: 'R$ 297',
    priceValue: 297,
    oldPrice: 'R$ 497,00',
    installments: '12x de R$ 24,75 sem juros',
    discount: '40% OFF',
    icon: '⚡',
    description: 'Física sem complicação: mecânica, eletricidade, termologia e óptica com mapas mentais.',
    benefits: [
      'Todas as frentes da Física explicadas de forma intuitiva',
      'Resoluções comentadas em vídeo das últimas edições do ENEM',
      'Mapas mentais e formulários inteligentes em PDF para baixar',
      'Suporte direto no WhatsApp para tirar suas dúvidas',
      'Acesso livre por 1 ano completo à plataforma',
      'Simulados temáticos com cronômetro para treino'
    ]
  }
};

interface CheckoutPageProps {
  initialCourseId?: CourseId;
  onBack: () => void;
  onPaymentSuccess: (user: UserAccount) => void;
  onOpenPrivacyPolicy?: () => void;
  onOpenTermsOfUse?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialCourseId = 'mentoria-vip-individual',
  onBack,
  onPaymentSuccess,
  onOpenPrivacyPolicy,
  onOpenTermsOfUse,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(initialCourseId);
  const [paymentMethod, setPaymentMethod] = useState<'infinitepay' | 'pix' | 'credit_card'>('infinitepay');

  useEffect(() => {
    if (initialCourseId) {
      setSelectedCourseId(initialCourseId);
    }
  }, [initialCourseId]);

  // Dados do Comprador
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Cartão de Crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  // Cupom de Desconto
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPercent: number } | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isCopiedPix, setIsCopiedPix] = useState(false);
  const [isCopiedPixKey, setIsCopiedPixKey] = useState(false);
  const [isCopiedInfiniteLink, setIsCopiedInfiniteLink] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [registeredAtIso, setRegisteredAtIso] = useState<string>('');

  const currentCourse = CHECKOUT_COURSES[selectedCourseId] || CHECKOUT_COURSES['mentoria-vip-individual'];

  // Cálculo de desconto e total
  const basePrice = currentCourse.priceValue;
  const couponDiscountValue = appliedCoupon ? Math.round((basePrice * appliedCoupon.discountPercent) / 100) : 0;
  const finalPrice = Math.max(0, basePrice - couponDiscountValue);

  // Links & Códigos de Pagamento (vinculados à InfiniteTag oficial da administradora: $geovana-maria-885)
  const infinitePayLink = buildInfinitePayCheckoutUrl({
    courseId: selectedCourseId,
    courseTitle: currentCourse.title,
    amountReais: finalPrice,
    customerName: fullName,
    customerEmail: email,
    customerPhone: phone
  });
  const pixCode = buildPixCopiaECola(finalPrice);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopiedPix(true);
    setTimeout(() => setIsCopiedPix(false), 3000);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(ADMIN_PIX_KEY);
    setIsCopiedPixKey(true);
    setTimeout(() => setIsCopiedPixKey(false), 3000);
  };

  const handleCopyInfiniteLink = () => {
    navigator.clipboard.writeText(infinitePayLink);
    setIsCopiedInfiniteLink(true);
    setTimeout(() => setIsCopiedInfiniteLink(false), 3000);
  };

  const handleOpenInfinitePayCheckout = async () => {
    const url = await createInfinitePayCheckoutLink({
      courseId: selectedCourseId,
      courseTitle: currentCourse.title,
      amountReais: finalPrice,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const cleanCode = couponCode.trim().toUpperCase();

    if (!cleanCode) {
      setCouponError('Digite um código de cupom.');
      return;
    }

    if (cleanCode === 'GEO10' || cleanCode === 'ENEM10' || cleanCode === 'ALUNO10') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 10 });
      setCouponCode('');
    } else if (cleanCode === 'GEO15' || cleanCode === 'PRIMEIRACOMPRA') {
      setAppliedCoupon({ code: cleanCode, discountPercent: 15 });
      setCouponCode('');
    } else {
      setCouponError('Cupom inválido ou expirado. Tente GEO10');
    }
  };

  const handleFinishPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const normalizedName = normalizeFullName(fullName);
    const cleanEmail = email.trim().toLowerCase();
    const formattedPhone = formatPhoneBR(phone);
    const formattedCpf = formatCpfBR(cpf);
    const cleanPassword = password.trim();

    if (!isValidFullName(normalizedName)) {
      setFormError('Por favor, preencha o Nome Completo do aluno (nome e sobrenome, sem números).');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(cleanEmail)) {
      setFormError('Por favor, informe um e-mail válido (exemplo: aluno@email.com).');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    if (isReservedAdminEmail(cleanEmail)) {
      setFormError('Este e-mail é reservado exclusivamente para a administração da plataforma. Informe o e-mail pessoal do aluno.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    if (!isValidPhoneBR(formattedPhone)) {
      setFormError('Por favor, informe um número de WhatsApp válido com DDD (10 ou 11 dígitos), ex: (35) 99999-9999.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    if (!isValidCpfBR(formattedCpf)) {
      setFormError('Por favor, informe um CPF válido com os 11 dígitos.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    if (cleanPassword.length < 6) {
      setFormError('Por favor, crie uma senha de acesso com no mínimo 6 caracteres.');
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    if (paymentMethod === 'credit_card') {
      const cardDigits = cardNumber.replace(/\D/g, '');
      const cvvDigits = cardCvv.replace(/\D/g, '');
      if (cardDigits.length < 13 || !cardName.trim() || cardExp.trim().length < 5 || cvvDigits.length < 3) {
        setFormError('Preencha todos os dados do cartão de crédito corretamente (número, nome, validade MM/AA e CVV).');
        window.scrollTo({ top: 450, behavior: 'smooth' });
        return;
      }
    }

    setFullName(normalizedName);
    setPhone(formattedPhone);
    setCpf(formattedCpf);
    setIsProcessing(true);

    setTimeout(() => {
      const registrationDateIso = new Date().toISOString();
      setRegisteredAtIso(registrationDateIso);
      setIsProcessing(false);
      setIsSuccess(true);

      const users = getStoredUsers();
      let user = users.find((u) => u.email.toLowerCase() === cleanEmail && u.role === 'student');

      if (user) {
        user.name = normalizedName;
        user.phone = formattedPhone;
        if (!user.password) {
          user.password = cleanPassword;
        }
        user.role = 'student';
        // Atualiza a data de cadastro para o dia exato em que o aluno realizou o cadastro/compra
        user.createdAt = registrationDateIso;
        user.enrolledCourses = user.enrolledCourses || [];
        user.pendingCourses = user.pendingCourses || [];
        // Adiciona SOMENTE o curso pago em pendingCourses (só será liberado após confirmação da administradora)
        if (
          !user.enrolledCourses.includes(selectedCourseId) &&
          !user.pendingCourses.includes(selectedCourseId)
        ) {
          user.pendingCourses.push(selectedCourseId);
        }
        saveUser(user);
      } else {
        user = {
          id: `user-${Date.now()}`,
          name: normalizedName,
          email: cleanEmail,
          phone: formattedPhone,
          password: cleanPassword,
          role: 'student',
          // Nenhum curso começa liberado: fica aguardando confirmação da administradora
          enrolledCourses: [],
          pendingCourses: [selectedCourseId],
          createdAt: registrationDateIso
        };
        saveUser(user);
      }

      saveOrder({
        id: `ord-${Date.now()}`,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: user.phone,
        courseId: selectedCourseId,
        courseTitle: currentCourse.title,
        amount: finalPrice,
        paymentMethod: paymentMethod,
        status: 'pending',
        createdAt: registrationDateIso
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1300);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FB] text-[#0D0B24] font-body flex flex-col">
      {/* ======================================================== */}
      {/* 1. TOP HEADER DE CHECKOUT SEGURO */}
      {/* ======================================================== */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/90 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <button
          onClick={onBack}
          type="button"
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#3B14E2] bg-slate-100 hover:bg-[#F2EEFF] px-3.5 py-2 rounded-full transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Site</span>
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-black text-sm shadow-sm font-heading">
            GEO
          </div>
          <div className="text-left">
            <h1 className="text-sm sm:text-base font-black font-heading tracking-tight text-[#0D0B24] leading-none">
              Checkout Seguro
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">Matrícula Oficial da Profa. Geovana</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50 border border-emerald-200/90 px-3 py-1.5 rounded-full text-[11px] sm:text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="hidden sm:inline">Ambiente Criptografado SSL 256 bits</span>
            <span className="sm:hidden">100% Seguro</span>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. TELA DE SUCESSO / CONFIRMAÇÃO */}
      {/* ======================================================== */}
      {isSuccess ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 text-center border-2 border-amber-400 shadow-2xl animate-fadeIn">
            <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-amber-500/20">
              <Clock className="w-11 h-11" />
            </div>
            <div className="inline-block px-3.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-100 text-emerald-800 mb-3">
              Cadastro & Pagamento Registrados!
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 mb-2.5">
              Aguardando Liberação da Administradora
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
              Recebemos seu cadastro e o pedido referente exclusivamente ao curso <strong>{currentCourse.title}</strong> via <strong>{paymentMethod === 'infinitepay' ? 'InfinitePay' : paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}</strong>.
              Assim que a <strong>Profa. Geovana</strong> confirmar e der o <strong>OK</strong> no painel administrativo, as aulas deste curso serão liberadas na sua Área do Aluno!
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#DDD0FE] text-left text-xs text-slate-700 mb-6 space-y-1.5">
              <div className="font-extrabold text-[#3B14E2] uppercase tracking-wider text-[10.5px]">
                Resumo do seu cadastro registrado:
              </div>
              <div>
                <strong>Aluno(a):</strong> {normalizeFullName(fullName)}
              </div>
              <div>
                <strong>WhatsApp:</strong> {formatPhoneBR(phone)}
              </div>
              <div>
                <strong>E-mail de login:</strong> {email.trim().toLowerCase()}
              </div>
              <div>
                <strong>Curso solicitado:</strong> {currentCourse.title}
              </div>
              {paymentMethod === 'infinitepay' && (
                <div>
                  <strong>Recebedor InfinitePay:</strong>{' '}
                  <span className="font-mono font-bold text-emerald-700">{INFINITEPAY_TAG}</span> (Profa. Geovana Ferreira)
                </div>
              )}
              <div>
                <strong>Data do cadastro:</strong> {formatDateTimeBR(registeredAtIso).date} às {formatDateTimeBR(registeredAtIso).time}
              </div>
            </div>

            {paymentMethod === 'infinitepay' && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleOpenInfinitePayCheckout}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#0D0B24] hover:bg-[#191545] text-[#00FF85] border-2 border-[#00FF85]/50 font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Abrir Link de Pagamento no InfinitePay ({INFINITEPAY_TAG})</span>
                </button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/5535984121944?text=${encodeURIComponent(`Olá Profa. Geovana! Acabei de realizar meu cadastro e pagamento do curso ${currentCourse.title} com o e-mail ${email.trim().toLowerCase()}. Aguardo seu OK para liberação das aulas!`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-105 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Avisar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={onBack}
                className="py-3.5 px-5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all cursor-pointer"
              >
                Voltar ao Site
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* 3. CONTEÚDO PRINCIPAL DO CHECKOUT */
        /* ======================================================== */
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          
          {/* Faixa de Segurança e Vantagens */}
          <div className="mb-6 bg-gradient-to-r from-[#200A63] via-[#3B14E2] to-[#1F0C60] rounded-2xl p-3 sm:p-4 text-white flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#F5A300]" />
              </div>
              <span className="text-xs sm:text-sm font-bold">
                Matrícula segura: Acesso liberado na Área do Aluno após confirmação da Profa. Geovana
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Garantia de 7 dias
              </span>
              <span className="hidden md:flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-300" /> Pagamento 100% Protegido
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ======================================================== */}
            {/* COLUNA ESQUERDA: COMPRA EXCLUSIVA DO CURSO ESCOLHIDO */}
            {/* ======================================================== */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* CARD DESTAQUE DO CURSO ESCOLHIDO (SOMENTE O CURSO ESCOLHIDO) */}
              <section className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#3B14E2]/25 shadow-md bg-gradient-to-br from-[#FAF8FF] to-white relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      Curso Escolhido:
                    </span>
                    <span className={`text-[10.5px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${currentCourse.badgeBg} ${currentCourse.badgeColor}`}>
                      {currentCourse.badge}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-amber-600" />
                    Garantia 7 dias
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#DDD0FE] text-2xl flex items-center justify-center shrink-0 shadow-xs">
                      {currentCourse.icon}
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black font-heading text-[#0D0B24] leading-tight">
                        {currentCourse.title}
                      </h2>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {currentCourse.description}
                      </p>
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200/70 w-full sm:w-auto flex sm:flex-col justify-between items-baseline sm:items-end">
                    <div>
                      <span className="text-xs text-slate-400 line-through mr-2 sm:mr-0 sm:block">
                        De {currentCourse.oldPrice}
                      </span>
                      <span className="text-2xl font-black text-[#3B14E2] font-heading block leading-tight">
                        {currentCourse.currentPrice}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium sm:block">
                        ou {currentCourse.installments}
                      </span>
                    </div>
                  </div>
                </div>

                {(selectedCourseId === 'mentoria-vip-individual' || selectedCourseId === 'mentoria-vip-10-meses') && (
                  <div className="mt-4 pt-3.5 border-t border-slate-200/80">
                    <span className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-500 block mb-2">
                      Planos da Mentoria VIP (1x até 12x sem juros em ambos os planos):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedCourseId('mentoria-vip-individual')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedCourseId === 'mentoria-vip-individual'
                            ? 'bg-[#F2EEFF] border-[#3B14E2] ring-2 ring-[#3B14E2]/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#0D0B24]">Pacote 6 Meses</span>
                          <span className="text-xs font-black text-[#3B14E2]">R$ 2.879,00</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                          1x até 12x de R$ 239,92 sem juros
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedCourseId('mentoria-vip-10-meses')}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedCourseId === 'mentoria-vip-10-meses'
                            ? 'bg-[#F2EEFF] border-[#3B14E2] ring-2 ring-[#3B14E2]/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#0D0B24]">Plano 10 Meses</span>
                          <span className="text-xs font-black text-[#3B14E2]">R$ 4.500,00</span>
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                          1x até 12x de R$ 375,00 sem juros
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* FORMULÁRIO DE MATRÍCULA E DADOS DO ALUNO */}
              <form id="checkout-form" onSubmit={handleFinishPurchase} className="space-y-6">
                
                {/* ETAPA 1: DADOS DO ALUNO */}
                <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center text-xs font-black shadow-xs">
                        1
                      </span>
                      Dados do Aluno para Cadastro & Acesso
                    </h3>
                    <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                      Campos obrigatórios (*)
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                    💡 <strong>Importante:</strong> Preencha seus dados corretamente. O curso adquirido será liberado utilizando o e-mail e senha abaixo após a confirmação da administradora.
                  </p>

                  {formError && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2 animate-fadeIn">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="space-y-3.5">
                    {/* Nome Completo */}
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                        Nome Completo do Aluno (Nome e Sobrenome) *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value.replace(/[0-9]/g, ''));
                            if (formError) setFormError('');
                          }}
                          onBlur={() => {
                            if (fullName.trim()) {
                              setFullName(normalizeFullName(fullName));
                            }
                          }}
                          placeholder="Ex: Mariana Silva Souza"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                        />
                      </div>
                    </div>

                    {/* Email & Telefone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          E-mail para liberar as aulas *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => {
                              setEmail(e.target.value.trim());
                              if (formError) setFormError('');
                            }}
                            placeholder="seuemail@exemplo.com"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          WhatsApp com DDD *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            required
                            maxLength={15}
                            value={phone}
                            onChange={(e) => {
                              setPhone(formatPhoneBR(e.target.value));
                              if (formError) setFormError('');
                            }}
                            placeholder="(35) 99999-9999"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* CPF & Senha */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          CPF do Aluno ou Responsável *
                        </label>
                        <div className="relative">
                          <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            required
                            maxLength={14}
                            value={cpf}
                            onChange={(e) => {
                              setCpf(formatCpfBR(e.target.value));
                              if (formError) setFormError('');
                            }}
                            placeholder="000.000.000-00"
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Crie sua Senha de Acesso *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              if (formError) setFormError('');
                            }}
                            placeholder="Mínimo 6 caracteres"
                            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
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
                    </div>
                  </div>
                </section>

                {/* ETAPA 2: FORMAS DE PAGAMENTO COM INFINITEPAY */}
                <section className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base sm:text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-full bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center text-xs font-black shadow-xs">
                        2
                      </span>
                      Forma de Pagamento
                    </h3>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      Aprovação em Segundos
                    </span>
                  </div>

                  {/* 3 Abas de Pagamento: InfinitePay, PIX e Cartão */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-5 text-xs font-extrabold font-heading">
                    {/* InfinitePay (Destaque) */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('infinitepay')}
                      className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer relative ${
                        paymentMethod === 'infinitepay'
                          ? 'bg-[#0D0B24] text-[#00FF85] shadow-md shadow-[#0D0B24]/20'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <Zap className="w-4 h-4 text-[#00FF85]" />
                      <span>InfinitePay</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-[#00FF85]/20 text-[#00FF85]">
                        Top
                      </span>
                    </button>

                    {/* PIX */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'bg-white text-emerald-700 shadow-sm border border-emerald-200/60'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>PIX (Imediato)</span>
                    </button>

                    {/* Cartão de Crédito */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-3 px-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        paymentMethod === 'credit_card'
                          ? 'bg-white text-[#3B14E2] shadow-sm border border-[#DDD0FE]'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#3B14E2]" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {/* ======================================================== */}
                  {/* VISUAL INFINITEPAY */}
                  {/* ======================================================== */}
                  {paymentMethod === 'infinitepay' && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0D0B24] via-[#151238] to-[#1E174D] text-white border-2 border-[#00FF85]/40 space-y-4 shadow-lg shadow-[#0D0B24]/10">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#00FF85] text-[#0D0B24] flex items-center justify-center font-black text-sm">
                            <Zap className="w-5 h-5 fill-[#0D0B24]" />
                          </div>
                          <div>
                            <span className="text-sm font-black font-heading text-white tracking-wide block">
                              InfinitePay by CloudWalk
                            </span>
                            <span className="text-[10.5px] text-[#00FF85] font-semibold">
                              Pagamento Inteligente • Pix ou Cartão até 12x
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 border border-white/15">
                          Taxa Zero • Seguro
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        Pague com toda a rapidez e segurança da tecnologia InfinitePay. Aceita <strong>PIX instantâneo</strong>, <strong>Cartão de Crédito parcelado em até 12x</strong>, além de <strong>Apple Pay</strong> e <strong>Google Pay</strong>.
                      </p>

                      {/* Box do Link e QR Code InfinitePay */}
                      <div className="bg-white/5 rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#00FF85]/10 border border-[#00FF85]/30 flex items-center justify-center text-[#00FF85] shrink-0">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white block">
                              Checkout Express InfinitePay ({INFINITEPAY_TAG})
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Recebedor oficial: <strong className="text-white">{INFINITEPAY_TAG}</strong> • Total: <strong className="text-[#00FF85] font-heading font-black">R$ {finalPrice},00</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0">
                          <button
                            type="button"
                            onClick={handleOpenInfinitePayCheckout}
                            className="w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-black bg-[#00FF85] hover:brightness-105 text-slate-950 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Abrir InfinitePay</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleCopyInfiniteLink}
                            className={`w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                              isCopiedInfiniteLink
                                ? 'bg-[#00FF85] text-slate-950 font-black'
                                : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                            }`}
                          >
                            {isCopiedInfiniteLink ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>✓ LINK COPIADO!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Link</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Instruções de Aprovação Automática */}
                      <div className="text-[11.5px] text-slate-300 space-y-1.5 pt-1 bg-white/5 p-3 rounded-xl border border-white/10">
                        <div className="flex items-center gap-1.5 text-[#00FF85] font-bold text-xs">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>Validação & Liberação Segura pela Professora</span>
                        </div>
                        <p className="leading-relaxed text-slate-300">
                          Ao clicar no botão verde abaixo <strong>"CONCLUIR MATRÍCULA COM INFINITEPAY"</strong>, seu cadastro e pagamento são enviados diretamente para o painel da Profa. Geovana aprovar e liberar suas aulas!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* VISUAL PIX OTIMIZADO */}
                  {/* ======================================================== */}
                  {paymentMethod === 'pix' && (
                    <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-emerald-50/30 border border-emerald-200 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs sm:text-sm uppercase tracking-wide">
                          <Zap className="w-4 h-4 text-emerald-600" />
                          <span>Pagamento Instantâneo via PIX</span>
                        </div>
                        <span className="text-[11px] font-bold bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Sem Taxas
                        </span>
                      </div>

                      {/* Simulador de QR Code e Chave Pix */}
                      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-emerald-200/80 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-xs">
                        <div className="relative p-2.5 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 flex flex-col items-center justify-center shrink-0">
                          <QrCode className="w-24 h-24 text-slate-800" />
                          <span className="text-[9px] font-bold text-emerald-700 uppercase mt-1">Escaneie com seu banco</span>
                        </div>

                        <div className="flex-1 w-full text-left">
                          <div className="mb-3 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 block">
                                Chave PIX Oficial (InfinitePay / Jim):
                              </span>
                              <span className="text-xs sm:text-sm font-black font-mono text-slate-900 select-all">
                                {ADMIN_PIX_KEY}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyPixKey}
                              className={`py-1.5 px-3 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 ${
                                isCopiedPixKey
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300'
                              }`}
                            >
                              {isCopiedPixKey ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Chave Copiada!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copiar Chave PIX</span>
                                </>
                              )}
                            </button>
                          </div>

                          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block mb-1">
                            Código Pix Copia e Cola:
                          </span>
                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-mono break-all line-clamp-2 select-all mb-2.5">
                            {pixCode}
                          </div>

                          <button
                            type="button"
                            onClick={handleCopyPix}
                            className={`w-full sm:w-auto py-2.5 px-4 rounded-xl text-xs font-bold font-heading transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                              isCopiedPix
                                ? 'bg-emerald-600 text-white'
                                : 'bg-[#0D0B24] hover:bg-[#3B14E2] text-white'
                            }`}
                          >
                            {isCopiedPix ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>✓ CÓDIGO PIX COPIADO!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>COPIAR CÓDIGO PIX</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Instruções Passo a Passo */}
                      <div className="text-xs text-slate-600 space-y-1.5 pt-1">
                        <p className="font-bold text-slate-800">Como funciona:</p>
                        <ol className="list-decimal list-inside space-y-1 pl-1 text-[11.5px] leading-relaxed text-slate-600">
                          <li>Abra o aplicativo do seu banco e escolha <strong>Pix Copia e Cola</strong>.</li>
                          <li>Cole o código copiado acima ou aponte a câmera para o QR Code.</li>
                          <li>Confirme o valor de <strong>R$ {finalPrice},00</strong> e finalize abaixo para enviar para liberação da Profa. Geovana!</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* ======================================================== */}
                  {/* VISUAL CARTÃO DE CRÉDITO OTIMIZADO */}
                  {/* ======================================================== */}
                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3.5 pt-1">
                      {/* Bandeiras de Cartão */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-600">Cartões aceitos:</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500">
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">VISA</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">MASTERCARD</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">ELO</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200">HIPERCARD</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Número do Cartão de Crédito
                        </label>
                        <div className="relative">
                          <CreditCard className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                          Nome impresso no Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="Como está escrito no cartão"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-center focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3.5 py-3 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium text-center focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-1">
                            Parcelas (Sem Juros)
                          </label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full px-2 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none transition-all cursor-pointer"
                          >
                            {Array.from({ length: 12 }, (_, idx) => idx + 1).map((n) => {
                              const installmentValue = (finalPrice / n).toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              });
                              return (
                                <option key={n} value={String(n)}>
                                  {n === 1
                                    ? `1x de R$ ${installmentValue} à vista (sem juros)`
                                    : `${n}x de R$ ${installmentValue} sem juros`}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                {/* ======================================================== */}
                {/* 4. BOTÃO DE COMPRA DE ALTA CONVERSÃO */}
                {/* ======================================================== */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`group relative w-full py-4 sm:py-5 px-6 rounded-2xl active:scale-[0.99] transition-all duration-300 cursor-pointer overflow-hidden border ${
                      paymentMethod === 'infinitepay'
                        ? 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 hover:from-emerald-400 hover:via-emerald-500 hover:to-green-600 shadow-[0_12px_32px_rgba(16,185,129,0.4)] border-emerald-400/40'
                        : 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-700 hover:from-emerald-400 hover:via-emerald-500 hover:to-green-600 shadow-[0_12px_32px_rgba(16,185,129,0.38)] border-emerald-400/30'
                    }`}
                  >
                    {/* Efeito de Brilho Dinâmico */}
                    <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center justify-center">
                      {isProcessing ? (
                        <div className="flex items-center gap-2.5 text-white font-black font-heading text-base sm:text-lg">
                          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                          </svg>
                          <span>Processando Matrícula com Segurança...</span>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-white font-black font-heading text-base sm:text-lg tracking-wide uppercase text-center">
                            <Lock className="w-5 h-5 text-emerald-200 shrink-0" />
                            <span>
                              {paymentMethod === 'infinitepay'
                                ? `PAGAR COM INFINITEPAY • R$ ${finalPrice},00`
                                : paymentMethod === 'pix'
                                ? `CONCLUIR MATRÍCULA NO PIX • R$ ${finalPrice},00`
                                : `CONCLUIR NO CARTÃO • R$ ${finalPrice},00`}
                            </span>
                            <ArrowRight className="w-5 h-5 text-emerald-200 group-hover:translate-x-1.5 transition-transform shrink-0" />
                          </div>
                          <span className="text-[11.5px] font-bold text-emerald-100 tracking-normal mt-0.5">
                            🔒 Enviar Matrícula para Liberação — {currentCourse.title}
                          </span>
                        </>
                      )}
                    </div>
                  </button>

                                    {/* Selos de Confiança abaixo do botão */}
                  <div className="mt-3.5 flex flex-wrap items-center justify-center gap-4 text-center text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" />
                      Criptografia SSL 256 bits
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Garantia Incondicional de 7 Dias
                    </span>
                    <span className="flex items-center gap-1.5 font-semibold">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      Processamento InfinitePay
                    </span>
                  </div>

                  {(onOpenPrivacyPolicy || onOpenTermsOfUse) && (
                    <div className="mt-3 text-center">
                      <p className="text-[11.5px] text-slate-500">
                        Ao prosseguir com a matrícula, você concorda com nossos{' '}
                        {onOpenTermsOfUse && (
                          <button
                            type="button"
                            onClick={onOpenTermsOfUse}
                            className="text-[#3B14E2] font-semibold underline hover:text-[#2509A6] cursor-pointer"
                          >
                            Termos de Uso
                          </button>
                        )}
                        {onOpenTermsOfUse && onOpenPrivacyPolicy && ' e '}
                        {onOpenPrivacyPolicy && (
                          <button
                            type="button"
                            onClick={onOpenPrivacyPolicy}
                            className="text-[#3B14E2] font-semibold underline hover:text-[#2509A6] cursor-pointer"
                          >
                            Política de Privacidade
                          </button>
                        )}
                        .
                      </p>
                    </div>
                  )}
                </div>

              </form>

            </div>

            {/* ======================================================== */}
            {/* COLUNA DIREITA: RESUMO DO PEDIDO STICKY (5 COLS) */}
            {/* ======================================================== */}
            <aside className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm sticky top-20">
                
                {/* Header Resumo */}
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-heading">
                    Resumo do Pedido
                  </h3>
                  <span className="text-[11px] font-extrabold text-[#3B14E2] bg-[#F2EEFF] px-2.5 py-0.5 rounded-full">
                    Matrícula Oficial
                  </span>
                </div>

                {/* Card do Curso Selecionado */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#12082E] via-[#1E0F4E] to-[#2B1470] text-white relative overflow-hidden mb-4 shadow-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#F5A300] text-slate-950">
                      {currentCourse.badge}
                    </span>
                    <span className="text-xl">{currentCourse.icon}</span>
                  </div>

                  <h4 className="text-base font-extrabold font-heading text-white leading-tight mb-2">
                    {currentCourse.title}
                  </h4>

                  <p className="text-[11.5px] text-slate-300 leading-relaxed mb-3">
                    {currentCourse.description}
                  </p>

                  <div className="flex items-baseline gap-2 pt-2 border-t border-white/10">
                    <span className="text-xs text-slate-400 line-through">{currentCourse.oldPrice}</span>
                    <span className="text-2xl font-black text-[#F5A300] font-heading">{currentCourse.currentPrice}</span>
                    <span className="text-xs text-slate-300">à vista</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium block">ou {currentCourse.installments}</span>
                </div>

                {/* Método Selecionado Resumo */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-semibold">Forma de pagamento:</span>
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      {paymentMethod === 'infinitepay' ? (
                        <>
                          <Zap className="w-3.5 h-3.5 text-emerald-600" />
                          <span>InfinitePay</span>
                        </>
                      ) : paymentMethod === 'pix' ? (
                        <>
                          <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PIX</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5 text-[#3B14E2]" />
                          <span>Cartão de Crédito</span>
                        </>
                      )}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Liberado na hora
                  </span>
                </div>

                {/* O Que Está Incluso */}
                <div className="space-y-2 mb-5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 font-heading">
                    O que está incluso na sua matrícula:
                  </h4>
                  {currentCourse.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Campo Cupom de Desconto Interativo */}
                <div className="pt-3 border-t border-slate-100 mb-4">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Possui cupom? (Ex: GEO10)"
                        className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200 text-xs uppercase font-bold focus:border-[#3B14E2] outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-[#3B14E2] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                  {couponError && (
                    <p className="text-[11px] text-red-500 mt-1 font-semibold">{couponError}</p>
                  )}
                  {appliedCoupon && (
                    <div className="mt-1.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800 font-bold">
                      <span>✓ Cupom {appliedCoupon.code} aplicado ({appliedCoupon.discountPercent}% OFF)</span>
                      <button
                        type="button"
                        onClick={() => setAppliedCoupon(null)}
                        className="text-emerald-700 hover:text-red-600 font-bold ml-2 underline text-[10px]"
                      >
                        Remover
                      </button>
                    </div>
                  )}
                </div>

                {/* Discriminação de Valores */}
                <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Preço de tabela</span>
                    <span className="line-through">{currentCourse.oldPrice}</span>
                  </div>

                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto promocional</span>
                    <span>{currentCourse.discount}</span>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Desconto Cupom ({appliedCoupon.code})</span>
                      <span>- R$ {couponDiscountValue},00</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-900 font-black text-base pt-2.5 border-t border-slate-200">
                    <span className="font-heading">Total a pagar</span>
                    <span className="text-[#3B14E2] font-heading text-xl">R$ {finalPrice},00</span>
                  </div>
                </div>

                {/* Selo Garantia de 7 Dias */}
                <div className="mt-5 p-3 rounded-2xl bg-[#FAF8FF] border border-[#DDD0FE] flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-[#3B14E2]" />
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 font-heading">Garantia Incondicional de 7 Dias</h5>
                    <p className="text-[11px] text-slate-600 leading-snug">
                      Se não se adaptar à mentoria, devolvemos 100% do valor sem burocracia.
                    </p>
                  </div>
                </div>

                {/* Dúvidas com a Professora no WhatsApp */}
                <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11.5px] text-slate-600 font-medium">
                    Dúvidas sobre a matrícula?{' '}
                    <a
                      href={`https://wa.me/5535984121944?text=${encodeURIComponent(`Olá Profa. Geovana! Gostaria de tirar algumas dúvidas sobre a forma de pagamento do ${currentCourse.title}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:text-emerald-700 underline inline-flex items-center gap-1"
                    >
                      <MessageCircle className="w-3.5 h-3.5 inline" />
                      Falar no WhatsApp
                    </a>
                  </p>
                </div>

              </div>

            </aside>

          </div>

        </main>
      )}
    </div>
  );
};
