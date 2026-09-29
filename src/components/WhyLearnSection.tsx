import React from 'react';
import { Award, CheckCircle, Heart, User, Sparkles, Brain, Eye } from 'lucide-react';

export const WhyLearnSection: React.FC = () => {
  const differentials = [
    {
      badge: 'MÉTODO PRÓPRIO',
      title: 'Método GEO',
      subtitle: 'Geovana Ensina e Orienta',
      description: 'Um método próprio que une ensino, orientação e acompanhamento.',
      icon: Sparkles,
      highlight: true,
    },
    {
      badge: 'CENTRALIDADE NO ALUNO',
      title: 'Abordagem individualizada',
      subtitle: 'Respeito ao seu ritmo',
      description: 'Aulas pensadas considerando suas dificuldades, seu ritmo e seu objetivo.',
      icon: User,
    },
    {
      badge: 'FORMAÇÃO ESPECIALIZADA',
      title: 'Especialização em TDAH',
      subtitle: 'Foco e engajamento',
      description: 'Conhecimento especializado para uma abordagem mais atenta às necessidades de aprendizagem.',
      icon: Brain,
    },
    {
      badge: 'ACOLHIMENTO HUMANO',
      title: 'Especialização em TEA e ABA',
      subtitle: 'Estrutura e clareza',
      description: 'Formação que contribui para um olhar mais individualizado, estruturado e humano.',
      icon: Heart,
    },
  ];

  return (
    <section className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5">
          <Eye className="w-4 h-4 text-[#3B14E2]" />
          <span>AUTORIDADE E DIFERENCIAÇÃO</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-6">
          Uma forma diferente de ensinar.{' '}
          <span className="text-[#3B14E2] block sm:inline">Um olhar diferente para cada aluno.</span>
        </h2>

        {/* Text */}
        <div className="text-[17px] sm:text-[19px] text-[#0D0B24]/85 leading-relaxed font-body max-w-3xl space-y-3">
          <p>Cada pessoa aprende de uma maneira.</p>
          <p>Por isso, ensinar não deveria significar simplesmente repetir a mesma explicação para todo mundo.</p>
          <p className="text-[#3B14E2] font-semibold">
            A experiência e a formação da Geovana permitem uma abordagem mais individualizada, considerando não apenas o conteúdo, mas também as necessidades de aprendizagem de cada aluno.
          </p>
        </div>
      </div>

      {/* 4 Differentials Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 mb-10">
        {differentials.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className={`rounded-[26px] p-7 sm:p-8 border transition-all duration-300 flex flex-col justify-between group ${
                item.highlight
                  ? 'bg-gradient-to-b from-white to-[#F5F2FF] border-[#3B14E2]/30 shadow-[0_12px_30px_rgba(59,20,226,0.08)]'
                  : 'bg-white border-[#EAE3FB] shadow-[0_8px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_16px_36px_rgba(59,20,226,0.1)] hover:-translate-y-1.5'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#3B14E2] shadow-xs group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full bg-[#F2EEFF] text-[#3B14E2]">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-[20px] sm:text-[21px] font-bold font-heading text-[#0D0B24] mb-1">
                  {item.title}
                </h3>

                <span className="text-xs font-bold text-[#F5A300] uppercase tracking-wider block mb-3 font-heading">
                  {item.subtitle}
                </span>

                <p className="text-[15px] sm:text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-[#0D0B24]/70">
                <CheckCircle className="w-3.5 h-3.5 text-[#F5A300]" />
                <span>Abordagem humanizada</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational approach note */}
      <div className="p-4 rounded-2xl bg-[#F4F1FD] border border-[#DDD0FE]/60 text-center max-w-2xl mx-auto">
        <p className="text-xs sm:text-sm text-[#0D0B24]/75 font-body">
          * As formações e especializações em TDAH, TEA e ABA da Professora Geovana fundamentam práticas pedagógicas adaptadas e um acolhimento educacional individualizado.
        </p>
      </div>
    </section>
  );
};
