import React from 'react';
import { Route, CheckCircle, Search, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'ENTENDEMOS SEU OBJETIVO',
      description: 'Identificamos onde você está e o que deseja alcançar.',
      icon: Search,
    },
    {
      number: '02',
      title: 'IDENTIFICAMOS SUAS DIFICULDADES',
      description: 'Entendemos quais conteúdos precisam de mais atenção e quais são seus principais desafios.',
      icon: Lightbulb,
    },
    {
      number: '03',
      title: 'ENSINAMOS E ORIENTAMOS',
      description: 'As aulas são conduzidas de forma clara e personalizada, respeitando seu momento e suas necessidades.',
      icon: CheckCircle,
    },
    {
      number: '04',
      title: 'ACOMPANHAMOS SUA EVOLUÇÃO',
      description: 'Você pratica, desenvolve compreensão e avança com mais segurança em direção ao seu objetivo.',
      icon: TrendingUp,
    },
  ];

  return (
    <section id="como-funciona" className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 sm:mb-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5">
          <Route className="w-4 h-4 text-[#3B14E2]" />
          <span>PASSO A PASSO</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Um caminho mais claro para você{' '}
          <span className="text-[#3B14E2]">aprender e evoluir.</span>
        </h2>
        <p className="text-[17px] sm:text-[18.5px] text-[#0D0B24]/80 font-body">
          Um processo estruturado, humano e focado em resultados reais de longo prazo.
        </p>
      </div>

      {/* Steps Grid with connected visual pathway */}
      <div className="relative">
        {/* Desktop connecting progress line */}
        <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#3B14E2] via-[#F5A300] to-[#3B14E2] -z-0 rounded-full" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-[26px] p-7 sm:p-8 border border-[#EAE3FB] shadow-[0_8px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_16px_36px_rgba(59,20,226,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-start group"
              >
                {/* Step circle indicator with gold dot */}
                <div className="flex items-center justify-between w-full mb-6">
                  <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center shadow-[0_8px_18px_rgba(59,20,226,0.3)] group-hover:scale-105 transition-transform">
                    <Icon className="w-7 h-7" />
                    {/* Gold indicator dot */}
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#F5A300] border-2 border-white shadow-xs" />
                  </div>

                  <span className="text-[28px] font-black font-heading text-[#0D0B24]/20 group-hover:text-[#3B14E2]/40 transition-colors">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-[17px] sm:text-[18.5px] font-bold font-heading text-[#0D0B24] mb-3 leading-snug">
                  {step.title}
                </h3>

                <p className="text-[15px] sm:text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
