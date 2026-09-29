import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'As aulas são de Matemática e Física?',
      answer:
        'Sim. O trabalho é voltado para o ensino e preparação em Matemática e Física, de acordo com o objetivo e as necessidades do aluno.',
    },
    {
      question: 'Para quem são as aulas?',
      answer:
        'Para pessoas que desejam aprender, superar dificuldades ou se preparar para provas como ENEM, vestibulares e concursos.',
    },
    {
      question: 'Preciso já ter conhecimento da matéria?',
      answer:
        'Não necessariamente. A abordagem parte do nível e das necessidades de cada aluno.',
    },
    {
      question: 'Como funciona o método GEO?',
      answer:
        'GEO significa Geovana Ensina e Orienta. O método combina ensino, orientação e acompanhamento, buscando tornar o processo de aprendizagem mais claro e personalizado.',
    },
    {
      question: 'O método é adequado para pessoas com TDAH ou TEA?',
      answer:
        'A formação da Geovana em TDAH, TEA e ABA contribui para uma abordagem educacional mais individualizada. As aulas não substituem acompanhamento médico, psicológico ou terapêutico.',
    },
    {
      question: 'Posso começar pelo plano mensal?',
      answer:
        'Sim. O plano mensal é uma opção para quem deseja começar e acompanhar a jornada mês a mês.',
    },
    {
      question: 'Qual a diferença entre o plano mensal e o anual?',
      answer:
        'O mensal oferece maior flexibilidade de contratação. O anual foi pensado para quem deseja manter uma jornada contínua e possui um custo mensal equivalente menor.',
    },
    {
      question: 'E se eu ainda não souber qual é o meu objetivo?',
      answer:
        'Tudo bem. A proposta do método GEO também envolve orientação para entender onde você está e quais próximos passos fazem mais sentido para sua jornada.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-14 sm:mb-18">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5">
          <HelpCircle className="w-4 h-4 text-[#3B14E2]" />
          <span>PERGUNTAS FREQUENTES</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Ainda ficou com alguma{' '}
          <span className="text-[#3B14E2]">dúvida?</span>
        </h2>
        <p className="text-[17px] sm:text-[18.5px] text-[#0D0B24]/80 font-body">
          Confira as respostas para as principais dúvidas sobre as aulas e o método GEO.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq.question}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-white border-[#3B14E2]/30 shadow-[0_8px_25px_rgba(59,20,226,0.08)]'
                  : 'bg-white/80 border-[#EAE3FB] hover:border-[#DDD0FE]'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 sm:px-8 py-5 sm:py-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                aria-expanded={isOpen}
              >
                <span className="text-[17px] sm:text-[18.5px] font-bold font-heading text-[#0D0B24] leading-snug">
                  {faq.question}
                </span>
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-[#3B14E2] text-white rotate-180' : 'bg-[#F2EEFF] text-[#3B14E2]'
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </div>
              </button>

              {isOpen && (
                <div className="px-6 sm:px-8 pb-6 pt-1 text-[15.5px] sm:text-[16.5px] text-[#0D0B24]/85 leading-relaxed font-body border-t border-slate-100">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
