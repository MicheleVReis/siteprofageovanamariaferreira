import React from 'react';

export const MiniBenefits: React.FC = () => {
  return (
    <div
      id="mini-benefits-bar"
      className="w-full relative z-30 bg-[#0D0B24] text-white rounded-[24px] sm:rounded-[26px] p-6 sm:p-7 lg:p-8 shadow-[0_25px_50px_-12px_rgba(13,11,36,0.7),0_0_0_1px_rgba(59,20,226,0.35)] border-b-[4px] border-b-[#F5A300] overflow-hidden"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
        
        {/* Benefício 1: Método exclusivo */}
        <div id="benefit-item-1" className="flex items-start gap-4 lg:px-4 pt-3 lg:pt-0 group">
          {/* Medal / Award Icon */}
          <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-2xl bg-gradient-to-br from-[#4C21E7] via-[#2A1088] to-[#120743] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_10px_24px_-4px_rgba(76,33,231,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 mt-0.5">
            <div className="absolute inset-0 rounded-2xl border border-[#F5A300]/30" />
            
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="18" cy="14" r="9" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.05)" />
              <polygon
                points="18,8.5 20,12.5 24.5,13 21,16 22,20.5 18,18 14,20.5 15,16 11.5,13 16,12.5"
                stroke="#F5A300"
                strokeWidth="1.8"
                fill="#F5A300"
                fillOpacity="0.25"
              />
              <path d="M13 21.5L10 30L18 26L26 30L23 21.5" stroke="white" strokeWidth="2" />
              <path d="M18 22V26" stroke="#F5A300" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="flex flex-col text-left flex-1 min-w-0">
            <h4 className="text-[17px] sm:text-[18px] font-bold font-heading text-white tracking-normal leading-snug">
              Método exclusivo
            </h4>
            <p className="text-[14px] sm:text-[14.5px] font-normal text-slate-200/90 leading-relaxed mt-1.5 font-body">
              Ensino + Orientação personalizada para sua evolução.
            </p>
            {/* Yellow underline accent */}
            <div className="w-10 h-[3px] bg-[#F5A300] rounded-full mt-3 shadow-[0_1px_4px_rgba(245,163,0,0.5)]"></div>
          </div>
        </div>

        {/* Benefício 2: Abordagem individualizada */}
        <div id="benefit-item-2" className="flex items-start gap-4 lg:px-4 pt-5 lg:pt-0 group">
          {/* Brain / Cognition Icon */}
          <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-2xl bg-gradient-to-br from-[#4C21E7] via-[#2A1088] to-[#120743] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_10px_24px_-4px_rgba(76,33,231,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 mt-0.5">
            <div className="absolute inset-0 rounded-2xl border border-[#F5A300]/30" />
            
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M15 7C12 7 9.5 9 9.5 11.5C8 12 7 13.5 7 15.5C7 17.5 8 19 9.5 19.5C9 21.5 10.5 24 13.5 24.5C14.5 24.7 15.5 24.5 16 24V7H15Z"
                stroke="white"
                strokeWidth="2"
                fill="rgba(255,255,255,0.05)"
              />
              <path
                d="M21 7C24 7 26.5 9 26.5 11.5C28 12 29 13.5 29 15.5C29 17.5 28 19 26.5 19.5C27 21.5 25.5 24 22.5 24.5C21.5 24.7 20.5 24.5 20 24V7H21Z"
                stroke="white"
                strokeWidth="2"
                fill="rgba(255,255,255,0.05)"
              />
              <circle cx="18" cy="15.5" r="2.5" fill="#F5A300" stroke="#F5A300" strokeWidth="1" />
              <path d="M18 10V13M18 18V21" stroke="#F5A300" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col text-left flex-1 min-w-0">
            <h4 className="text-[17px] sm:text-[18px] font-bold font-heading text-white tracking-normal leading-snug">
              Abordagem individualizada
            </h4>
            <p className="text-[14px] sm:text-[14.5px] font-normal text-slate-200/90 leading-relaxed mt-1.5 font-body">
              Atenção dedicada ao seu ritmo e às suas necessidades.
            </p>
            <div className="w-10 h-[3px] bg-[#F5A300] rounded-full mt-3 shadow-[0_1px_4px_rgba(245,163,0,0.5)]"></div>
          </div>
        </div>

        {/* Benefício 3: Aprendizado com propósito */}
        <div id="benefit-item-3" className="flex items-start gap-4 lg:px-4 pt-5 lg:pt-0 group">
          {/* Chart / Growth Icon */}
          <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-2xl bg-gradient-to-br from-[#4C21E7] via-[#2A1088] to-[#120743] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_10px_24px_-4px_rgba(76,33,231,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 mt-0.5">
            <div className="absolute inset-0 rounded-2xl border border-[#F5A300]/30" />
            
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="8" y="20" width="4.5" height="8" rx="1.5" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.15)" />
              <rect x="15.5" y="15" width="4.5" height="13" rx="1.5" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.2)" />
              <rect x="23" y="10" width="4.5" height="18" rx="1.5" stroke="white" strokeWidth="1.8" fill="rgba(255,255,255,0.25)" />
              <path
                d="M7 16L15.5 9L27 6"
                stroke="#F5A300"
                strokeWidth="2.4"
              />
              <path
                d="M21 6H27V12"
                stroke="#F5A300"
                strokeWidth="2.4"
              />
            </svg>
          </div>

          <div className="flex flex-col text-left flex-1 min-w-0">
            <h4 className="text-[17px] sm:text-[18px] font-bold font-heading text-white tracking-normal leading-snug">
              Aprendizado com propósito
            </h4>
            <p className="text-[14px] sm:text-[14.5px] font-normal text-slate-200/90 leading-relaxed mt-1.5 font-body">
              Mais compreensão, mais prática e mais resultados.
            </p>
            <div className="w-10 h-[3px] bg-[#F5A300] rounded-full mt-3 shadow-[0_1px_4px_rgba(245,163,0,0.5)]"></div>
          </div>
        </div>

        {/* Benefício 4: Especialista em TDAH • TEA • ABA */}
        <div id="benefit-item-4" className="flex items-start gap-4 lg:px-4 pt-5 lg:pt-0 group">
          {/* Human Care & Inclusivity Icon */}
          <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] rounded-2xl bg-gradient-to-br from-[#4C21E7] via-[#2A1088] to-[#120743] border border-white/20 flex items-center justify-center shrink-0 shadow-[0_10px_24px_-4px_rgba(76,33,231,0.5),inset_0_2px_4px_rgba(255,255,255,0.3)] transition-transform duration-300 group-hover:scale-105 mt-0.5">
            <div className="absolute inset-0 rounded-2xl border border-[#F5A300]/30" />
            
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="15" cy="11" r="5" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.08)" />
              <path d="M7 27C7 22.5 10.5 19 15 19C17.2 19 19.2 19.9 20.6 21.3" stroke="white" strokeWidth="2" />
              <path
                d="M26 19C24.5 17.5 22 17.8 21 19.5C20 17.8 17.5 17.5 16 19C14.5 20.8 14.8 23.5 21 28C27.2 23.5 27.5 20.8 26 19Z"
                stroke="#F5A300"
                strokeWidth="2"
                fill="#F5A300"
                fillOpacity="0.3"
              />
            </svg>
          </div>

          <div className="flex flex-col text-left flex-1 min-w-0">
            <h4 className="text-[15px] sm:text-[16px] font-bold font-heading text-white tracking-normal leading-snug">
              Especialista em
            </h4>
            <div className="text-[16px] sm:text-[17px] font-extrabold text-white font-heading tracking-wide flex items-center gap-1.5 mt-1">
              <span>TDAH</span>
              <span className="text-[#F5A300] text-[10px]">●</span>
              <span>TEA</span>
              <span className="text-[#F5A300] text-[10px]">●</span>
              <span>ABA</span>
            </div>
            <p className="text-[13.5px] sm:text-[14px] font-normal text-slate-200/90 leading-relaxed mt-1.5 font-body">
              Formação especializada para um acolhimento humano e individualizado.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
