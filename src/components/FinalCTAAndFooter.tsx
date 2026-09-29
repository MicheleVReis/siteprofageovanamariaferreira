import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Share2, MapPin, Building2, Navigation, Clock } from 'lucide-react';
import { SocialMediaBar } from './SocialMediaBar';

interface FinalCTAAndFooterProps {
  onOpenContact: () => void;
  onOpenTeacherDashboard?: () => void;
}

export const FinalCTAAndFooter: React.FC<FinalCTAAndFooterProps> = ({ onOpenContact, onOpenTeacherDashboard }) => {
  const footerLinks = [
    { label: 'Início', href: '#inicio' },
    { label: 'Cursos e Aulas', href: '#cursos' },
    { label: 'O Método GEO', href: '#metodo' },
    { label: 'Para quem é', href: '#publico' },
    { label: 'Como funciona', href: '#como-funciona' },
    { label: 'Sobre a Geovana', href: '#sobre' },
    { label: 'Localização', href: '#localizacao' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <div className="w-full max-w-[1560px] flex flex-col items-center mt-10">
      {/* 1. SEÇÃO 10: CTA FINAL */}
      <section className="w-full rounded-[36px] bg-gradient-to-br from-[#0D0B24] via-[#1E0E5C] to-[#2E0B99] text-white p-8 sm:p-14 lg:p-18 text-center relative overflow-hidden shadow-[0_25px_60px_rgba(13,11,36,0.4)] border-b-[5px] border-b-[#F5A300]">
        {/* Background Decorative Halos */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#3B14E2]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#F5A300]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#F5A300] text-xs sm:text-sm font-bold uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-[#F5A300]" />
            <span>TRANSFORME SEU APRENDIZADO</span>
          </div>

          {/* Headline */}
          <h2 className="text-[36px] sm:text-[48px] lg:text-[54px] font-extrabold font-heading text-white leading-[1.1] tracking-tight mb-6">
            Seu próximo passo pode{' '}
            <span className="text-[#F5A300]">começar agora.</span>
          </h2>

          {/* Subtext */}
          <p className="text-[17px] sm:text-[19px] text-slate-200/90 leading-relaxed font-body mb-10 max-w-2xl">
            Não importa se você está começando do zero, tentando superar uma dificuldade ou se preparando para uma prova importante. O importante é ter clareza sobre onde você quer chegar e orientação para seguir em frente.
          </p>

          {/* Large Main CTA */}
          <button
            onClick={onOpenContact}
            className="group relative inline-flex items-center justify-center gap-2.5 w-full sm:w-[380px] h-[58px] sm:h-[60px] px-7 rounded-2xl bg-gradient-to-r from-[#F5A300] via-[#FFAE19] to-[#FFC04D] text-[#0D0B24] text-[16px] sm:text-[17px] font-black font-heading shadow-[0_10px_28px_rgba(245,163,0,0.4)] hover:shadow-[0_16px_36px_rgba(245,163,0,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer select-none mb-6"
          >
            <span className="tracking-wide">QUERO COMEÇAR A APRENDER</span>
            <ArrowRight className="w-4.5 h-4.5 text-[#0D0B24] transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Small Brand Accent */}
          <span className="text-sm font-bold text-slate-300 font-heading tracking-wider uppercase">
            GEO — Geovana Ensina e Orienta
          </span>
        </div>
      </section>

      {/* 2. SEÇÃO LOCALIZAÇÃO & ATENDIMENTO PRESENCIAL (COM MAPA) */}
      <section id="localizacao" className="w-full mt-10 p-6 sm:p-10 rounded-3xl bg-white border border-[#E3DCFC] shadow-[0_10px_35px_rgba(59,20,226,0.04)] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Coluna Texto / Detalhes do Espaço */}
          <div className="lg:col-span-5 flex flex-col items-start justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F2EEFF] text-[#3B14E2] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <MapPin className="w-4 h-4 text-[#3B14E2]" />
              <span>Espaço Físico & Atendimento</span>
            </div>

            <h3 className="text-[26px] sm:text-[32px] font-extrabold font-heading text-[#0D0B24] tracking-tight leading-tight mb-3">
              Aulas Presenciais no Centro de Poços de Caldas
            </h3>

            <p className="text-[15.5px] text-[#4A4560] leading-relaxed mb-6 font-body">
              Ambiente preparado para aulas particulares e mentorias individuais com tranquilidade, climatização e foco total no seu aprendizado.
            </p>

            {/* Card com Endereço Completo */}
            <div className="w-full p-4.5 rounded-2xl bg-[#FAF8FF] border border-[#DDD0FE] mb-6 flex items-start gap-3.5 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#3B14E2] to-[#6028E8] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#3B14E2]/25 mt-0.5">
                <Building2 className="w-5.5 h-5.5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-extrabold text-[#0D0B24] font-heading">
                  Rua Prefeito Chagas, 338 — Sala 36
                </span>
                <span className="text-[13px] text-[#5A5572] font-semibold mt-0.5">
                  Centro • Poços de Caldas — MG
                </span>
                <span className="text-[12px] text-[#3B14E2] font-bold mt-1 tracking-wide">
                  CEP: 37701-734
                </span>
              </div>
            </div>

            {/* Ações / Como Chegar */}
            <div className="flex flex-wrap items-center gap-3 w-full">
              <a
                href="https://maps.google.com/?q=Rua+Prefeito+Chagas,+338,+Centro,+Po%C3%A7os+de+Caldas+-+MG,+37701-734"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#3B14E2] hover:bg-[#2F0CA8] text-white font-bold text-xs uppercase tracking-wider font-heading shadow-md shadow-[#3B14E2]/20 hover:-translate-y-0.5 transition-all"
              >
                <Navigation className="w-4 h-4 text-[#F5A300]" />
                <span>Como Chegar no Maps</span>
              </a>

              <a
                href="https://wa.me/5535984121944?text=Ol%C3%A1%20Profa.%20Geovana!%20Gostaria%20de%20saber%20mais%20sobre%20as%20aulas%20presenciais."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#FAF8FF] hover:bg-[#F2EEFF] text-[#0D0B24] border border-[#DDD0FE] font-bold text-xs uppercase tracking-wider font-heading hover:-translate-y-0.5 transition-all"
              >
                <span>Agendar Horário</span>
              </a>
            </div>
          </div>

          {/* Coluna Mapa Interativo com Pin e Controles */}
          <div className="lg:col-span-7 w-full h-[380px] sm:h-[430px] rounded-2xl overflow-hidden border-2 border-[#DDD0FE] shadow-lg relative group">
            <iframe
              title="Mapa de Localização - Rua Prefeito Chagas, 338, Poços de Caldas"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-46.5684249%2C-21.7904294%2C-46.5624249%2C-21.7864294&layer=mapnik&marker=-21.7884294%2C-46.5654249"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              className="w-full h-full object-cover"
            />

            {/* Pin Flutuante com Identificação */}
            <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#DDD0FE] shadow-md flex items-center gap-2 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B14E2] animate-pulse" />
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-[#0D0B24] font-heading leading-tight">
                  Profa. Geovana • Sala 36
                </span>
                <span className="text-[10.5px] text-[#5A5572] font-semibold leading-tight">
                  Rua Prefeito Chagas, 338 • Centro
                </span>
              </div>
            </div>

            {/* Link direto no canto inferior */}
            <a
              href="https://maps.google.com/?q=Rua+Prefeito+Chagas,+338,+Centro,+Po%C3%A7os+de+Caldas+-+MG,+37701-734"
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-4 right-4 z-10 bg-[#0D0B24]/90 hover:bg-[#3B14E2] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5 text-[#F5A300]" />
              <span>Ver no Google Maps</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO REDES SOCIAIS OFICIAIS */}
      <section className="w-full mt-10 p-6 sm:p-8 rounded-3xl bg-white border border-[#E3DCFC] shadow-[0_10px_30px_rgba(59,20,226,0.04)]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[18px] sm:text-[20px] font-extrabold font-heading text-[#0D0B24]">
                Acompanhe a Professora Geovana nas Redes
              </h3>
              <p className="text-xs sm:text-sm text-[#0D0B24]/70 font-medium">
                Conteúdos, dicas de estudo, resoluções de questões e novidades diárias
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-[#3B14E2] uppercase tracking-wider bg-[#F2EEFF] px-3 py-1.5 rounded-full">
            @profa.geovanamaria
          </span>
        </div>

        {/* Social Cards Grid */}
        <SocialMediaBar variant="cards" />
      </section>

      {/* 4. FOOTER */}
      <footer className="w-full py-12 sm:py-16 px-6 sm:px-10 lg:px-12 xl:px-14 flex flex-col items-center justify-between gap-8 text-[#0D0B24]">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-200">
          {/* Logo */}
          <div className="flex items-center gap-3 select-none">
            <div className="flex items-center text-[34px] font-black tracking-tight leading-none text-[#3B14E2] font-heading">
              <span>G</span>
              <span className="relative inline-block mx-[1px]">
                E
                <span className="absolute left-[3px] top-[48%] -translate-y-1/2 w-[14px] h-[4px] bg-[#F5A300] rounded-xs" />
              </span>
              <span>O</span>
            </div>

            <div className="flex flex-col justify-center border-l-2 border-[#0D0B24]/15 pl-3">
              <span className="text-[16px] font-extrabold tracking-tight text-[#0D0B24] font-heading leading-tight">
                Profa. Geovana
              </span>
              <span className="text-[10.5px] font-bold tracking-[0.2em] text-[#0D0B24]/75 uppercase">
                AULAS PARTICULARES
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[14.5px] font-semibold text-[#0D0B24]/80 hover:text-[#3B14E2] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Endereço no rodapé */}
        <div className="w-full text-center text-xs text-[#5A5572] flex flex-wrap items-center justify-center gap-x-2 gap-y-1 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#3B14E2]" />
            Rua Prefeito Chagas, 338 — Sala 36, Centro
          </span>
          <span>•</span>
          <span>Poços de Caldas - MG</span>
          <span>•</span>
          <span>CEP: 37701-734</span>
        </div>

        {/* Copyright and Legal Links */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-[#0D0B24]/70 font-body">
          <p>© 2026 Profa. Geovana Aulas Particulares. Todos os direitos reservados.</p>
          <div className="flex items-center gap-6">
            <a href="#inicio" className="hover:text-[#3B14E2] transition-colors">
              Política de Privacidade
            </a>
            <a href="#inicio" className="hover:text-[#3B14E2] transition-colors">
              Termos de Uso
            </a>
            {onOpenTeacherDashboard && (
              <button
                onClick={onOpenTeacherDashboard}
                className="text-[#3B14E2] font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>👑 Acesso Professora</span>
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};
