import React from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';

interface HeroLeftProps {
  onOpenContact: () => void;
}

export const HeroLeft: React.FC<HeroLeftProps> = ({ onOpenContact }) => {
  return (
    <div id="hero-left-column" className="flex flex-col items-start justify-center max-w-[660px] 2xl:max-w-[700px] z-20 pt-0 pb-1">
      {/* 1. Eyebrow Badge - Pill lilás claro e refinado */}
      <div
        id="badge-education"
        className="inline-flex items-center gap-2.5 px-4.5 py-2 h-[44px] rounded-full bg-[#F3EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13.5px] sm:text-[14px] font-bold tracking-wide uppercase shadow-xs mb-7"
      >
        <div className="w-6 h-6 rounded-full bg-[#3B14E2] text-white flex items-center justify-center shrink-0 shadow-xs">
          <GraduationCap className="w-3.5 h-3.5 text-white" />
        </div>
        <span>AULAS DE MATEMÁTICA E FÍSICA</span>
      </div>

      {/* 2. Título Principal - Harmonizado, legível e com forte hierarquia visual */}
      <h1
        id="hero-headline"
        className="text-[38px] sm:text-[46px] md:text-[52px] lg:text-[58px] xl:text-[64px] font-extrabold font-heading leading-[1.08] sm:leading-[1.12] tracking-[-0.025em] mb-6"
      >
        <span className="block text-[#0D0B24]">
          Matemática e Física
        </span>
        <span className="block mt-1 sm:mt-1.5">
          <span className="text-[#0D0B24]">podem </span>
          <span className="bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED] bg-clip-text text-transparent inline-block">
            fazer sentido
          </span>
        </span>
        <span className="relative inline-block mt-1 sm:mt-1.5">
          <span className="bg-gradient-to-r from-[#C26500] via-[#D97706] to-[#F59E0B] bg-clip-text text-transparent font-black">
            para você.
          </span>
          {/* Traço orgânico sutil que ancora a palavra e reforça o tema educacional */}
          <svg
            className="absolute -bottom-1.5 sm:-bottom-2 left-0 w-full h-2.5 sm:h-3 text-[#F5A300] overflow-visible pointer-events-none"
            viewBox="0 0 200 12"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M3 8 C 50 3, 140 4, 197 8"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeOpacity="0.65"
            />
          </svg>
        </span>
      </h1>

      {/* 3. Subtítulo com texto exato e palavras de destaque em roxo */}
      <p
        id="hero-subheadline"
        className="text-[18px] sm:text-[19px] lg:text-[20px] text-[#0D0B24]/90 font-normal leading-[1.5] max-w-[600px] mb-7 font-body"
      >
        Aprenda com o método GEO — Geovana Ensina e Orienta — e tenha uma jornada de aprendizagem com mais{' '}
        <strong className="text-[#3B14E2] font-bold">clareza</strong>,{' '}
        <strong className="text-[#3B14E2] font-bold">direção</strong> e{' '}
        <strong className="text-[#3B14E2] font-bold">confiança.</strong>
      </p>

      {/* 4. Card "PARA QUEM QUER" - Apresentação Premium */}
      <div
        id="audience-indicator-card"
        className="w-full max-w-[620px] bg-white rounded-[20px] p-5 sm:p-6 border border-[#EAE3FB] shadow-[0_8px_24px_rgba(21,19,43,0.05)] mb-7"
      >
        <div className="mb-3 px-1 flex items-center gap-2">
          <span className="text-[13.5px] sm:text-[14px] font-extrabold text-[#3B14E2] font-heading uppercase tracking-wider">
            PARA QUEM QUER:
          </span>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-[#3B14E2]/20 to-transparent rounded-full" />
        </div>

        {/* 4 Itens em cards dedicados com espaçamento generoso e sem sobreposição */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Item 1: Aprender */}
          <div className="flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-[#FAF9FF] hover:bg-[#F3EEFF] border border-[#ECE6FB] hover:border-[#3B14E2]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F2FF] via-[#EAE2FF] to-[#DED4FA] border border-[#D5C7F7] shadow-xs flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-[#3B14E2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                <path d="M12 7v7" stroke="#F5A300" strokeWidth="2.2" />
                <circle cx="12" cy="5" r="1.5" fill="#F5A300" stroke="#F5A300" />
              </svg>
            </div>
            <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0D0B24] font-heading leading-tight">
              Aprender
            </span>
          </div>

          {/* Item 2: Superar dificuldades */}
          <div className="flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-[#FAF9FF] hover:bg-[#F3EEFF] border border-[#ECE6FB] hover:border-[#3B14E2]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F2FF] via-[#EAE2FF] to-[#DED4FA] border border-[#D5C7F7] shadow-xs flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-[#3B14E2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20h18" />
                <path d="M3 20l7-12 4 6 3-4 4 10" />
                <path d="M10 8V3l4 2.5L10 8z" fill="#F5A300" stroke="#F5A300" strokeWidth="1.2" />
              </svg>
            </div>
            <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0D0B24] font-heading leading-tight">
              Superar<br />dificuldades
            </span>
          </div>

          {/* Item 3: ENEM e Vestibular */}
          <div className="flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-[#FAF9FF] hover:bg-[#F3EEFF] border border-[#ECE6FB] hover:border-[#3B14E2]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F2FF] via-[#EAE2FF] to-[#DED4FA] border border-[#D5C7F7] shadow-xs flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#3B14E2" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="5" stroke="#F5A300" strokeWidth="1.8" />
                <circle cx="12" cy="12" r="2" fill="#F5A300" />
                <path d="M18 6L13.5 10.5" stroke="#3B14E2" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M19.5 4.5L16 5L19 8L19.5 4.5Z" fill="#3B14E2" stroke="#3B14E2" strokeWidth="1" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0D0B24] font-heading leading-tight">
              ENEM &<br />Vestibular
            </span>
          </div>

          {/* Item 4: Concursos */}
          <div className="flex flex-col items-center text-center p-3 sm:p-3.5 rounded-2xl bg-[#FAF9FF] hover:bg-[#F3EEFF] border border-[#ECE6FB] hover:border-[#3B14E2]/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F5F2FF] via-[#EAE2FF] to-[#DED4FA] border border-[#D5C7F7] shadow-xs flex items-center justify-center shrink-0 mb-2 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 text-[#3B14E2]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2" />
                <path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2" />
                <path d="M6 3h12v6a6 6 0 0 1-12 0V3z" />
                <path d="M12 15v4" />
                <path d="M8 21h8" strokeWidth="2" />
                <polygon points="12,6.5 13,8.5 15,8.8 13.5,10.2 14,12.2 12,11.2 10,12.2 10.5,10.2 9,8.8 11,8.5" fill="#F5A300" stroke="#F5A300" strokeWidth="0.8" />
              </svg>
            </div>
            <span className="text-[13px] sm:text-[13.5px] font-bold text-[#0D0B24] font-heading leading-tight">
              Concursos<br />Públicos
            </span>
          </div>
        </div>
      </div>

      {/* 5. CTA Principal Focado em Vendas & Anotação Manuscrita */}
      <div id="cta-action-area" className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full max-w-[660px]">
        {/* Main Hero CTA Button - Refinado, moderno e chamativo na medida certa */}
        <button
          id="btn-hero-courses-cta"
          onClick={() => {
            const el = document.getElementById('cursos') || document.getElementById('planos');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-[380px] h-[58px] sm:h-[60px] px-7 rounded-2xl bg-gradient-to-r from-[#3B14E2] via-[#320EC9] to-[#2509A6] hover:from-[#320EC9] hover:to-[#1C0585] text-white text-[15.5px] sm:text-[16.5px] font-extrabold font-heading shadow-[0_8px_24px_rgba(59,20,226,0.35)] hover:shadow-[0_12px_32px_rgba(59,20,226,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer select-none shrink-0"
        >
          {/* Subtle badge */}
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#F5A300] text-[#0D0B24] text-[10.5px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1 whitespace-nowrap">
            <span>🔥 Vagas Abertas</span>
          </span>

          <span className="tracking-wide uppercase">
            VER CURSOS & GARANTIR VAGA
          </span>
          <ArrowRight className="w-4.5 h-4.5 text-[#F5A300] group-hover:text-white transition-all duration-200 group-hover:translate-x-1" />
        </button>

        {/* Anotação Manuscrita */}
        <div id="handwritten-doodle-container" className="flex items-center gap-2.5 select-none pt-1 sm:pt-0">
          {/* Curved hand-drawn arrow pointing to button */}
          <svg className="w-9 h-9 sm:w-11 sm:h-10 text-[#290B8F] shrink-0 -scale-y-100" viewBox="0 0 44 38" fill="none">
            <path
              d="M38 10 C 26 6, 10 12, 4 25"
              stroke="#290B8F"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M4 25 L 12 28 M 4 25 L 7 17"
              stroke="#290B8F"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>

          <div className="flex flex-col font-handwriting text-[#290B8F] text-[19px] sm:text-[21px] font-bold leading-[1.1] tracking-tight relative">
            <span>Comece agora</span>
            <span>com condições</span>
            <span className="relative inline-block w-fit">
              <span>exclusivas!</span>
              <svg className="absolute -bottom-1.5 left-0 w-full h-3 text-[#F5A300]" viewBox="0 0 100 12" fill="none" preserveAspectRatio="none">
                <path d="M2 7 C 30 3, 70 11, 98 6" stroke="#F5A300" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

