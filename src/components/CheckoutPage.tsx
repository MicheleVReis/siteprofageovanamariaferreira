import React, { useState } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  QrCode,
  FileText,
  Sparkles,
  Zap,
  HelpCircle,
  Clock,
  ArrowRight,
  User,
  Mail,
  Phone,
  Check
} from 'lucide-react';
import { CourseId, UserAccount } from '../types';
import { COURSES_CATALOG, getStoredUsers, saveUser, setCurrentUser, saveOrder } from '../services/storage';

interface CheckoutCourseData {
  id: CourseId;
  title: string;
  badge: string;
  badgeColor: string;
  currentPrice: string;
  oldPrice: string;
  installments: string;
  discount: string;
  benefits: string[];
}

export const CHECKOUT_COURSES: Record<CourseId, CheckoutCourseData> = {
  'matematica-zero-avancado': {
    id: 'matematica-zero-avancado',
    title: 'Matemática do Zero ao Avançado',
    badge: '🔥 MAIS PROCURADO',
    badgeColor: 'bg-[#3B14E2] text-white',
    currentPrice: 'R$ 297',
    oldPrice: 'R$ 497,00',
    installments: '12x de R$ 29,70',
    discount: '40% OFF',
    benefits: [
      'Curso completo do básico ao avançado',
      'Método GEO com resolução passo a passo',
      'Listas de exercícios com gabarito comentado',
      'Plantão de dúvidas direto no WhatsApp',
      'Acesso por 1 ano + atualizações de aulas',
      'Certificado de conclusão de curso'
    ]
  },
  'fisica-descomplicada': {
    id: 'fisica-descomplicada',
    title: 'Física Descomplicada & Prática',
    badge: '⚡ TEORIA + PRÁTICA',
    badgeColor: 'bg-[#0D0B24] text-[#F5A300]',
    currentPrice: 'R$ 297',
    oldPrice: 'R$ 497,00',
    installments: '12x de R$ 29,70',
    discount: '40% OFF',
    benefits: [
      'Módulos completos de todas as frentes da física',
      'Resoluções comentadas das últimas 10 edições do ENEM',
      'Mapas mentais e resumos visuais para baixar',
      'Suporte para tirar dúvidas de exercícios',
      'Acesso por 1 ano completo à plataforma',
      'Simulados temáticos com cronômetro'
    ]
  },
  'combo-exatas-turbo': {
    id: 'combo-exatas-turbo',
    title: 'Combo Exatas Turbo (Matemática + Física)',
    badge: '👑 MAIS VENDIDO • MELHOR ESCOLHA',
    badgeColor: 'bg-gradient-to-r from-[#F5A300] to-[#FFC44D] text-[#0D0B24]',
    currentPrice: 'R$ 497',
    oldPrice: 'R$ 994,00',
    installments: '12x de R$ 49,60',
    discount: '50% OFF',
    benefits: [
      'Acesso COMPLETO aos cursos de Matemática e Física',
      'Módulo Bônus: Técnicas de Resolução Rápida para o ENEM',
      'Aulas ao vivo mensais de tira-dúvidas com a Profa. Geovana',
      'Super banco com +1.000 questões resolvidas',
      'Grupo VIP de alunos no Telegram/WhatsApp',
      'Acesso estendido por 2 anos completos'
    ]
  },
  'mentoria-vip-individual': {
    id: 'mentoria-vip-individual',
    title: 'Mentoria VIP 1-on-1 & Aulas Particulares',
    badge: '💎 VAGAS LIMITADAS • INDIVIDUAL',
    badgeColor: 'bg-[#3B14E2] text-[#F5A300]',
    currentPrice: 'R$ 1.297',
    oldPrice: 'R$ 1.800,00',
    installments: '12x de R$ 129,50',
    discount: 'PREMIUM',
    benefits: [
      'Encontros individuais semanais e ao vivo',
      'Plano de estudos 100% individualizado para seu ritmo',
      'Diagnóstico contínuo e correção personalizada de erros',
      'Acesso direto ao WhatsApp pessoal da Profa. Geovana',
      'Especialista em apoio a alunos com TDAH, TEA e bloqueios',
      'Inclui acesso livre a todos os cursos gravados'
    ]
  }
};

