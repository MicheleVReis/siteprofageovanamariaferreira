import { CourseId } from '../types';
import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Atom,
  CheckCircle2,
  Sparkles,
  BookOpen,
  MessageCircle,
  FileText,
  Download,
  Video,
  Zap,
  Layers,
  ArrowRight
} from 'lucide-react';

interface LessonsSectionProps {
  activeSubject?: 'Matemática' | 'Física';
  onSelectSubject?: (subject: 'Matemática' | 'Física') => void;
  onOpenContact: (courseName?: string) => void;
  onOpenPortal?: () => void;
  onOpenRegister?: (courseId?: CourseId) => void;
  onOpenCheckout?: (courseId: CourseId) => void;
  isLoggedIn?: boolean;
}

export const LessonsSection: React.FC<LessonsSectionProps> = ({
  activeSubject: externalSubject,
  onSelectSubject: externalOnSelect,
  onOpenContact,
  onOpenPortal,
  onOpenRegister,
  onOpenCheckout,
  isLoggedIn = false
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'Todas' | 'Matemática' | 'Física'>('Todas');

  // Sincroniza se o usuário selecionar pelo menu
  useEffect(() => {
    if (externalSubject) {
      setSelectedFilter(externalSubject);
    }
  }, [externalSubject]);

  useEffect(() => {
    const handleCustomSelect = (e: Event) => {
      const customEvent = e as CustomEvent<'Matemática' | 'Física'>;
      if (customEvent.detail) {
        setSelectedFilter(customEvent.detail);
        if (externalOnSelect) externalOnSelect(customEvent.detail);
      }
    };
    window.addEventListener('geo:select-subject', handleCustomSelect);
    return () => window.removeEventListener('geo:select-subject', handleCustomSelect);
  }, [externalOnSelect]);

  const handleFilterClick = (filter: 'Todas' | 'Matemática' | 'Física') => {
    setSelectedFilter(filter);
    if (filter !== 'Todas' && externalOnSelect) {
      externalOnSelect(filter);
    }
  };

  const showMath = selectedFilter === 'Todas' || selectedFilter === 'Matemática';
  const showPhysics = selectedFilter === 'Todas' || selectedFilter === 'Física';

  return (
    <section
      id="aulas"
      className="w-full max-w-[1560px] py-16 sm:py-24 px-6 sm:px-10 lg:px-12 xl:px-14 relative scroll-mt-10"
    >
      {/* Âncoras dedicadas para navegação direta do menu */}
      <div id="matematica" className="absolute -top-24 left-0 pointer-events-none" />
      <div id="fisica" className="absolute -top-24 left-0 pointer-events-none" />

      {/* Luzes de fundo suaves */}
      <div className="absolute top-1/4 left-1/4 w-[550px] h-[350px] bg-[#3B14E2]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[350px] bg-[#7C3AED]/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Cabeçalho da Seção */}
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F2EEFF] border border-[#DDD0FE] text-[#3B14E2] text-[13px] sm:text-[14px] font-bold uppercase tracking-wider mb-5 shadow-xs">
          <Sparkles className="w-4 h-4 text-[#F5A300]" />
          <span>CURSOS ONLINE COMPLETOS + MATERIAL EM PDF</span>
        </div>

        <h2 className="text-[32px] sm:text-[44px] lg:text-[50px] font-extrabold font-heading text-[#0D0B24] leading-[1.12] tracking-tight mb-4">
          Cursos Online de{' '}
          <span className="bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED] bg-clip-text text-transparent">
            Matemática & Física
          </span>
        </h2>

        <p className="text-[16px] sm:text-[18.5px] text-[#0D0B24]/85 leading-relaxed font-body max-w-3xl">
          Estude no seu próprio ritmo com videoaulas didáticas, passo a passo e sem decoreba. Acompanha material didático exclusivo em PDF para download com resumos e listas comentadas.
        </p>

        {/* Botões de Filtro Rápido */}
        <div className="flex flex-wrap items-center justify-center p-1.5 mt-8 bg-white rounded-full border border-slate-200/80 shadow-[0_4px_20px_rgba(59,20,226,0.06)] gap-1.5 sm:gap-2">
          <button
            onClick={() => handleFilterClick('Todas')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-extrabold font-heading transition-all cursor-pointer ${
              selectedFilter === 'Todas'
                ? 'bg-[#0D0B24] text-white shadow-xs'
                : 'text-slate-600 hover:text-[#3B14E2] hover:bg-[#F4EFFF]'
            }`}
          >
            VER TODOS OS CURSOS
          </button>

          <button
            onClick={() => handleFilterClick('Matemática')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-extrabold font-heading transition-all flex items-center gap-2 cursor-pointer ${
              selectedFilter === 'Matemática'
                ? 'bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white shadow-md shadow-[#3B14E2]/25'
                : 'text-slate-600 hover:text-[#3B14E2] hover:bg-[#F4EFFF]'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>CURSO DE MATEMÁTICA</span>
          </button>

          <button
            onClick={() => handleFilterClick('Física')}
            className={`px-4 sm:px-6 py-2 rounded-full text-xs sm:text-[13px] font-extrabold font-heading transition-all flex items-center gap-2 cursor-pointer ${
              selectedFilter === 'Física'
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white shadow-md shadow-[#7C3AED]/25'
                : 'text-slate-600 hover:text-[#7C3AED] hover:bg-[#F4EFFF]'
            }`}
          >
            <Atom className="w-3.5 h-3.5" />
            <span>CURSO DE FÍSICA</span>
          </button>
        </div>
      </div>

      {/* Grid de Cards: Matemática & Física */}
      <div className={`grid grid-cols-1 ${showMath && showPhysics ? 'lg:grid-cols-2' : 'max-w-4xl mx-auto'} gap-8 lg:gap-8 items-stretch`}>
        
        {/* ======================================================== */}
        {/* CARD 1: CURSO DE MATEMÁTICA */}
        {/* ======================================================== */}
        {showMath && (
          <div
            id="card-aulas-matematica"
            className="relative bg-white rounded-[32px] p-7 sm:p-9 lg:p-10 border-2 border-[#DDD0FE] shadow-[0_15px_40px_rgba(59,20,226,0.06)] hover:shadow-[0_20px_50px_rgba(59,20,226,0.12)] transition-all duration-300 flex flex-col justify-between group overflow-hidden"
          >
            {/* Top highlight bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#3B14E2] via-[#5B2EFF] to-[#7C3AED]" />

            <div>
              {/* Badge + Ícone */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F2EEFF] text-[#3B14E2] border border-[#DDD0FE]">
                  <Video className="w-3.5 h-3.5 text-[#3B14E2]" />
                  <span>VIDEOAULAS NO SEU RITMO + MATERIAL EM PDF</span>
                </span>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F2EEFF] to-[#E5DCFF] text-[#3B14E2] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Calculator className="w-6 h-6 text-[#3B14E2]" />
                </div>
              </div>

              {/* Título & Subtítulo */}
              <h3 className="text-[24px] sm:text-[28px] font-extrabold font-heading text-[#0D0B24] leading-snug mb-3">
                Curso de Matemática
              </h3>

              <p className="text-[15px] sm:text-[16px] text-[#0D0B24]/80 leading-relaxed font-body mb-6">
                Construa uma base matemática sólida do zero ao avançado. Assista às videoaulas quando e onde quiser e pratique com material completo em PDF com resoluções comentadas.
              </p>

              {/* Como funciona o curso */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#3B14E2] mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Como funciona o Curso de Matemática:</span>
                </h4>

                <ul className="space-y-2.5">
                  {[
                    'Videoaulas em alta resolução para assistir no seu tempo e ritmo, quantas vezes precisar',
                    'Explicação visual do raciocínio matemático passo a passo, sem decoreba',
                    'Apostilas teóricas e resumos ilustrados em PDF para baixar e imprimir',
                    'Listas de exercícios selecionados do ENEM, vestibulares e concursos com gabarito comentado',
                    'Suporte para tirar dúvidas de exercícios no WhatsApp com a Profa. Geovana'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[14px] text-slate-700 leading-snug">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tópicos Abordados */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#3B14E2]" />
                  <span>Módulos inclusos no curso:</span>
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Matemática Básica do Zero',
                    'Frações, Razão & Porcentagem',
                    'Álgebra & Equações',
                    'Funções (1º e 2º Grau)',
                    'Geometria Plana & Espacial',
                    'Trigonometria',
                    'Análise Combinatória',
                    'Probabilidade & Estatística',
                    'Raciocínio Lógico para Provas'
                  ].map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold hover:bg-[#F2EEFF] hover:text-[#3B14E2] transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Material em PDF incluso */}
              <div className="p-4 rounded-2xl bg-[#F8F7FD] border border-[#E8E1FB] mb-6">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0D0B24] mb-2 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#3B14E2]" />
                  <span>Material Didático em PDF Incluso:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todas as aulas acompanham cadernos de apoio em PDF, mapas mentais para revisão rápida e listas de exercícios resolvidas passo a passo para você baixar e treinar onde quiser.
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (isLoggedIn && onOpenPortal) {
                    onOpenPortal();
                  } else if (onOpenCheckout) {
                    onOpenCheckout('matematica-zero-avancado');
                  } else if (onOpenContact) {
                    onOpenContact('Quero comprar o Curso de Matemática');
                  }
                }}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] hover:brightness-105 text-white text-sm font-bold font-heading shadow-md shadow-[#3B14E2]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F5A300]" />
                <span>{isLoggedIn ? 'Acessar Aulas de Matemática' : 'Comprar Curso de Matemática • R$ 297'}</span>
                <ArrowRight className="w-4 h-4 text-[#F5A300]" />
              </button>

              <a
                href="https://wa.me/5535984121944?text=Ol%C3%A1%20Profa.%20Geovana!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20o%20Curso%20de%20Matem%C3%A1tica."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tirar Dúvidas</span>
              </a>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* CARD 2: CURSO DE FÍSICA */}
        {/* ======================================================== */}
        {showPhysics && (
          <div
            id="card-aulas-fisica"
            className="relative bg-white rounded-[32px] p-7 sm:p-9 lg:p-10 border-2 border-[#E9D5FF] shadow-[0_15px_40px_rgba(124,58,237,0.06)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] transition-all duration-300 flex flex-col justify-between group overflow-hidden"
          >
            {/* Top highlight bar */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#7C3AED] via-[#9333EA] to-[#3B14E2]" />

            <div>
              {/* Badge + Ícone */}
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#F5EEFF] text-[#7C3AED] border border-[#DDD0FE]">
                  <Video className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>VIDEOAULAS NO SEU RITMO + MATERIAL EM PDF</span>
                </span>

                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F5EEFF] to-[#EDE2FE] text-[#7C3AED] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <Atom className="w-6 h-6 text-[#7C3AED]" />
                </div>
              </div>

              {/* Título & Subtítulo */}
              <h3 className="text-[24px] sm:text-[28px] font-extrabold font-heading text-[#0D0B24] leading-snug mb-3">
                Curso de Física
              </h3>

              <p className="text-[15px] sm:text-[16px] text-[#0D0B24]/80 leading-relaxed font-body mb-6">
                Descomplique a Física sem decoreba. Aulas com explicações visuais intuitivas, esquemas gráficos claros e materiais em PDF com resoluções comentadas.
              </p>

              {/* Como funciona o curso */}
              <div className="mb-6 pb-6 border-b border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#7C3AED] mb-3 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  <span>Como funciona o Curso de Física:</span>
                </h4>

                <ul className="space-y-2.5">
                  {[
                    'Videoaulas com didática visual para você entender o porquê de cada fórmula',
                    'Interpretação detalhada de gráficos de movimento, vetores e esquemas físicos',
                    'Apostilas teóricas em PDF com linguagem simples e ilustrações explicativas',
                    'Formulários inteligentes resumidos e mapas conceituais em PDF para download',
                    'Resoluções passo a passo das últimas edições do ENEM e provas oficiais'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-[14px] text-slate-700 leading-snug">
                      <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tópicos Abordados */}
              <div className="mb-6">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#7C3AED]" />
                  <span>Módulos inclusos no curso:</span>
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Cinemática (MRU & MRUV)',
                    'Leis de Newton & Dinâmica',
                    'Trabalho, Potência & Energia',
                    'Termologia & Calorimetria',
                    'Gases & Termodinâmica',
                    'Óptica Geométrica & Lentes',
                    'Ondulatória & Acústica',
                    'Eletrodinâmica & Circuitos',
                    'Eletromagnetismo'
                  ].map((topic, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-700 text-xs font-semibold hover:bg-[#F5EEFF] hover:text-[#7C3AED] transition-colors"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Material em PDF incluso */}
              <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-[#EAE3FB] mb-6">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#0D0B24] mb-2 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Material Didático em PDF Incluso:</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Formulários inteligentes resumidos, mapas mentais dos conceitos-chave, apostilas completas em PDF e suporte de dúvidas direto no WhatsApp com a Profa. Geovana.
                </p>
              </div>
            </div>

            {/* Ações */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  if (isLoggedIn && onOpenPortal) {
                    onOpenPortal();
                  } else if (onOpenCheckout) {
                    onOpenCheckout('fisica-descomplicada');
                  } else if (onOpenContact) {
                    onOpenContact('Quero comprar o Curso de Física');
                  }
                }}
                className="flex-1 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] hover:brightness-105 text-white text-sm font-bold font-heading shadow-md shadow-[#7C3AED]/25 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Sparkles className="w-4 h-4 text-[#F5A300]" />
                <span>{isLoggedIn ? 'Acessar Aulas de Física' : 'Comprar Curso de Física • R$ 297'}</span>
                <ArrowRight className="w-4 h-4 text-[#F5A300]" />
              </button>

              <a
                href="https://wa.me/5535984121944?text=Ol%C3%A1%20Profa.%20Geovana!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20o%20Curso%20de%20F%C3%ADsica."
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-5 rounded-2xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Tirar Dúvidas</span>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Barra de Vantagens dos Cursos */}
      <div className="mt-12 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-[#EAE3FB] shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-extrabold text-[#0D0B24] font-heading">No Seu Ritmo</h5>
            <p className="text-[11px] sm:text-xs text-slate-500">Assista onde e quando quiser, pause e reveja</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-extrabold text-[#0D0B24] font-heading">Material em PDF</h5>
            <p className="text-[11px] sm:text-xs text-slate-500">Apostilas, resumos e listas para baixar</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-[#F5A300]" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-extrabold text-[#0D0B24] font-heading">Acesso Imediato</h5>
            <p className="text-[11px] sm:text-xs text-slate-500">Liberação rápida na plataforma após inscrição</p>
          </div>
        </div>

        <a
          href="https://wa.me/5535984121944?text=Ol%C3%A1%20Profa.%20Geovana!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3.5 p-1 rounded-xl hover:bg-[#F2EEFF]/60 transition-colors cursor-pointer"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
            <MessageCircle className="w-5 h-5 text-[#25D366]" />
          </div>
          <div>
            <h5 className="text-xs sm:text-sm font-extrabold text-[#0D0B24] font-heading">Suporte WhatsApp</h5>
            <p className="text-[11px] sm:text-xs text-slate-500">Tira-dúvidas direto com a professora</p>
          </div>
        </a>
      </div>
    </section>
  );
};
