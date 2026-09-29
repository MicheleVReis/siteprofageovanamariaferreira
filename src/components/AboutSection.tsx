import React from 'react';
import { User, Sparkles, CheckCircle2, HeartHandshake, Share2 } from 'lucide-react';
import geovana2Img from '../assets/images/geovana_2.png';
import { SocialMediaBar } from './SocialMediaBar';

export const AboutSection: React.FC = () => {
  return (
    <section id="sobre" className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative bg-[#F4F1FD]/80 rounded-[36px] my-6 border border-[#3B14E2]/10">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-4 shadow-xs">
          <User className="w-4 h-4 text-[#3B14E2]" />
          <span>SOBRE MIM</span>
        </div>

        {/* Headline */}
        <h2 className="text-[30px] sm:text-[40px] lg:text-[46px] font-extrabold font-heading text-[#0D0B24] leading-[1.18] tracking-tight">
          Aprender Matemática e Física pode ser uma experiência{' '}
          <span className="bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED] bg-clip-text text-transparent">
            leve, clara e transformadora.
          </span>
        </h2>
      </div>

      {/* Two Column Layout - Perfeitamente alinhado e equilibrado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* Coluna Esquerda: Foto Proporcional da Geovana com Moldura Escultural Limpa */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <div className="relative w-full max-w-[380px] rounded-[32px] bg-gradient-to-b from-[#2E0E9E] via-[#1E0976] to-[#100445] shadow-[0_22px_55px_rgba(20,7,80,0.28)] border-2 border-white/20 group flex flex-col items-center justify-center p-6 sm:p-7">
            {/* Top Light Accent */}
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none rounded-t-[30px]" />
            
            {/* Background Halos */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#F5A300]/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-72 h-72 bg-[#6E3BFF]/35 rounded-full blur-3xl pointer-events-none" />

            {/* Imagem Circular em Destaque Proporcional com Moldura Gradiente */}
            <div className="relative z-10 my-2">
              <div className="relative w-60 h-60 sm:w-68 sm:h-68 rounded-full p-2 bg-gradient-to-tr from-[#F5A300] via-[#FFD166] to-[#7C3AED] shadow-[0_16px_40px_rgba(0,0,0,0.38)]">
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-white to-[#F5F2FF] flex items-center justify-center">
                  <img
                    src={geovana2Img}
                    alt="Professora Geovana"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center scale-105 select-none group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Card de identificação limpo e sem repetições */}
            <div className="relative z-20 w-full max-w-[280px] bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-white/80 shadow-[0_12px_28px_rgba(0,0,0,0.22)] text-center mt-3">
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[13.5px] font-black font-heading text-[#3B14E2] tracking-wider uppercase">
                  Profa. Geovana
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" title="Ativa e Disponível" />
              </div>
              <span className="text-[11px] text-[#4A4560] font-semibold tracking-wide block mt-0.5">
                Matemática & Física
              </span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Conteúdo Textual Limpo, Fluido, sem Poluição Visual */}
        <div className="lg:col-span-7 flex flex-col items-start justify-center">
          {/* Nome sem espaço incorreto no ponto */}
          <h3 className="text-[28px] sm:text-[34px] lg:text-[38px] font-black font-heading text-[#0D0B24] tracking-tight leading-tight mb-4">
            Olá, eu sou a <span className="bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED] bg-clip-text text-transparent">Geovana</span>.
          </h3>

          {/* Parágrafos com narrativa limpa e fluida (sem caixas desnecessárias) */}
          <div className="space-y-3.5 text-[#2D284D] font-body text-[15.5px] sm:text-[17px] leading-relaxed mb-5">
            <p>
              Meu propósito é desmistificar a <strong className="text-[#3B14E2] font-extrabold">Matemática e a Física</strong>, tornando o aprendizado acessível, prático e verdadeiramente significativo.
            </p>
            <p className="text-[#4E4868]">
              Acredito que as dificuldades não surgem por falta de capacidade, mas pela ausência de uma abordagem que respeite o ritmo de cada estudante. É por isso que criei o <strong className="text-[#0D0B24] font-bold">Método GEO (Geovana Ensina e Orienta)</strong> — uma mentoria personalizada que constrói clareza e autonomia nos estudos.
            </p>
          </div>

          {/* Frase / Citação de impacto elegante e integrada */}
          <div className="relative pl-4 border-l-2 border-[#3B14E2] py-0.5 mb-6">
            <p className="text-[15px] sm:text-[16px] font-bold font-heading text-[#3B14E2] italic leading-relaxed">
              “Mais do que ensinar fórmulas, quero ajudar você a encontrar o seu caminho para aprender.”
            </p>
          </div>

          {/* Bloco de Especialidades & Inclusão - Limpo e em 3 colunas simétricas (sem caixas aninhadas) */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4.5 h-4.5 text-[#3B14E2]" />
                <span className="text-[12px] font-black uppercase tracking-wider text-[#3B14E2] font-heading">
                  Ensino Inclusivo & Adaptado
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                Atendimento Individualizado
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3 rounded-xl bg-white border border-[#E9E2FC] text-center shadow-2xs">
                <span className="block font-black font-heading text-[#0D0B24] text-[14px]">
                  TDAH
                </span>
                <span className="text-[11px] text-[#5A5572] font-medium block mt-0.5">
                  Foco & Estrutura
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9E2FC] text-center shadow-2xs">
                <span className="block font-black font-heading text-[#0D0B24] text-[14px]">
                  TEA
                </span>
                <span className="text-[11px] text-[#5A5572] font-medium block mt-0.5">
                  Clareza & Ritmo
                </span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-[#E9E2FC] text-center shadow-2xs">
                <span className="block font-black font-heading text-[#0D0B24] text-[14px]">
                  ABA
                </span>
                <span className="text-[11px] text-[#5A5572] font-medium block mt-0.5">
                  Método Estruturado
                </span>
              </div>
            </div>
          </div>

          {/* Redes Sociais - Rodapé minimalista e harmônico */}
          <div className="w-full pt-4 border-t border-[#DDD0FE]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0D0B24]/75 uppercase tracking-wider font-heading">
              <Share2 className="w-3.5 h-3.5 text-[#3B14E2]" />
              <span>Acompanhe nas redes:</span>
            </div>
            <SocialMediaBar variant="compact" />
          </div>
        </div>

      </div>
    </section>
  );
};
