import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles, Award, Star, Clock, Calendar, Users, HeartHandshake } from 'lucide-react';
import portraitGeovanaCutout from '../assets/images/geovana_mentoria.jpg';

interface PricingSectionProps {
  onOpenContact: (courseName?: string) => void;
  onOpenCheckout?: (courseId: any) => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenContact, onOpenCheckout }) => {
  const [selectedPlanId, setSelectedPlanId] = useState<'mentoria-vip-individual' | 'mentoria-vip-10-meses'>('mentoria-vip-individual');

  const mentoriaPlans = {
    'mentoria-vip-individual': {
      id: 'mentoria-vip-individual' as const,
      name: 'Pacote 6 Meses',
      badge: '01 AULA POR SEMANA',
      price: 'R$ 2.879',
      oldPrice: 'R$ 3.600,00',
      installments: '12x de R$ 239,92 sem juros',
      tag: 'PACOTE 6 MESES',
      desc: '01 aula por semana ao vivo via Meet (6 meses de acompanhamento)',
    },
    'mentoria-vip-10-meses': {
      id: 'mentoria-vip-10-meses' as const,
      name: 'Plano 10 Meses',
      badge: 'ANO COMPLETO',
      price: 'R$ 4.500',
      oldPrice: 'R$ 5.500,00',
      installments: '12x de R$ 375,00 sem juros',
      tag: '10 MESES',
      desc: '10 meses de mentoria individual (janeiro e fevereiro não tem aula, férias)',
      vacationNote: 'Janeiro e fevereiro não tem aula (férias)',
    },
  };

  const activePlan = mentoriaPlans[selectedPlanId];

  const mentoria = {
    badge: '💎 VAGAS LIMITADAS • INDIVIDUAL',
    title: 'Mentoria VIP 1-on-1 & Aulas Particulares',
    subtitle: 'Acompanhamento individual, acolhedor e 100% focado na sua aprovação ou evolução escolar com a Profa. Geovana Ferreira.',
    benefits: [
      '01 aula individual semanal e ao vivo via Google Meet',
      'Plano de estudos 100% individualizado para o seu ritmo',
      'Diagnóstico contínuo e resolução comentada das suas dúvidas',
      'Acesso direto ao WhatsApp pessoal da Profa. Geovana',
      'Apoio especializado e adaptado para alunos com TDAH, TEA e bloqueios',
      'Material de apoio, listas direcionadas e mapas mentais exclusivos',
      'Orientação para ENEM, vestibulares, provas escolares e concursos',
      'Acesso livre incluído aos módulos gravados e simulados',
    ],
  };

  return (
    <section
      id="cursos"
      className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative bg-[#F8F7FD] scroll-mt-6"
    >
      {/* Fallback anchor for backward compatibility */}
      <div id="planos" className="absolute -top-10 left-0" />
      <div id="mentoria" className="absolute -top-10 left-0" />
      <div id="matematica-fisica" className="absolute -top-10 left-0" />

      {/* Ambient background glows */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-[#3B14E2]/6 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-1/3 w-[600px] h-[300px] bg-[#F5A300]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Section Header */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#F5A300]" />
          <span>ACOMPANHAMENTO INDIVIDUAL • MATRÍCULAS ABERTAS</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[46px] lg:text-[54px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Mentoria VIP Individual &{' '}
          <span className="bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED] bg-clip-text text-transparent">
            Aulas Particulares
          </span>
        </h2>

        {/* Subheadline */}
        <p className="text-[17px] sm:text-[19px] text-[#0D0B24]/85 leading-relaxed font-body max-w-3xl">
          A experiência definitiva e personalizada para destravar Matemática e Física com foco total nas suas dificuldades e no seu ritmo de aprendizado.
        </p>
      </div>

      {/* Mentoria VIP Spotlight Card */}
      <div id="mentoria-vip" className="relative z-10 max-w-5xl mx-auto mb-16 scroll-mt-24">
        {/* Glowing aura frame */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-[#3B14E2] via-[#F5A300] to-[#7C3AED] rounded-[36px] blur-xl opacity-30 transition duration-700"></div>

        <div className="relative rounded-[32px] bg-gradient-to-b from-[#0D0B24] via-[#160B46] to-[#200A63] text-white border-2 border-[#F5A300] shadow-[0_25px_65px_rgba(13,11,36,0.45)] overflow-hidden">

          {/* Subtle background light blooms */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F5A300]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3B14E2]/35 rounded-full blur-3xl pointer-events-none" />

          {/* Top Status Banner */}
          <div className="px-6 sm:px-10 py-4 bg-white/5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-extrabold font-heading text-emerald-300 uppercase tracking-wider">
                VAGAS LIMITADAS PARA ESTE MÊS
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-gradient-to-r from-[#F5A300] to-[#FFB726] text-[#0D0B24] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm">
                ATENDIMENTO 1-ON-1 EXCLUSIVO
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 p-6 sm:p-10 lg:p-12 items-center">

            {/* Left Column: Teacher Photo with Frame (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-[360px] aspect-[4/4.8] rounded-3xl overflow-hidden border-2 border-[#F5A300]/50 shadow-2xl bg-[#120743] group">
                <img
                  src={portraitGeovanaCutout}
                  alt="Profa. Geovana - Mentoria VIP"
                  className="w-full h-full object-cover object-[center_12%] select-none scale-102 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Vignette Gradient */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0D0B24] via-[#0D0B24]/50 to-transparent pointer-events-none" />

                {/* Badge Overlay */}
                <div className="absolute top-3.5 left-3.5 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] sm:text-[11.5px] font-black uppercase tracking-wider shadow-lg bg-[#3B14E2] text-[#F5A300] border border-[#F5A300]/40">
                    💎 MENTORIA VIP
                  </span>
                </div>

                {/* Name Tag Bottom */}
                <div className="absolute bottom-3.5 inset-x-3.5 z-20 text-center bg-white/10 backdrop-blur-md rounded-2xl py-2.5 px-3 border border-white/20">
                  <p className="text-sm font-extrabold text-white">Profa. Geovana Ferreira</p>
                  <p className="text-[11.5px] font-semibold text-[#FFC44D] mt-0.5">Mentoria & Acompanhamento Individual</p>
                </div>
              </div>

              {/* Extra Mini Highlights below photo */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[360px] mt-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
                  <Clock className="w-4 h-4 text-[#F5A300] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Horários Flexíveis</span>
                  <span className="text-[10px] text-slate-400">Adaptados à sua rotina</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center backdrop-blur-xs">
                  <HeartHandshake className="w-4 h-4 text-[#F5A300] mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-slate-200 block">Ensino Acolhedor</span>
                  <span className="text-[10px] text-slate-400">Zero julgamentos</span>
                </div>
              </div>
            </div>

            {/* Right Column: Content, Pricing and CTA (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center text-[#F5A300]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#F5A300]" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-300">Avaliação 5.0 pelos alunos</span>
                </div>

                <h3 className="text-[26px] sm:text-[32px] lg:text-[36px] font-black font-heading leading-tight mb-3 text-white">
                  {mentoria.title}
                </h3>

                <p className="text-[15px] sm:text-[16px] text-slate-200 leading-relaxed font-body mb-6">
                  {mentoria.subtitle}
                </p>

                {/* Selector de Planos 6 Meses vs 10 Meses */}
                <div className="mb-4">
                  <span className="text-[11.5px] font-extrabold uppercase tracking-wider block font-heading text-[#F5A300] mb-2.5">
                    ESCOLHA O SEU PLANO DE MENTORIA:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Opção 1: 6 Meses */}
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId('mentoria-vip-individual')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${selectedPlanId === 'mentoria-vip-individual'
                          ? 'bg-gradient-to-br from-[#3B14E2] via-[#2F0EA8] to-[#1D0678] border-[#F5A300] shadow-[0_0_20px_rgba(245,163,0,0.3)] ring-2 ring-[#F5A300]/60'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-75 hover:opacity-100'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-[#F5A300]">
                          Pacote 6 Meses
                        </span>
                        <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/30">
                          01 aula/sem
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white font-heading">
                        R$ 2.879<span className="text-xs font-normal text-slate-300">,00</span>
                      </div>
                      <div className="text-[11.5px] text-[#FFC44D] font-bold mt-0.5">
                        ou 12x de R$ 239,92 sem juros
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        01 aula por semana (6 meses)
                      </div>
                    </button>

                    {/* Opção 2: 10 Meses */}
                    <button
                      type="button"
                      onClick={() => setSelectedPlanId('mentoria-vip-10-meses')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${selectedPlanId === 'mentoria-vip-10-meses'
                          ? 'bg-gradient-to-br from-[#3B14E2] via-[#2F0EA8] to-[#1D0678] border-[#F5A300] shadow-[0_0_20px_rgba(245,163,0,0.3)] ring-2 ring-[#F5A300]/60'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 opacity-75 hover:opacity-100'
                        }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-black uppercase tracking-wider text-[#F5A300]">
                          Plano 10 Meses
                        </span>
                        <span className="text-[10px] font-extrabold bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/30">
                          Ano Completo
                        </span>
                      </div>
                      <div className="text-2xl font-black text-white font-heading">
                        R$ 4.500<span className="text-xs font-normal text-slate-300">,00</span>
                      </div>
                      <div className="text-[11.5px] text-[#FFC44D] font-bold mt-0.5">
                        ou 12x de R$ 375,00 sem juros
                      </div>
                      <div className="text-[10.5px] text-amber-200/90 font-medium mt-1 italic">
                        *Janeiro e fevereiro não tem aula (férias)
                      </div>
                    </button>
                  </div>
                </div>

                {/* Price Box Dinâmico */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-sm mb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs sm:text-sm font-semibold text-slate-300 line-through">
                      De {activePlan.oldPrice}
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-[#F5A300] text-[#0D0B24] text-[11px] font-black uppercase tracking-wider">
                      {activePlan.tag}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="text-[32px] sm:text-[40px] font-black font-heading text-white tracking-tight">
                      {activePlan.price}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-300">
                      à vista
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-[#F5A300] ml-auto">
                      ou {activePlan.installments}
                    </span>
                  </div>

                  {activePlan.vacationNote && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                      <span>🏖️</span>
                      <span>Nota: <strong>{activePlan.vacationNote}</strong></span>
                    </div>
                  )}
                </div>

                {/* Benefits List */}
                <div className="mb-8">
                  <span className="text-[11.5px] font-extrabold uppercase tracking-wider block font-heading text-[#F5A300] mb-3.5">
                    TUDO O QUE ESTÁ INCLUSO NA SUA MENTORIA:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mentoria.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-[#F5A300] text-[#0D0B24] flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-[13.5px] leading-snug font-medium text-slate-100">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
                <button
                  onClick={() => {
                    if (onOpenCheckout) {
                      onOpenCheckout(activePlan.id);
                    } else {
                      onOpenContact(`${mentoria.title} - ${activePlan.name}`);
                    }
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl font-black font-heading text-[16px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none bg-gradient-to-r from-[#F5A300] via-[#FFB726] to-[#FFC44D] text-[#0D0B24] hover:brightness-105 shadow-[0_6px_25px_rgba(245,163,0,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Garantir Minha Vaga na Mentoria</span>
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </button>

                <a
                  href={`https://wa.me/5535984121944?text=${encodeURIComponent(`Olá Profa. Geovana! Gostaria de tirar dúvidas sobre a Mentoria VIP (${activePlan.name} - ${activePlan.price},00).`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-4 px-6 rounded-2xl font-bold font-heading text-[14px] text-white bg-white/10 hover:bg-white/15 border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Falar no WhatsApp</span>
                </a>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_30px_rgba(59,20,226,0.05)] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Garantia de 7 Dias
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Risco zero! Se não se adaptar, devolvemos 100% do valor.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-[#F5A300]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Alinhamento Imediato
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Agendamento da 1ª sessão logo após a confirmação.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Método Comprovado
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Centenas de alunos com evolução rápida e notas 800+.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
