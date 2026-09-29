import React from 'react';
import { Sparkles, Brain, ShieldCheck, Lightbulb, Compass, Award, HeartHandshake, Quote } from 'lucide-react';

export const TransformationsSection: React.FC = () => {
  const transformations = [
    {
      title: 'Mais compreensão',
      description: 'Pare de decorar sem entender. Desenvolva uma visão mais clara dos conteúdos.',
      icon: Brain,
      color: '#3B14E2',
    },
    {
      title: 'Mais confiança',
      description: 'Entenda o raciocínio por trás dos exercícios e enfrente desafios com mais segurança.',
      icon: ShieldCheck,
      color: '#F5A300',
    },
    {
      title: 'Mais autonomia',
      description: 'Aprenda a pensar, resolver problemas e identificar caminhos para chegar às respostas.',
      icon: Lightbulb,
      color: '#3B14E2',
    },
    {
      title: 'Mais direção',
      description: 'Saiba o que estudar e onde concentrar seus esforços.',
      icon: Compass,
      color: '#240A8A',
    },
    {
      title: 'Mais preparação',
      description: 'Chegue mais preparado para provas, vestibulares, ENEM e concursos.',
      icon: Award,
      color: '#F5A300',
    },
    {
      title: 'Mais tranquilidade',
      description: 'Tenha acompanhamento e orientação durante sua jornada de aprendizagem.',
      icon: HeartHandshake,
      color: '#3B14E2',
    },
  ];

  return (
    <section className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative bg-[#FAF9FF]">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16 sm:mb-20">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5">
          <Sparkles className="w-4 h-4 text-[#3B14E2]" />
          <span>TRANSFORMAÇÃO REAL</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Quando você entende,{' '}
          <span className="text-[#3B14E2]">tudo começa a mudar.</span>
        </h2>
        <p className="text-[17px] sm:text-[19px] text-[#0D0B24]/80 font-body max-w-2xl">
          A transformação vai muito além da nota: é sobre recuperar o prazer de aprender e a certeza da sua capacidade.
        </p>
      </div>

      {/* 6 Transformations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {transformations.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white rounded-[26px] p-8 border border-[#EAE3FB] shadow-[0_8px_25px_rgba(21,19,43,0.04)] hover:shadow-[0_18px_40px_rgba(59,20,226,0.1)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-start group"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5F2FF] to-[#EAE2FF] border border-[#DDD0FE] flex items-center justify-center text-[#3B14E2] mb-6 shadow-xs group-hover:scale-105 transition-transform">
                <Icon className="w-7 h-7" />
              </div>

              <h3 className="text-[20px] sm:text-[22px] font-bold font-heading text-[#0D0B24] mb-3">
                {item.title}
              </h3>

              <p className="text-[15.5px] text-[#0D0B24]/80 leading-relaxed font-body">
                {item.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Highlight Quotation Box */}
      <div className="relative rounded-[28px] bg-gradient-to-br from-[#0D0B24] via-[#1E0E5C] to-[#2509A6] p-8 sm:p-12 text-white text-center shadow-[0_20px_50px_rgba(13,11,36,0.3)] border-b-[4px] border-b-[#F5A300] max-w-4xl mx-auto overflow-hidden">
        <div className="absolute top-6 left-8 text-white/10">
          <Quote className="w-16 h-16" />
        </div>

        <div className="relative z-10">
          <p className="text-[22px] sm:text-[28px] lg:text-[32px] font-extrabold font-heading leading-tight tracking-tight max-w-2xl mx-auto">
            “O objetivo não é apenas acertar uma questão.{' '}
            <span className="text-[#F5A300]">
              É fazer você entender por que a resposta faz sentido.
            </span>”
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <span className="w-8 h-[2px] bg-[#F5A300]" />
            <span className="text-sm uppercase tracking-widest text-slate-300 font-bold font-heading">
              Método GEO
            </span>
            <span className="w-8 h-[2px] bg-[#F5A300]" />
          </div>
        </div>
      </div>
    </section>
  );
};