interface CheckoutPageProps {
  initialCourseId?: CourseId;
  onBack: () => void;
  onPaymentSuccess: (user: UserAccount) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  initialCourseId = 'combo-exatas-turbo',
  onBack,
  onPaymentSuccess
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<CourseId>(initialCourseId);
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  
  // Dados do Comprador
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  // Cartão de Crédito
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentCourse = CHECKOUT_COURSES[selectedCourseId] || CHECKOUT_COURSES['combo-exatas-turbo'];

  const handleFinishPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const cleanEmail = email.trim().toLowerCase();
      const users = getStoredUsers();
      let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (user) {
        // Adiciona o curso novo à lista de cursos comprados caso não tenha
        if (!user.enrolledCourses.includes(selectedCourseId)) {
          user.enrolledCourses.push(selectedCourseId);
        }
        saveUser(user);
      } else {
        user = {
          id: `user-${Date.now()}`,
          name: fullName.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          password: password.trim() || '123456',
          role: 'student',
          enrolledCourses: [selectedCourseId],
          createdAt: new Date().toISOString()
        };
        saveUser(user);
      }

      // Registra a transação/recebimento no histórico financeiro da Profa. Geovana
      const coursePrice = selectedCourseId === 'combo-exatas-turbo' ? 497 : selectedCourseId === 'mentoria-vip-individual' ? 1297 : 297;
      saveOrder({
        id: `ord-${Date.now()}`,
        studentId: user.id,
        studentName: user.name,
        studentEmail: user.email,
        studentPhone: user.phone,
        courseId: selectedCourseId,
        courseTitle: currentCourse.title,
        amount: coursePrice,
        paymentMethod: paymentMethod,
        status: 'paid',
        createdAt: new Date().toISOString()
      });

      setCurrentUser(user);

