import React, { useState } from 'react';
import { Check, ArrowRight, ShieldCheck, Zap, Sparkles, ShoppingCart, Award, Clock, Star, Flame, BookOpen, Atom, Users, CheckCircle2 } from 'lucide-react';
import portraitGeovanaReal from '../assets/images/geovana_hero_clean.png';
import portraitGeovanaCutout from '../assets/images/geovana_sem_fundo.png';

interface PricingSectionProps {
  onOpenContact: (courseName?: string) => void;
  onOpenCheckout?: (courseId: any) => void;
}

interface CourseCard {
  id: string;
  badge: string;
  badgeColor: string;
  isPopular?: boolean;
  imageType: 'math' | 'physics' | 'combo' | 'mentoria';
  imageSrc?: string;
  title: string;
  subtitle: string;
  oldPrice: string;
  currentPrice: string;
  installments: string;
  discount: string;
  benefits: string[];
  ctaText: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onOpenContact, onOpenCheckout }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'courses' | 'mentorship'>('all');

  const courses: CourseCard[] = [
    {
      id: 'matematica-zero-avancado',
      badge: '🔥 MAIS PROCURADO',
      badgeColor: 'bg-[#3B14E2] text-white',
      imageType: 'math',
      title: 'Matemática do Zero ao Avançado',
      subtitle: 'Domine a base, álgebra, geometria, funções e raciocínio lógico para ENEM, vestibulares e concursos.',
      oldPrice: 'R$ 497,00',
      currentPrice: 'R$ 297',
      installments: '12x de R$ 29,70',
      discount: '40% OFF',
      benefits: [
        'Curso completo do básico ao avançado',
        'Método GEO com resolução passo a passo',
        'Listas de exercícios com gabarito comentado',
        'Plantão de dúvidas direto no WhatsApp',
        'Acesso por 1 ano + atualizações de aulas',
        'Certificado de conclusão de curso',
      ],
      ctaText: 'Garantir Minha Vaga',
    },
    {
      id: 'fisica-descomplicada',
      badge: '⚡ TEORIA + PRÁTICA',
      badgeColor: 'bg-[#0D0B24] text-[#F5A300]',
      imageType: 'physics',
      title: 'Física Descomplicada & Prática',
      subtitle: 'Aprenda mecânica, termologia, óptica e eletricidade sem decoreba e com aplicação real em provas.',
      oldPrice: 'R$ 497,00',
      currentPrice: 'R$ 297',
      installments: '12x de R$ 29,70',
      discount: '40% OFF',
      benefits: [
        'Módulos completos de todas as frentes da física',
        'Resoluções comentadas das últimas 10 edições do ENEM',
        'Mapas mentais e resumos visuais para baixar',
        'Suporte para tirar dúvidas de exercícios',
        'Acesso por 1 ano completo à plataforma',
        'Simulados temáticos com cronômetro',
      ],
      ctaText: 'Garantir Minha Vaga',
    },
    {
      id: 'combo-exatas-turbo',
      badge: '👑 MAIS VENDIDO • MELHOR ESCOLHA',
      badgeColor: 'bg-gradient-to-r from-[#F5A300] to-[#FFC44D] text-[#0D0B24]',
      isPopular: true,
      imageType: 'combo',
      title: 'Combo Exatas Turbo (Matemática + Física)',
      subtitle: 'A preparação mais completa e com maior custo-benefício para quem deseja gabaritar a prova de Exatas.',
      oldPrice: 'R$ 994,00',
      currentPrice: 'R$ 497',
      installments: '12x de R$ 49,60',
      discount: '50% OFF',
      benefits: [
        'Acesso COMPLETO aos cursos de Matemática e Física',
        'Módulo Bônus: Técnicas de Resolução Rápida para o ENEM',
        'Aulas ao vivo mensais de tira-dúvidas com a Profa. Geovana',
        'Super banco com +1.000 questões resolvidas',
        'Grupo VIP de alunos no Telegram/WhatsApp',
        'Acesso estendido por 2 anos completos',
      ],
      ctaText: 'Garantir Minha Vaga no Combo',
    },
    {
      id: 'mentoria-vip-individual',
      badge: '💎 VAGAS LIMITADAS • INDIVIDUAL',
      badgeColor: 'bg-[#3B14E2] text-[#F5A300]',
      imageType: 'mentoria',
      imageSrc: portraitGeovanaReal,
      title: 'Mentoria VIP 1-on-1 & Aulas Particulares',
      subtitle: 'Acompanhamento individual e exclusivo com a Profa. Geovana para acelerar seu resultado no menor tempo.',
      oldPrice: 'R$ 1.800,00',
      currentPrice: 'R$ 1.297',
      installments: '12x de R$ 129,50',
      discount: 'PREMIUM',
      benefits: [
        'Encontros individuais semanais e ao vivo',
        'Plano de estudos 100% individualizado para seu ritmo',
        'Diagnóstico contínuo e correção personalizada de erros',
        'Acesso direto ao WhatsApp pessoal da Profa. Geovana',
        'Especialista em apoio a alunos com TDAH, TEA e bloqueios',
        'Inclui acesso livre a todos os cursos gravados',
      ],
      ctaText: 'Garantir Minha Vaga VIP',
    },
  ];

  const filteredCourses = courses.filter((course) => {
    if (selectedCategory === 'courses') return course.imageType !== 'mentoria';
    if (selectedCategory === 'mentorship') return course.imageType === 'mentoria';
    return true;
  });

  return (
    <section
      id="cursos"
      className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative bg-[#F8F7FD] scroll-mt-6"
    >
      {/* Fallback anchor for backward compatibility */}
      <div id="planos" className="absolute -top-10 left-0" />

      {/* Decorative ambient gradients */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#3B14E2]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5 shadow-xs">
          <ShoppingCart className="w-4 h-4 text-[#3B14E2]" />
          <span>CURSOS & AULAS PARTICULARES • MATRÍCULAS ABERTAS</span>
        </div>

        {/* Headline */}
        <h2 className="text-[34px] sm:text-[46px] lg:text-[52px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Escolha o curso ideal e transforme seus{' '}
          <span className="text-[#3B14E2]">resultados em Exatas.</span>
        </h2>

        {/* Subheadline */}
        <p className="text-[17px] sm:text-[19px] text-[#0D0B24]/85 leading-relaxed font-body max-w-3xl">
          Metodologia comprovada, aulas dinâmicas e suporte contínuo da Profa. Geovana para você aprender com confiança e conquistar sua aprovação.
        </p>

        {/* Filter Pills */}
        <div className="mt-8 inline-flex p-1.5 bg-white rounded-2xl border border-[#EAE3FB] shadow-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'all'
                ? 'bg-[#3B14E2] text-white shadow-sm'
                : 'text-[#0D0B24]/70 hover:text-[#3B14E2]'
              }`}
          >
            Todos os Cursos
          </button>
          <button
            onClick={() => setSelectedCategory('courses')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'courses'
                ? 'bg-[#3B14E2] text-white shadow-sm'
                : 'text-[#0D0B24]/70 hover:text-[#3B14E2]'
              }`}
          >
            Cursos Gravados
          </button>
          <button
            onClick={() => setSelectedCategory('mentorship')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${selectedCategory === 'mentorship'
                ? 'bg-[#3B14E2] text-white shadow-sm'
                : 'text-[#0D0B24]/70 hover:text-[#3B14E2]'
              }`}
          >
            Mentoria VIP Individual
          </button>
        </div>
      </div>

      {/* Courses Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-7 lg:gap-8 max-w-7xl mx-auto mb-14 items-stretch">
        {filteredCourses.map((course) => {
          const isFeatured = course.isPopular;

          return (
            <div
              key={course.id}
              className={`relative rounded-[30px] transition-all duration-300 flex flex-col justify-between overflow-hidden group ${isFeatured
                  ? 'bg-gradient-to-b from-[#0D0B24] via-[#1A0C54] to-[#2509A6] text-white border-2 border-[#F5A300] shadow-[0_20px_50px_rgba(13,11,36,0.35)] lg:-translate-y-2'
                  : 'bg-white text-[#0D0B24] border border-[#EAE3FB] shadow-[0_10px_30px_rgba(21,19,43,0.06)] hover:shadow-[0_18px_45px_rgba(59,20,226,0.14)] hover:-translate-y-1'
                }`}
            >
              {/* Top Banner & Visual Graphic Cover */}
              <div className="relative w-full h-[185px] overflow-hidden bg-slate-900 shrink-0">
                {course.imageType === 'math' && (
                  <div className="w-full h-full bg-gradient-to-br from-[#1F0769] via-[#3510A6] to-[#0D0B24] flex items-center justify-center relative p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#5B2EFF]/30 via-transparent to-transparent" />
                    {/* Math Visual Elements */}
                    <div className="relative z-10 text-center flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#F5A300] mb-2 shadow-lg group-hover:scale-110 transition-transform">
                        <BookOpen className="w-7 h-7" />
                      </div>
                      <span className="text-[17px] font-black font-heading text-white tracking-tight">
                        MATEMÁTICA TOTAL
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#FFC44D] font-mono font-bold">
                        <span>∫ f(x)dx</span>
                        <span>•</span>
                        <span>∑ n=1</span>
                        <span>•</span>
                        <span>πr²</span>
                      </div>
                    </div>
                  </div>
                )}

                {course.imageType === 'physics' && (
                  <div className="w-full h-full bg-gradient-to-br from-[#0B1538] via-[#152563] to-[#0D0B24] flex items-center justify-center relative p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00D2FF]/20 via-transparent to-transparent" />
                    {/* Physics Visual Elements */}
                    <div className="relative z-10 text-center flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#00E5FF] mb-2 shadow-lg group-hover:scale-110 transition-transform">
                        <Atom className="w-7 h-7" />
                      </div>
                      <span className="text-[17px] font-black font-heading text-white tracking-tight">
                        FÍSICA DESCOMPLICADA
                      </span>
                      <div className="flex items-center gap-2 mt-1 text-xs text-[#00E5FF] font-mono font-bold">
                        <span>E = mc²</span>
                        <span>•</span>
                        <span>F = m·a</span>
                        <span>•</span>
                        <span>V = λ·f</span>
                      </div>
                    </div>
                  </div>
                )}

                {course.imageType === 'combo' && (
                  <div className="w-full h-full bg-gradient-to-br from-[#290B8F] via-[#3B14E2] to-[#F5A300]/40 flex items-center justify-center relative p-4">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#FFC44D]/30 via-transparent to-transparent" />
                    {/* Combo Visual Elements */}
                    <div className="relative z-10 text-center flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F5A300] to-[#FF9E00] flex items-center justify-center text-[#0D0B24] mb-2 shadow-xl group-hover:scale-110 transition-transform">
                        <Sparkles className="w-7 h-7 stroke-[2.5]" />
                      </div>
                      <span className="text-[18px] font-black font-heading text-white tracking-tight">
                        COMBO EXATAS TURBO
                      </span>
                      <span className="text-[11.5px] font-bold text-[#FFC44D] uppercase tracking-wider mt-0.5">
                        Matemática + Física
                      </span>
                    </div>
                  </div>
                )}

                {course.imageType === 'mentoria' && (
                  <div className="w-full h-full relative bg-[#EFE9FF] overflow-hidden flex items-center justify-center">
                    <img
                      src={course.imageSrc || portraitGeovanaReal}
                      alt="Profa. Geovana - Mentoria VIP"
                      className="w-full h-full object-cover object-[center_12%] group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#0D0B24]/30 to-transparent pointer-events-none" />
                  </div>
                )}

                {/* Badge no topo do card */}
                <div className="absolute top-3 left-3 z-20">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md ${course.badgeColor}`}
                  >
                    {course.badge}
                  </span>
                </div>

                {/* Discount Flag */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 rounded-lg bg-[#F5A300] text-[#0D0B24] text-[11px] font-extrabold uppercase shadow-sm">
                    {course.discount}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  {/* Title */}
                  <h3
                    className={`text-[20px] sm:text-[21px] font-extrabold font-heading leading-tight mb-2 ${isFeatured ? 'text-white' : 'text-[#0D0B24]'
                      }`}
                  >
                    {course.title}
                  </h3>

                  {/* Subtitle */}
                  <p
                    className={`text-[13.5px] leading-relaxed mb-6 font-body ${isFeatured ? 'text-slate-300' : 'text-[#0D0B24]/75'
                      }`}
                  >
                    {course.subtitle}
                  </p>

                  {/* Price Box */}
                  <div
                    className={`p-4 rounded-2xl mb-6 ${isFeatured
                        ? 'bg-white/10 border border-white/15'
                        : 'bg-[#FAF8FF] border border-[#EAE3FB]'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-semibold line-through ${isFeatured ? 'text-slate-400' : 'text-[#0D0B24]/50'
                          }`}
                      >
                        De {course.oldPrice}
                      </span>
                      <span className="text-[11px] font-bold text-[#F5A300] uppercase">
                        Por apenas
                      </span>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span
                        className={`text-[17px] font-bold ${isFeatured ? 'text-white' : 'text-[#0D0B24]'
                          }`}
                      >
                        {course.currentPrice}
                      </span>
                      <span
                        className={`text-xs font-semibold ${isFeatured ? 'text-slate-300' : 'text-[#0D0B24]/70'
                          }`}
                      >
                        à vista
                      </span>
                    </div>

                    <p className="text-xs font-extrabold text-[#F5A300] mt-0.5">
                      ou {course.installments}
                    </p>
                  </div>

                  {/* Benefits Topics List */}
                  <div className="space-y-3 mb-6">
                    <span
                      className={`text-[11px] font-extrabold uppercase tracking-wider block font-heading ${isFeatured ? 'text-[#F5A300]' : 'text-[#3B14E2]'
                        }`}
                    >
                      O QUE VOCÊ RECEBE:
                    </span>
                    {course.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${isFeatured
                              ? 'bg-[#F5A300] text-[#0D0B24]'
                              : 'bg-[#F2EEFF] text-[#3B14E2]'
                            }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span
                          className={`text-[13px] leading-snug font-medium ${isFeatured ? 'text-slate-200' : 'text-[#0D0B24]/85'
                            }`}
                        >
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Styled Purchase Button ("Garantir Minha Vaga") */}
                <button
                  onClick={() => {
                    if (onOpenCheckout) {
                      onOpenCheckout(course.id);
                    } else {
                      onOpenContact(course.title);
                    }
                  }}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold font-heading text-[14px] sm:text-[14.5px] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 select-none ${isFeatured
                      ? 'bg-gradient-to-r from-[#F5A300] via-[#FFB726] to-[#FFC44D] text-[#0D0B24] hover:brightness-105 shadow-[0_4px_16px_rgba(245,163,0,0.35)] hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-gradient-to-r from-[#3B14E2] via-[#310EC4] to-[#2509A6] text-white hover:brightness-105 shadow-[0_4px_16px_rgba(59,20,226,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                    }`}
                >
                  <span>{course.ctaText}</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust & Guarantee Banner */}
      <div className="relative z-10 max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE3FB] shadow-[0_10px_30px_rgba(59,20,226,0.05)] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Garantia de 7 Dias
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Risco zero! Se não gostar, devolvemos 100% do seu investimento.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-[#F5A300]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Acesso Imediato
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Receba seus dados de acesso na hora por e-mail e WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold font-heading text-[#0D0B24]">
              Método Comprovado
            </h4>
            <p className="text-xs text-[#0D0B24]/70">
              Mais de centenas de alunos aprovados e com notas acima de 800+.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

