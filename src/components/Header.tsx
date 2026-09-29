import React, { useState } from 'react';
import { ArrowRight, Menu, X, Lock } from 'lucide-react';
import { NavItem } from '../types';

interface HeaderProps {
  onOpenContact: () => void;
  onOpenStudentPortal?: () => void;
}

const navItems: NavItem[] = [
  { label: 'Início', href: '#inicio', active: true },
  { label: 'Método GEO', href: '#metodo' },
  { label: 'Para Quem É', href: '#publico' },
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Cursos & Aulas', href: '#cursos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Localização', href: '#localizacao' },
  { label: 'FAQ', href: '#faq' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenContact, onOpenStudentPortal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#inicio') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId) || (targetId === 'cursos' ? document.getElementById('planos') : null);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header id="header-nav" className="w-full relative z-30 py-3 sm:py-3.5 px-3 sm:px-6 md:px-7 lg:px-8 flex items-center justify-between border-b border-[#0D0B24]/5 gap-2 sm:gap-4">
      {/* 1. Brand Logo */}
      <a
        href="#inicio"
        id="brand-logo"
        onClick={(e) => handleNavClick(e, '#inicio')}
        className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none group shrink-0"
      >
        {/* Typographic Logo GEO */}
        <div className="flex items-center text-[26px] sm:text-[32px] font-black tracking-tight leading-none text-[#3B14E2] font-heading group-hover:opacity-95 transition-opacity">
          <span>G</span>
          <span className="relative inline-block mx-[1px]">
            E
            {/* Center yellow bar for 'E' */}
            <span className="absolute left-[2px] sm:left-[2.5px] top-[48%] -translate-y-1/2 w-[10px] sm:w-[12px] h-[2.5px] sm:h-[3px] bg-[#F5A300] rounded-xs shadow-[0_1px_3px_rgba(245,163,0,0.4)]"></span>
          </span>
          <span>O</span>
        </div>

        {/* Brand Text Stack */}
        <div className="flex flex-col justify-center border-l border-[#0D0B24]/15 pl-2 sm:pl-2.5">
          <span className="text-[13px] sm:text-[14px] font-extrabold tracking-tight text-[#0D0B24] font-heading leading-tight whitespace-nowrap">
            Profa. Geovana
          </span>
          <span className="text-[8.5px] sm:text-[9.5px] font-bold tracking-[0.16em] text-[#0D0B24]/70 uppercase mt-0.5 whitespace-nowrap">
            AULAS PARTICULARES
          </span>
        </div>
      </a>

      {/* 2. Desktop Navigation Menu */}
      <nav
        id="desktop-menu"
        className="hidden xl:flex items-center gap-2.5 2xl:gap-4 bg-white/85 backdrop-blur-md px-3.5 2xl:px-5 py-1.5 rounded-full border border-[#0D0B24]/8 shadow-[0_2px_12px_rgba(0,0,0,0.03)] whitespace-nowrap shrink"
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            id={`nav-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={(e) => handleNavClick(e, item.href)}
            className={`relative text-[12px] 2xl:text-[13px] font-semibold py-1 px-1.5 transition-all duration-150 whitespace-nowrap shrink-0 flex items-center group ${
              item.active
                ? 'text-[#3B14E2]'
                : 'text-[#0D0B24]/75 hover:text-[#3B14E2]'
            }`}
          >
            <span>{item.label}</span>

            {/* Linha indicadora ativa centrada */}
            {item.active && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-[2px] bg-[#3B14E2] rounded-full shadow-xs"></span>
            )}
          </a>
        ))}
      </nav>

      {/* 3. Right Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        {/* Botão Secundário: Área do Aluno */}
        <button
          id="btn-nav-student-portal"
          onClick={onOpenStudentPortal || onOpenContact}
          className="hidden lg:inline-flex h-9 sm:h-9.5 px-3 sm:px-3.5 items-center gap-1.5 rounded-full bg-white/95 hover:bg-[#F4EFFF] border border-slate-200 hover:border-[#3B14E2]/30 text-slate-700 hover:text-[#3B14E2] text-xs sm:text-[12.5px] font-semibold tracking-tight shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="w-4 h-4 rounded-full bg-[#3B14E2]/10 text-[#3B14E2] flex items-center justify-center shrink-0">
            <Lock className="w-2.5 h-2.5 text-[#3B14E2]" />
          </div>
          <span>Área do Aluno</span>
        </button>

        {/* Botão Primário: Quero Começar */}
        <button
          id="btn-header-cta"
          onClick={onOpenContact}
          className="group relative h-9 sm:h-9.5 px-3.5 sm:px-4.5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#3B14E2] via-[#320EC9] to-[#2509A6] hover:from-[#320EC9] hover:to-[#1C0585] text-white text-xs sm:text-[12.5px] font-bold tracking-wide shadow-[0_4px_14px_rgba(59,20,226,0.3)] hover:shadow-[0_6px_20px_rgba(59,20,226,0.45)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0"
        >
          <span>QUERO COMEÇAR</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#F5A300] group-hover:text-white transition-all duration-150 group-hover:translate-x-0.5 shrink-0" />
        </button>

        {/* Mobile Menu Hamburger Toggle */}
        <div className="flex xl:hidden ml-1">
          <button
            id="btn-mobile-menu"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-xl text-[#0D0B24] hover:bg-[#F1EDFF] transition-colors cursor-pointer"
            aria-label="Alternar menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-5.5 sm:h-5.5" /> : <Menu className="w-5 h-5 sm:w-5.5 sm:h-5.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="absolute top-full left-0 w-full bg-white/98 backdrop-blur-xl border-b border-[#0D0B24]/10 p-5 flex flex-col gap-3 shadow-2xl xl:hidden z-50 rounded-b-2xl animate-fadeIn">
          {/* Action buttons no Mobile */}
          <div className="grid grid-cols-2 gap-2.5 pb-2.5 border-b border-slate-100">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenStudentPortal) onOpenStudentPortal();
                else onOpenContact();
              }}
              className="h-10 flex items-center justify-center gap-2 rounded-full bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold"
            >
              <Lock className="w-3.5 h-3.5 text-[#3B14E2]" />
              <span>Área do Aluno</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="h-10 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white text-xs font-bold shadow-sm"
            >
              <span>Quero Começar</span>
              <ArrowRight className="w-3 h-3 text-[#F5A300]" />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-1 pt-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, item.href);
                }}
                className={`py-2.5 px-3.5 rounded-xl text-sm font-semibold flex items-center justify-between ${
                  item.active
                    ? 'text-[#3B14E2] bg-[#F1EDFF]'
                    : 'text-[#0D0B24]/80 hover:bg-[#F1EDFF]/50'
                }`}
              >
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};