      // Redireciona para o portal após 1.5s
      setTimeout(() => {
        onPaymentSuccess(user);
      }, 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FB] text-[#0D0B24] font-body flex flex-col">
      {/* Top Header do Checkout */}
      <header className="bg-white border-b border-slate-200 py-4 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#3B14E2] bg-slate-100 hover:bg-[#F2EEFF] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center text-xl sm:text-2xl font-black tracking-tight leading-none text-[#3B14E2] font-heading">
            <span>GEO</span>
          </div>
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 border-l border-slate-200 pl-2">
            Checkout Seguro
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span className="hidden sm:inline">Ambiente Criptografado</span>
          <span className="sm:hidden">Seguro</span>
        </div>
      </header>

      {/* Mensagem de Compra Aprovada com Sucesso */}
      {isSuccess ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border border-emerald-300 shadow-2xl animate-fadeIn">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black font-heading text-slate-900 mb-2">
              Pagamento Confirmado!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
              Parabéns! Sua matrícula no curso <strong>{currentCourse.title}</strong> foi realizada. Suas aulas já foram liberadas na plataforma.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3B14E2] bg-[#F2EEFF] px-4 py-2 rounded-full animate-pulse">
              <span>Redirecionando para suas aulas...</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Coluna Esquerda: Dados do Aluno e Opções de Pagamento */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Seleção de Curso */}
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm sm:text-base font-extrabold font-heading text-[#0D0B24] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#3B14E2] text-white flex items-center justify-center text-xs">1</span>
                    Selecione o Curso Desejado
                  </h3>
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    Garantia de 7 dias
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(Object.keys(CHECKOUT_COURSES) as CourseId[]).map((courseKey) => {
                    const c = CHECKOUT_COURSES[courseKey];
                    const isSelected = selectedCourseId === courseKey;

                    return (
                      <div
                        key={courseKey}
                        onClick={() => setSelectedCourseId(courseKey)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-[#3B14E2] bg-[#F4EFFF]'
                            : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                              {c.discount}
                            </span>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#3B14E2] text-white' : 'border border-slate-300'}`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {c.title}
                          </h4>
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-baseline justify-between">
                          <span className="text-[11px] text-slate-400 line-through">{c.oldPrice}</span>
                          <span className="text-sm font-black text-[#3B14E2]">{c.currentPrice}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Formulário de Identificação do Aluno */}
              <form id="checkout-form" onSubmit={handleFinishPurchase} className="space-y-6">
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
                  <h3 className="text-sm sm:text-base font-extrabold font-heading text-[#0D0B24] flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#3B14E2] text-white flex items-center justify-center text-xs">2</span>
                    Dados do Aluno para Cadastro & Acesso
                  </h3>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                        Nome Completo *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Digite seu nome completo..."
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          E-mail para liberar as aulas *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          WhatsApp / Telefone *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="(35) 99999-9999"
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          CPF (para nota fiscal)
                        </label>
                        <input
                          type="text"
                          value={cpf}
                          onChange={(e) => setCpf(e.target.value)}
                          placeholder="000.000.000-00"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Crie sua Senha de Acesso *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Sua senha no portal..."
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Forma de Pagamento */}
                <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs">
                  <h3 className="text-sm sm:text-base font-extrabold font-heading text-[#0D0B24] flex items-center gap-2 mb-4">
                    <span className="w-6 h-6 rounded-full bg-[#3B14E2] text-white flex items-center justify-center text-xs">3</span>
                    Forma de Pagamento
                  </h3>

                  {/* Tabs de Meio de Pagamento: PIX ou Cartão */}
                  <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-4 text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pix')}
                      className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>PIX (Imediato)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        paymentMethod === 'credit_card'
                          ? 'bg-white text-[#3B14E2] shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-[#3B14E2]" />
                      <span>Cartão de Crédito</span>
                    </button>
                  </div>

                  {/* Detalhes do Método Selecionado */}
                  {paymentMethod === 'pix' && (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                      <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-extrabold uppercase">
                        <Zap className="w-4 h-4 text-emerald-600" />
                        <span>Liberação Imediata das Aulas</span>
                      </div>
                      <p className="text-xs text-emerald-900/80 leading-relaxed max-w-md mx-auto">
                        Ao clicar em Concluir Pedido, seu acesso ao curso será liberado instantaneamente na sua conta cadastrada.
                      </p>
                    </div>
                  )}

                  {paymentMethod === 'credit_card' && (
                    <div className="space-y-3 pt-1">
                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Número do Cartão
                        </label>
                        <input
                          type="text"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                          Nome impresso no cartão
                        </label>
                        <input
                          type="text"
                          placeholder="Como escrito no cartão"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-1">
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            Validade
                          </label>
                          <input
                            type="text"
                            placeholder="MM/AA"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                          />
                        </div>

                        <div className="col-span-1">
                          <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                            Parcelas
                          </label>
                          <select
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            className="w-full px-2 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none bg-white font-semibold"
                          >
                            <option value="1">1x à vista</option>
                            <option value="6">6x sem juros</option>
                            <option value="12">12x com juros</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Botão Finalizar Compra */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#F5A300] via-amber-400 to-[#F5A300] text-slate-950 font-black font-heading text-base shadow-lg shadow-[#F5A300]/30 hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Processando seu pedido...</span>
                  ) : (
                    <>
                      <span>CONCLUIR MATRÍCULA E LIBERAR AULAS</span>
                      <ArrowRight className="w-5 h-5 text-slate-950" />
                    </>
                  )}
                </button>

                <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Seus dados estão protegidos por criptografia SSL de 256 bits.
                </p>
              </form>

            </div>

            {/* Coluna Direita: Resumo do Pedido & Card Visual do Curso Selecionado */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm sticky top-24">
                
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-heading mb-3">
                  Resumo do Pedido
                </h3>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#15132B] to-[#2B1B6A] text-white relative overflow-hidden mb-5">
                  <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-400 text-slate-950 mb-2">
                    {currentCourse.badge}
                  </div>
                  <h4 className="text-base font-extrabold font-heading text-white">
                    {currentCourse.title}
                  </h4>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xs text-slate-300 line-through">{currentCourse.oldPrice}</span>
                    <span className="text-2xl font-black text-amber-300">{currentCourse.currentPrice}</span>
                    <span className="text-xs text-slate-300">à vista</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">ou {currentCourse.installments}</p>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    O que está incluso:
                  </h4>
                  {currentCourse.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Preço original</span>
                    <span className="line-through">{currentCourse.oldPrice}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Desconto aplicado</span>
                    <span>{currentCourse.discount}</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-extrabold text-base pt-2 border-t border-slate-100">
                    <span>Total a pagar</span>
                    <span className="text-[#3B14E2]">{currentCourse.currentPrice}</span>
                  </div>
                </div>

                <div className="mt-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Dúvidas sobre o curso? Chame a professora no{' '}
                    <a
                      href="https://wa.me/5535984121944"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#3B14E2] underline"
                    >
                      WhatsApp
                    </a>
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
};
