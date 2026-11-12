import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, CheckCircle, Sparkles, ShoppingBag, AlertCircle, AlertTriangle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCourse?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, selectedCourse }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState<'matematica' | 'fisica' | 'ambas'>('ambas');
  const [goal, setGoal] = useState('enem');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Estados da janela de aviso de preenchimento obrigatório
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedCourse) {
      if (selectedCourse.toLowerCase().includes('matemática') && !selectedCourse.toLowerCase().includes('física')) {
        setSubject('matematica');
      } else if (selectedCourse.toLowerCase().includes('física')) {
        setSubject('fisica');
      } else {
        setSubject('ambas');
      }
    }
  }, [selectedCourse]);

  // Limpa estados ao fechar ou reabrir
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false);
      setShowWarningModal(false);
      setHasAttemptedSubmit(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const validateFields = (): boolean => {
    const missing: string[] = [];
    if (!name.trim()) {
      missing.push('Seu Nome ou Nome do Aluno');
    }
    const cleanPhone = phone.replace(/\D/g, '');
    if (!phone.trim() || cleanPhone.length < 8) {
      missing.push('WhatsApp com DDD');
    }

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowWarningModal(true);
      setHasAttemptedSubmit(true);
      return false;
    }

    return true;
  };

  const getSubjectLabel = (s: string) => {
    switch (s) {
      case 'matematica':
        return 'Matemática';
      case 'fisica':
        return 'Física';
      case 'ambas':
      default:
        return 'Matemática e Física';
    }
  };

  const getGoalLabel = (g: string) => {
    switch (g) {
      case 'aprender':
        return 'Aprender do zero com base sólida';
      case 'dificuldades':
        return 'Superar dificuldades / Recuperação';
      case 'enem':
        return 'Preparação para ENEM e Vestibulares';
      case 'concursos':
        return 'Concursos Públicos';
      case 'neurodivergente':
        return 'Acompanhamento Especialista TDAH • TEA • ABA';
      default:
        return g;
    }
  };

  const getDiagnosticWhatsAppUrl = () => {
    const subjectLabel = getSubjectLabel(subject);
    const goalLabel = getGoalLabel(goal);
    const courseText = selectedCourse ? `\n📌 *Interesse:* ${selectedCourse}` : '';
    const nameText = `\n👤 *Nome:* ${name.trim()}`;
    const phoneText = `\n📱 *WhatsApp:* ${phone.trim()}`;

    const text = `Olá Profa. Geovana! Gostaria de solicitar um horário para diagnóstico inicial e plano de estudos.${courseText}${nameText}${phoneText}\n📚 *Disciplina:* ${subjectLabel}\n🎯 *Objetivo:* ${goalLabel}`;

    return `https://wa.me/5535984121944?text=${encodeURIComponent(text)}`;
  };

  const getDirectWhatsAppUrl = () => {
    const courseText = selectedCourse ? ` sobre *${selectedCourse}*` : '';
    const nameText = ` Meu nome é ${name.trim()} (${phone.trim()}).`;
    const text = `Olá Profa. Geovana! Gostaria de conversar diretamente pelo WhatsApp para tirar dúvidas${courseText}.${nameText}`;
    return `https://wa.me/5535984121944?text=${encodeURIComponent(text)}`;
  };

  const openInNewWindow = (url: string) => {
    // Garante a abertura em uma nova janela/aba sem alterar a página atual
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }

    const url = getDiagnosticWhatsAppUrl();
    openInNewWindow(url);
    setIsSubmitted(true);
  };

  const handleDirectWhatsAppClick = () => {
    if (!validateFields()) {
      return;
    }

    const url = getDirectWhatsAppUrl();
    openInNewWindow(url);
  };

  const handleCloseWarningAndFocus = () => {
    setShowWarningModal(false);
    if (!name.trim()) {
      nameInputRef.current?.focus();
    } else if (!phone.trim() || phone.replace(/\D/g, '').length < 8) {
      phoneInputRef.current?.focus();
    }
  };

  const isNameInvalid = hasAttemptedSubmit && !name.trim();
  const isPhoneInvalid = hasAttemptedSubmit && (!phone.trim() || phone.replace(/\D/g, '').length < 8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3B14E2]/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* JANELA DE AVISO: Mostrada se clicar sem preencher os dados */}
        {showWarningModal && (
          <div className="absolute inset-0 z-50 bg-[#0D0B24]/80 backdrop-blur-xs rounded-3xl p-6 sm:p-8 flex items-center justify-center animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full text-center shadow-2xl border-2 border-amber-300 relative animate-scaleUp">
              <button
                type="button"
                onClick={handleCloseWarningAndFocus}
                className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fechar aviso"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center mb-4 border border-amber-200 shadow-sm">
                <AlertTriangle className="w-9 h-9" />
              </div>

              <h4 className="text-xl font-extrabold font-heading text-[#0D0B24] mb-2">
                Atenção: Preencha seus Dados
              </h4>

              <p className="text-xs sm:text-sm text-[#0D0B24]/80 mb-5 leading-relaxed">
                Para que a <strong>Profa. Geovana</strong> possa identificar você e preparar seu diagnóstico com atendimento personalizado, preencha os dados antes de prosseguir:
              </p>

              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 mb-6 text-left space-y-2">
                {missingFields.map((field, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-[13px] font-bold text-amber-900">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>Falta preencher: <span className="underline">{field}</span></span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleCloseWarningAndFocus}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white font-extrabold text-sm uppercase tracking-wider font-heading shadow-lg shadow-[#3B14E2]/25 hover:brightness-110 active:translate-y-0 transition-all cursor-pointer"
              >
                Entendido, vou preencher agora
              </button>
            </div>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#0D0B24]/60 hover:text-[#0D0B24] hover:bg-[#F1EDFF] transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#3B14E2] text-white flex items-center justify-center font-extrabold text-lg font-heading shadow-md shadow-[#3B14E2]/30">
            <span>G</span>
            <span className="text-[#F5A300]">E</span>
            <span>O</span>
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading text-[#0D0B24]">
              {selectedCourse ? 'Matrícula & Vaga Garantida' : 'Iniciar com a Profa. Geovana'}
            </h3>
            <p className="text-xs text-[#3B14E2] font-bold uppercase tracking-wider">
              {selectedCourse ? selectedCourse : 'Diagnóstico Inicial & Plano de Estudos'}
            </p>
          </div>
        </div>

        {selectedCourse && (
          <div className="p-3 bg-[#F4EFFF] border border-[#DDD0FE] rounded-2xl mb-4 flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3B14E2] shrink-0" />
            <div className="text-xs text-[#0D0B24]">
              <span className="font-bold">Curso Selecionado:</span> {selectedCourse}
              <span className="block text-[11px] text-[#3B14E2] font-semibold">Condição promocional aplicada</span>
            </div>
          </div>
        )}

        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#F2EEFF] text-[#3B14E2] mx-auto flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-[#3B14E2]" />
            </div>
            <h4 className="text-xl font-bold text-[#0D0B24] font-heading mb-2">
              Solicitação Encaminhada para o WhatsApp!
            </h4>
            <p className="text-sm text-[#0D0B24]/75 mb-6">
              Caso o aplicativo do WhatsApp não tenha aberto automaticamente, clique no botão abaixo para iniciar a conversa:
            </p>
            <a
              href={getDiagnosticWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-[#25D366] text-white font-bold shadow-md hover:brightness-105 transition-all text-base cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              Abrir WhatsApp da Profa. Geovana
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 font-heading">
                  Seu Nome ou Nome do Aluno <span className="text-rose-500">*</span>
                </label>
                {isNameInvalid && (
                  <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Campo obrigatório
                  </span>
                )}
              </div>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                  isNameInvalid
                    ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 font-heading">
                  WhatsApp com DDD <span className="text-rose-500">*</span>
                </label>
                {isPhoneInvalid && (
                  <span className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Telefone inválido
                  </span>
                )}
              </div>
              <input
                ref={phoneInputRef}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="(00) 90000-0000"
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                  isPhoneInvalid
                    ? 'border-rose-400 bg-rose-50/50 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                Disciplina de Interesse
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'matematica', label: 'Matemática' },
                  { id: 'fisica', label: 'Física' },
                  { id: 'ambas', label: 'Ambas' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSubject(item.id as any)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      subject === item.id
                        ? 'bg-[#3B14E2] text-white shadow-sm'
                        : 'bg-[#F2EEFF]/60 text-[#0D0B24] hover:bg-[#F2EEFF]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                Qual é o seu objetivo principal?
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm bg-white"
              >
                <option value="aprender">Aprender do zero com base sólida</option>
                <option value="dificuldades">Superar dificuldades / Recuperação</option>
                <option value="enem">Preparação para ENEM e Vestibulares</option>
                <option value="concursos">Concursos Públicos</option>
                <option value="neurodivergente">Acompanhamento Especialista TDAH • TEA • ABA</option>
              </select>
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] hover:from-[#320EC9] hover:to-[#1C0585] text-white font-bold text-sm font-heading shadow-[0_4px_16px_rgba(59,20,226,0.3)] hover:shadow-[0_6px_20px_rgba(59,20,226,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F5A300]" />
                {selectedCourse ? 'CONFIRMAR INTERESSE & GARANTIR VAGA' : 'SOLICITAR HORÁRIO & DIAGNÓSTICO'}
              </button>

              <div className="flex items-center gap-2 my-1">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-bold text-slate-400 uppercase">ou</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <button
                type="button"
                onClick={handleDirectWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md hover:brightness-105 hover:-translate-y-0.5 transition-all text-center cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                Falar Direto no WhatsApp
              </button>
            </div>

            <p className="text-[11px] text-center text-[#0D0B24]/55">
              Atendimento personalizado com a Profa. Geovana • Vagas limitadas
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
