import React from 'react';
import geovanaHeroMesa from '../assets/images/geovana_hero_mesa.jpg';

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
        <div className="absolute right-0 top-0 sm:top-1 w-[97%] sm:w-[95%] lg:w-[94%] h-[100%] rounded-tl-[280px] sm:rounded-tl-[340px] lg:rounded-tl-[380px] rounded-tr-[100px] sm:rounded-tr-[140px] rounded-bl-[160px] sm:rounded-bl-[200px] rounded-br-[0px] overflow-hidden shadow-[0_30px_70px_rgba(20,7,80,0.38)] z-0 border border-white/15 border-b-0">

          {/* Imagem Principal da Professora Geovana no seu ambiente de ensino */}
          <img
            src={geovanaHeroMesa}
            alt="Professora Geovana - Aulas Particulares de Matemática e Física"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-[center_18%] select-none scale-102"
          />

          {/* Gradiente de iluminação e vinheta cinematográfica suave */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B24] via-[#0D0B24]/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#240A8A]/35 via-transparent to-[#120743]/30 pointer-events-none" />

          {/* Top highlight gradient rim */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />

          {/* Degradê na Base que se conecta perfeitamente ao tom escuro (#0D0B24) da barra de benefícios */}
          <div className="absolute inset-x-0 bottom-0 h-48 sm:h-64 bg-gradient-to-t from-[#0D0B24] via-[#0D0B24]/80 to-transparent pointer-events-none" />


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

      </div>
    </div>
  );
};
