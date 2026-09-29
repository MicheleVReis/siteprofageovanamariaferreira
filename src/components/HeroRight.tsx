import React from 'react';
import geovanaTransparent from '../assets/images/geovana_portrait_transparent.png';

export const HeroRight: React.FC = () => {
  return (
    <div
      id="hero-right-column"
      className="relative flex items-end justify-center lg:justify-end w-full select-none min-h-[540px] sm:min-h-[620px] lg:min-h-[680px] xl:min-h-[720px] -mb-5 sm:-mb-6 lg:-mb-8"
    >
      {/* Visual Composition Container - Proporção de estúdio editorial */}
      <div className="relative w-full max-w-[640px] sm:max-w-[720px] lg:max-w-[780px] xl:max-w-[840px] aspect-[1/1] sm:aspect-[4/3.8] flex items-end justify-center lg:justify-end">

        {/* 1. Luminous Outer Halo / Glow framing the shape */}
        <div className="absolute right-0 top-0 sm:top-1 w-[98%] sm:w-[96%] lg:w-[95%] h-[100%] rounded-tl-[280px] sm:rounded-tl-[340px] lg:rounded-tl-[380px] rounded-tr-[100px] sm:rounded-tr-[140px] rounded-bl-[160px] rounded-br-[0px] bg-gradient-to-br from-[#F5A300]/20 via-[#6E3BFF]/25 to-[#8B5CF6]/15 blur-2xl pointer-events-none z-0" />

        {/* 2. Expanded Majestic Studio Arch Backdrop */}
        <div className="absolute right-0 top-0 sm:top-1 w-[97%] sm:w-[95%] lg:w-[94%] h-[100%] bg-gradient-to-b from-[#3811BE] via-[#240A8A] to-[#120743] rounded-tl-[280px] sm:rounded-tl-[340px] lg:rounded-tl-[380px] rounded-tr-[100px] sm:rounded-tr-[140px] rounded-bl-[160px] sm:rounded-bl-[200px] rounded-br-[0px] overflow-hidden shadow-[0_30px_70px_rgba(20,7,80,0.38)] z-0 border border-white/15 border-b-0">

          {/* Top highlight gradient rim */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

          {/* Degradê na Base que se conecta perfeitamente ao tom escuro (#0D0B24) da barra de benefícios */}
          <div className="absolute inset-x-0 bottom-0 h-56 sm:h-72 bg-gradient-to-t from-[#0D0B24] via-[#1F0E66]/60 to-transparent pointer-events-none" />

          {/* Subtle inner radial glow behind head and torso */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_25%,rgba(110,65,255,0.45),transparent_70%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,rgba(245,163,0,0.12),transparent_60%)]" />

          {/* 3. Elementos de Matemática e Física extremamente sutis (Opacidade 20-35% para não competir) */}

          {/* Fórmula 1: a² + b² = c² */}
          <div className="absolute top-8 sm:top-12 right-8 sm:right-14 lg:right-20 text-white/35 font-serif italic text-lg sm:text-xl lg:text-2xl font-normal tracking-wider select-none pointer-events-none">
            a² + b² = c²
          </div>

          {/* Fórmula 2: f(x) = x² */}
          <div className="absolute top-22 sm:top-32 right-14 sm:right-24 lg:right-32 text-white/30 font-serif italic text-base sm:text-lg lg:text-xl font-normal select-none pointer-events-none">
            f(x) = x²
          </div>

          {/* Estrela Dourada Sutil */}
          <div className="absolute top-30 sm:top-40 right-5 sm:right-10 lg:right-14 select-none pointer-events-none opacity-40">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-[#F5A300] fill-[#F5A300] drop-shadow-[0_2px_6px_rgba(245,163,0,0.4)]" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>

          {/* Trajetória de curva pontilhada matemática */}
          <svg className="absolute top-36 sm:top-48 right-8 sm:right-14 lg:right-18 w-24 sm:w-32 h-20 sm:h-28 select-none pointer-events-none opacity-30" viewBox="0 0 100 80" fill="none">
            <path
              d="M85 5 C 60 25, 30 50, 10 75"
              stroke="#F5A300"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          </svg>

          {/* Gráfico Cartesiano com Parábola Sutil */}
          <div className="absolute top-48 sm:top-64 right-3 sm:right-7 lg:right-9 w-24 sm:w-30 h-24 sm:h-30 select-none pointer-events-none opacity-25">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <line x1="50" y1="95" x2="50" y2="10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M46 16 L50 8 L54 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <line x1="5" y1="75" x2="92" y2="75" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M84 71 L92 75 L84 79" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 25 Q50 85 80 25" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </div>

          {/* Fórmula 3: F = ma */}
          <div className="absolute bottom-48 sm:bottom-56 right-12 sm:right-20 lg:right-28 text-white/30 font-serif italic text-lg sm:text-xl lg:text-2xl font-normal select-none pointer-events-none flex items-center gap-1">
            <span className="relative inline-flex flex-col items-center">
              <span className="text-[10px] sm:text-xs -mb-1 not-italic">→</span>
              <span>F</span>
            </span>
            <span>=</span>
            <span>m</span>
            <span className="relative inline-flex flex-col items-center">
              <span className="text-[10px] sm:text-xs -mb-1 not-italic">→</span>
              <span>a</span>
            </span>
          </div>

          {/* Fórmula 4: E = mc² */}
          <div className="absolute bottom-28 sm:bottom-36 right-10 sm:right-16 lg:right-24 text-white/35 font-serif italic text-xl sm:text-2xl lg:text-3xl font-normal select-none pointer-events-none">
            E = mc²
          </div>

          {/* Átomo Estilizado */}
          <div className="absolute bottom-6 sm:bottom-10 right-4 sm:right-8 lg:right-10 w-20 sm:w-26 h-20 sm:h-26 select-none pointer-events-none opacity-30">
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="4.5" fill="#FFC928" />
              <ellipse cx="50" cy="50" rx="42" ry="15" stroke="white" strokeWidth="1.4" transform="rotate(0 50 50)" />
              <circle cx="92" cy="50" r="2.5" fill="white" />
              <ellipse cx="50" cy="50" rx="42" ry="15" stroke="white" strokeWidth="1.4" transform="rotate(60 50 50)" />
              <circle cx="71" cy="86" r="2.5" fill="white" />
              <ellipse cx="50" cy="50" rx="42" ry="15" stroke="white" strokeWidth="1.4" transform="rotate(120 50 50)" />
              <circle cx="29" cy="86" r="2.5" fill="white" />
            </svg>
          </div>
        </div>

        {/* 4. Dotted Matrix Top Left (behind badge) */}
        <div className="absolute left-4 sm:left-8 top-16 sm:top-20 grid grid-cols-6 gap-2 sm:gap-2.5 opacity-30 z-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#3B14E2]" />
          ))}
        </div>

        {/* 5. Dotted Matrix Bottom Left */}
        <div className="absolute left-8 sm:left-12 bottom-12 sm:bottom-16 grid grid-cols-6 gap-2 sm:gap-2.5 opacity-25 z-0 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#3B14E2]" />
          ))}
        </div>

        {/* 6. Selo Circular GEO - Flutuante e sofisticado */}
        <div className="absolute left-2 sm:left-5 lg:left-7 top-4 sm:top-8 z-20 flex items-center justify-center">
          {/* Anel pontilhado dourado sutil */}
          <div className="absolute -inset-2.5 sm:-inset-3 border-2 border-dashed border-[#F5A300] rounded-full animate-[spin_25s_linear_infinite] opacity-90" />

          {/* Badge Principal Branco */}
          <div className="relative w-28 h-28 sm:w-34 sm:h-34 lg:w-36 lg:h-36 rounded-full bg-white shadow-[0_12px_32px_rgba(21,19,43,0.14)] border border-slate-100 flex flex-col items-center justify-center p-2 text-center">
            {/* GEO Logo */}
            <div className="font-heading font-black text-[28px] sm:text-[32px] lg:text-[34px] leading-none tracking-tight text-[#3B14E2] flex items-center justify-center">
              <span>G</span>
              <span className="relative text-[#3B14E2]">
                E
                <span className="absolute top-[42%] left-0 right-0 h-[2.5px] sm:h-[3px] bg-[#F5A300] rounded-full" />
              </span>
              <span>O</span>
            </div>

            {/* Subtítulo GEOVANA ENSINA E ORIENTA */}
            <div className="mt-1 font-heading font-extrabold text-[8px] sm:text-[9px] uppercase tracking-wider text-[#0D0B24] leading-[1.25]">
              GEOVANA<br />
              ENSINA E<br />
              ORIENTA
            </div>
          </div>
        </div>

        {/* 7. Professora Geovana - Retrato original recortado de alta qualidade ocupando 75-80% da altura */}
        <div className="relative z-10 w-[84%] sm:w-[82%] lg:w-[84%] xl:w-[86%] max-w-[620px] flex items-end justify-center ml-auto pr-0 sm:pr-4 pt-2">
          <img
            src={geovanaTransparent}
            alt="Professora Geovana - Aulas Particulares de Matemática e Física"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_45px_rgba(24,8,92,0.28)]"
          />
        </div>

      </div>
    </div>
  );
};
