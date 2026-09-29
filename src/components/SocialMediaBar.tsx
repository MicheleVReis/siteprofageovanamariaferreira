import React from 'react';
import { Instagram, Facebook, MessageCircle, Youtube, Video } from 'lucide-react';

export interface SocialNetwork {
  id: string;
  name: string;
  label: string;
  sublabel?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  hoverBg: string;
  hoverBorder: string;
  gradientText?: string;
}

export const socialNetworksList: SocialNetwork[] = [
  {
    id: 'instagram',
    name: 'Instagram',
    label: '@profa.geovanamaria',
    sublabel: 'Dicas & Bastidores',
    href: 'https://instagram.com/profa.geovanamaria',
    icon: Instagram,
    accentColor: '#3B14E2',
    hoverBg: 'hover:bg-[#3B14E2] hover:text-white',
    hoverBorder: 'hover:border-[#3B14E2] hover:shadow-[0_10px_25px_rgba(59,20,226,0.25)]',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    label: '(35) 98412-1944',
    sublabel: 'Atendimento Direto',
    href: 'https://wa.me/5535984121944',
    icon: MessageCircle,
    accentColor: '#3B14E2',
    hoverBg: 'hover:bg-[#3B14E2] hover:text-white',
    hoverBorder: 'hover:border-[#3B14E2] hover:shadow-[0_10px_25px_rgba(59,20,226,0.25)]',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    label: '@geovanamariaferreira3307',
    sublabel: 'Aulas & Resoluções',
    href: 'https://www.youtube.com/@geovanamariaferreira3307',
    icon: Youtube,
    accentColor: '#3B14E2',
    hoverBg: 'hover:bg-[#3B14E2] hover:text-white',
    hoverBorder: 'hover:border-[#3B14E2] hover:shadow-[0_10px_25px_rgba(59,20,226,0.25)]',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    label: '@geomaria298',
    sublabel: 'Vídeos Rápidos',
    href: 'https://www.tiktok.com/@geomaria298',
    icon: Video,
    accentColor: '#3B14E2',
    hoverBg: 'hover:bg-[#3B14E2] hover:text-white',
    hoverBorder: 'hover:border-[#3B14E2] hover:shadow-[0_10px_25px_rgba(59,20,226,0.25)]',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    label: 'Geovana Maria Ferreira',
    sublabel: 'Perfil Oficial',
    href: 'https://www.facebook.com/search/top?q=Geovana%20Maria%20Ferreira',
    icon: Facebook,
    accentColor: '#3B14E2',
    hoverBg: 'hover:bg-[#3B14E2] hover:text-white',
    hoverBorder: 'hover:border-[#3B14E2] hover:shadow-[0_10px_25px_rgba(59,20,226,0.25)]',
  },
];

interface SocialMediaBarProps {
  variant?: 'compact' | 'cards' | 'floating';
  className?: string;
  showLabels?: boolean;
}

export const SocialMediaBar: React.FC<SocialMediaBarProps> = ({
  variant = 'cards',
  className = '',
  showLabels = false,
}) => {
  if (variant === 'compact') {
    return (
      <div className={`flex flex-wrap items-center gap-2 sm:gap-2.5 ${className}`}>
        {socialNetworksList.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${item.name} da Professora Geovana`}
              title={`${item.name} - ${item.label}`}
              className="group relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FAF8FF] border border-[#DDD0FE] text-[#3B14E2] transition-all duration-200 hover:-translate-y-1 hover:bg-[#3B14E2] hover:border-[#3B14E2] hover:text-white shadow-[0_2px_8px_rgba(59,20,226,0.06)] hover:shadow-[0_8px_20px_rgba(59,20,226,0.25)]"
            >
              <Icon className="w-5 h-5 stroke-[2] transition-transform duration-200 group-hover:scale-110" />
              {showLabels && (
                <span className="text-xs font-bold font-heading text-[#0D0B24] tracking-tight group-hover:text-white transition-colors ml-2">
                  {item.name}
                </span>
              )}
            </a>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 ${className}`}>
      {socialNetworksList.map((item) => {
        const Icon = item.icon;
        return (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex flex-col p-4 rounded-2xl bg-[#FAF8FF] backdrop-blur-sm border border-[#DDD0FE] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#3B14E2] hover:bg-white hover:shadow-[0_12px_30px_rgba(59,20,226,0.12)]"
          >
            {/* Top row: Icon + Name */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#F2EEFF] text-[#3B14E2] transition-all duration-300 group-hover:bg-[#3B14E2] group-hover:text-white group-hover:scale-110 shadow-sm">
                <Icon className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <span className="text-[10.5px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border text-[#3B14E2] border-[#DDD0FE] bg-[#F2EEFF] group-hover:border-[#3B14E2]/40 transition-colors">
                {item.name}
              </span>
            </div>

            {/* Bottom info */}
            <div className="flex flex-col">
              <span className="text-[13.5px] font-bold font-heading text-[#0D0B24] group-hover:text-[#3B14E2] transition-colors truncate">
                {item.label}
              </span>
              {item.sublabel && (
                <span className="text-[11.5px] text-[#0D0B24]/60 font-medium truncate mt-0.5">
                  {item.sublabel}
                </span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};
