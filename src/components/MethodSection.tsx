import React from 'react';
import { ArrowRight, Compass, Sparkles, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

interface MethodSectionProps {
  onOpenContact: () => void;
}

export const MethodSection: React.FC<MethodSectionProps> = ({ onOpenContact }) => {
  return (
    <section id="metodo" className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative">
      {/* Background soft ambient accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#3B14E2]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#F5A300]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14 sm:mb-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5">
          <Compass className="w-4 h-4 text-[#3B14E2]" />
          <span>O MÉTODO PROPRIETÁRIO</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-6">
          Aprender é mais do que encontrar a resposta.{' '}
          <span className="text-[#3B14E2] block sm:inline">É entender o caminho.</span>
        </h2>

        {/* Subtitle / Intro text */}
        <p className="text-[17px] sm:text-[19px] text-[#0D0B24]/85 leading-relaxed font-body max-w-3xl">
          O método <strong className="text-[#3B14E2] font-bold">GEO — Geovana Ensina e Orienta</strong> — foi pensado para tornar o aprendizado mais claro, personalizado e conectado ao objetivo de cada aluno. Aqui, você não recebe apenas uma explicação pronta. Você aprende a compreender o raciocínio, identificar suas dificuldades e desenvolver mais segurança para resolver problemas.
        </p>
      </div>

      {/* 3 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
        {/* Pilar 01 - ENSINA */}
        <div className="relative group bg-white rounded-[26px] p-8 sm:p-9 border border-[#EAE3FB] shadow-[0_10px_30px_rgba(21,19,43,0.04)] hover:shadow-[0_20px_45px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          {/* Subtle top indicator bar */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#3B14E2] to-[#6E3BFF]" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[32px] font-black font-heading text-[#3B14E2]/20 group-hover:text-[#3B14E2]/40 transition-colors">
                01
              </span>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#3B14E2] shadow-xs">
                <BookOpen className="w-7 h-7" />
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-[#F2EEFF] text-[#3B14E2] text-xs font-extrabold uppercase tracking-wider mb-2">
              ENSINA
            </div>

            <h3 className="text-[22px] sm:text-[24px] font-bold font-heading text-[#0D0B24] mb-3">
              Conteúdo com clareza
            </h3>

            <p className="text-[15.5px] sm:text-[16.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Explicações simples, objetivas e adaptadas ao seu nível de conhecimento.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#3B14E2]">
            <span className="w-2 h-2 rounded-full bg-[#F5A300]" />
            Base sólida e raciocínio lógico
          </div>
        </div>

        {/* Pilar 02 - ORIENTA */}
        <div className="relative group bg-white rounded-[26px] p-8 sm:p-9 border border-[#EAE3FB] shadow-[0_10px_30px_rgba(21,19,43,0.04)] hover:shadow-[0_20px_45px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#F5A300] to-[#FFC44D]" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[32px] font-black font-heading text-[#F5A300]/30 group-hover:text-[#F5A300]/60 transition-colors">
                02
              </span>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9E6] to-[#FFF0C2] border border-[#FFE28A] flex items-center justify-center text-[#D68500] shadow-xs">
                <Compass className="w-7 h-7" />
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-[#FFF9E6] text-[#B87100] text-xs font-extrabold uppercase tracking-wider mb-2">
              ORIENTA
            </div>

            <h3 className="text-[22px] sm:text-[24px] font-bold font-heading text-[#0D0B24] mb-3">
              Direção para evoluir
            </h3>

            <p className="text-[15.5px] sm:text-[16.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Identificação das suas dificuldades e orientação sobre o que estudar, praticar e aprimorar.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#B87100]">
            <span className="w-2 h-2 rounded-full bg-[#3B14E2]" />
            Estratégia focada no seu objetivo
          </div>
        </div>

        {/* Pilar 03 - ACOMPANHA */}
        <div className="relative group bg-white rounded-[26px] p-8 sm:p-9 border border-[#EAE3FB] shadow-[0_10px_30px_rgba(21,19,43,0.04)] hover:shadow-[0_20px_45px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#240A8A] to-[#3B14E2]" />
          
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className="text-[32px] font-black font-heading text-[#240A8A]/20 group-hover:text-[#240A8A]/40 transition-colors">
                03
              </span>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#240A8A] shadow-xs">
                <TrendingUp className="w-7 h-7" />
              </div>
            </div>

            <div className="inline-block px-3 py-1 rounded-lg bg-[#F2EEFF] text-[#240A8A] text-xs font-extrabold uppercase tracking-wider mb-2">
              ACOMPANHA
            </div>

            <h3 className="text-[22px] sm:text-[24px] font-bold font-heading text-[#0D0B24] mb-3">
              Evolução com propósito
            </h3>

            <p className="text-[15.5px] sm:text-[16.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Um processo de aprendizagem pensado para acompanhar seu desenvolvimento e aproximar você do seu objetivo.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-[#240A8A]">
            <span className="w-2 h-2 rounded-full bg-[#F5A300]" />
            Confiança e segurança contínua
          </div>
        </div>
      </div>

      {/* Visual Concept Banner: GEO = Geovana Ensina + Orienta */}
      <div className="relative w-full rounded-[28px] bg-gradient-to-br from-[#0D0B24] via-[#1E0E5C] to-[#2E0B99] p-8 sm:p-12 text-white overflow-hidden shadow-[0_20px_50px_rgba(13,11,36,0.25)] border-b-[4px] border-b-[#F5A300]">
        {/* Subtle geometric math & pathway background */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 400 200" fill="none">
            <path d="M0 150 Q100 50 200 120 T400 80" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
            <circle cx="200" cy="120" r="8" fill="#F5A300" />
            <circle cx="400" cy="80" r="10" fill="white" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col text-center lg:text-left max-w-2xl">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#F5A300] font-bold text-xs uppercase tracking-widest border border-white/15">
                FÓRMULA DO APRENDIZADO
              </span>
            </div>
            <h4 className="text-[26px] sm:text-[32px] font-extrabold font-heading text-white tracking-tight leading-snug">
              GEO = Geovana <span className="text-[#F5A300]">Ensina</span> + <span className="text-[#F5A300]">Orienta</span>
            </h4>
            <p className="text-[15.5px] sm:text-[16.5px] text-slate-200/90 mt-2 font-body">
              A combinação perfeita entre conteúdo de excelência e mentoria estratégica individualizada para você nunca mais travar diante de uma prova ou exercício.
            </p>
          </div>

          <button
            onClick={onOpenContact}
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-[#F5A300] hover:bg-[#FFB726] text-[#0D0B24] font-bold font-heading text-[16px] shadow-[0_10px_25px_rgba(245,163,0,0.35)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
          >
            <span>CONHECER O MÉTODO GEO</span>
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
