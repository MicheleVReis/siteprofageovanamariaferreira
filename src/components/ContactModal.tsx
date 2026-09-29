import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, CheckCircle, Calendar, Sparkles, ShoppingBag } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const generateWhatsAppUrl = () => {
    const courseText = selectedCourse ? ` referente ao curso *${selectedCourse}*` : '';
    const text = encodeURIComponent(`Olá Profa. Geovana! Gostaria de garantir minha vaga / tirar dúvidas${courseText}. Meu nome é ${name || 'um aluno interessado'}.`);
    return `https://wa.me/5535984121944?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3B14E2]/20 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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
              Solicitação Registrada com Sucesso!
            </h4>
            <p className="text-sm text-[#0D0B24]/75 mb-6">
              A Profa. Geovana entrará em contato para confirmar sua vaga e enviar os dados de acesso à plataforma.
            </p>
            <a
              href={generateWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-[#25D366] text-white font-bold shadow-md hover:brightness-105 transition-all text-base"
            >
              <MessageCircle className="w-5 h-5" />
              Finalizar Matrícula no WhatsApp
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                Seu Nome ou Nome do Aluno
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Mariana Silva"
                className="w-full px-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0D0B24]/70 mb-1.5 font-heading">
                WhatsApp com DDD
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 90000-0000"
                className="w-full px-4 py-3 rounded-xl border border-[#3B14E2]/20 focus:border-[#3B14E2] focus:ring-2 focus:ring-[#3B14E2]/20 outline-none text-sm transition-all"
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

              <a
                href={generateWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#25D366] text-white font-bold text-sm shadow-md hover:brightness-105 hover:-translate-y-0.5 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4" />
                Falar Direto no WhatsApp
              </a>
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

