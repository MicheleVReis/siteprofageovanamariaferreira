import React from 'react';
import { Target, BookOpen, Flame, GraduationCap, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';

interface TargetAudienceSectionProps {
  onOpenContact: () => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({ onOpenContact }) => {
  return (
    <section id="publico" className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative bg-[#F4F1FD]/60 rounded-[36px] my-6 border border-[#3B14E2]/10">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-14 sm:mb-18">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5 shadow-xs">
          <Target className="w-4 h-4 text-[#3B14E2]" />
          <span>PARA QUEM É O MÉTODO</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-6">
          Não importa onde você está hoje.{' '}
          <span className="text-[#3B14E2] block sm:inline">Importa onde você quer chegar.</span>
        </h2>

        {/* Intro text */}
        <div className="text-[17px] sm:text-[18.5px] text-[#0D0B24]/85 leading-relaxed font-body max-w-2xl space-y-2">
          <p>Talvez você tenha dificuldade em Matemática.</p>
          <p>Talvez Física pareça complicada demais.</p>
          <p>Talvez já tenha tentado estudar sozinho e sentido que não estava evoluindo.</p>
          <p>Ou talvez você simplesmente queira se preparar melhor para uma prova importante.</p>
          <p className="pt-2 text-[#3B14E2] font-semibold">
            O método GEO foi pensado para diferentes momentos, diferentes necessidades e diferentes objetivos.
          </p>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-14">
        {/* Card 1: QUERO APRENDER */}
        <div className="bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_18px_40px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#3B14E2] mb-6 shadow-xs group-hover:scale-105 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold font-heading text-[#0D0B24] mb-3 flex items-center gap-2">
              <span>QUERO APRENDER</span>
            </h3>

            <p className="text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Para quem quer construir uma base mais sólida e realmente compreender Matemática e Física.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#3B14E2]">
            <CheckCircle2 className="w-4 h-4 text-[#F5A300]" />
            <span>Fundamentos & Compreensão</span>
          </div>
        </div>

        {/* Card 2: PRECISO SUPERAR DIFICULDADES */}
        <div className="bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_18px_40px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF9E6] to-[#FFF0C2] border border-[#FFE28A] flex items-center justify-center text-[#D68500] mb-6 shadow-xs group-hover:scale-105 transition-transform">
              <Flame className="w-7 h-7" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold font-heading text-[#0D0B24] mb-3">
              PRECISO SUPERAR DIFICULDADES
            </h3>

            <p className="text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Para quem sente que possui lacunas, trava em determinados conteúdos ou precisa recuperar a confiança.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#3B14E2]">
            <CheckCircle2 className="w-4 h-4 text-[#F5A300]" />
            <span>Destrave & Autonomia</span>
          </div>
        </div>

        {/* Card 3: ENEM E VESTIBULAR */}
        <div className="bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_18px_40px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#3B14E2] mb-6 shadow-xs group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold font-heading text-[#0D0B24] mb-3">
              ENEM E VESTIBULAR
            </h3>

            <p className="text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Para quem quer estudar com direção e se preparar melhor para provas que podem transformar seu futuro.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#3B14E2]">
            <CheckCircle2 className="w-4 h-4 text-[#F5A300]" />
            <span>Foco no Edital & Estratégia</span>
          </div>
        </div>

        {/* Card 4: CONCURSOS */}
        <div className="bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_18px_40px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#240A8A] mb-6 shadow-xs group-hover:scale-105 transition-transform">
              <Trophy className="w-7 h-7" />
            </div>

            <h3 className="text-[20px] sm:text-[22px] font-bold font-heading text-[#0D0B24] mb-3">
              CONCURSOS
            </h3>

            <p className="text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
              Para quem precisa de preparação, prática e estratégia para enfrentar provas de alta exigência.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#3B14E2]">
            <CheckCircle2 className="w-4 h-4 text-[#F5A300]" />
            <span>Alto Desempenho & Resolução</span>
          </div>
        </div>
      </div>

      {/* Final highlight statement & CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 sm:p-8 rounded-[24px] bg-white border border-[#DDD0FE] shadow-[0_8px_20px_rgba(21,19,43,0.03)]">
        <div className="flex items-center gap-4">
          <div className="w-3 h-12 bg-gradient-to-b from-[#3B14E2] to-[#F5A300] rounded-full hidden sm:block" />
          <p className="text-[18px] sm:text-[21px] font-extrabold font-heading text-[#0D0B24] leading-snug">
            Seu objetivo pode ser diferente.{' '}
            <span className="text-[#3B14E2]">O cuidado com o seu aprendizado não.</span>
          </p>
        </div>

        <button
          onClick={onOpenContact}
          className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-[#3B14E2] hover:bg-[#310EC4] text-white font-bold font-heading text-[15.5px] shadow-[0_8px_20px_rgba(59,20,226,0.3)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer shrink-0"
        >
          <span>QUERO COMEÇAR A APRENDER</span>
          <ArrowRight className="w-4 h-4 text-[#F5A300]" />
        </button>
      </div>
    </section>
  );
};
