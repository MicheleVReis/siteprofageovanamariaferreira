import React, { useEffect } from 'react';
import { X, Shield, Lock, FileText, CheckCircle2, Mail, MapPin, ExternalLink } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#070E27] via-[#0E1E45] to-[#1D4ED8] text-white px-6 sm:px-8 py-5 sm:py-6 relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-sky-300">
              <Shield className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-black tracking-wider uppercase bg-sky-400/20 text-sky-200 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  Proteção de Dados & LGPD
                </span>
                <span className="text-xs text-white/70">
                  Atualizado em 05/11/2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight mt-0.5">
                Política de Privacidade
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-7 text-[#0D0B24] font-body text-sm sm:text-[15px] leading-relaxed">
          
          {/* Apresentação Inicial */}
          <div className="p-5 rounded-2xl bg-[#FAF8FF] border border-[#DDD0FE] text-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-[#3B14E2] font-black font-heading text-base">
              <Lock className="w-5 h-5 text-[#3B14E2]" />
              <span>Compromisso com a sua Privacidade e Segurança</span>
            </div>
            <p>
              A sua privacidade é de extrema importância para nós. Esta Política de Privacidade descreve como <strong>Geovana Maria Ferreira Aulas Particulares</strong>, coleta, usa, armazena e protege as informações dos usuários e visitantes do nosso site de cursos e aulas.
            </p>
            <p className="font-medium text-slate-900">
              Ao utilizar nossa plataforma, adquirir nossos cursos ou se cadastrar em nossas aulas, você concorda com as práticas descritas neste documento.
            </p>
          </div>

          {/* 1. Informações que Coletamos */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">1</span>
              Informações que Coletamos
            </h3>
            <p className="text-slate-600">
              Podemos coletar dados pessoais de diferentes maneiras, dependendo de como você interage com o nosso site:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">📋 Dados de Cadastro:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Nome completo, e-mail, CPF/CNPJ, número de telefone e endereço, fornecidos no momento do registro na plataforma ou na compra de um curso.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">💳 Dados de Pagamento:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Informações relativas a transações financeiras (como dados de cartão de crédito, que são processados por gateways de pagamento seguros terceirizados; nós não armazenamos o número completo do seu cartão).
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">🌐 Dados de Navegação e Uso:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Endereço IP, tipo de navegador, páginas visitadas, tempo de permanência, cliques e interações com as aulas, vídeos e materiais da plataforma.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">💬 Dados de Comunicação:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Mensagens enviadas por você através do nosso suporte, chat, e-mails ou redes sociais.
                </span>
              </div>
            </div>
          </section>

          {/* 2. Como Utilizamos Seus Dados */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">2</span>
              Como Utilizamos Seus Dados
            </h3>
            <p className="text-slate-600">
              As informações coletadas são utilizadas para os seguintes propósitos:
            </p>
            <ul className="space-y-2.5 text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Fornecer e Gerenciar os Serviços:</strong> Permitir o seu acesso aos cursos, aulas, materiais complementares e certificados de conclusão.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Processamento de Pagamentos:</strong> Confirmar transações e prevenir fraudes financeiras.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Comunicação e Suporte:</strong> Enviar avisos importantes sobre o andamento dos cursos, atualizações de aulas, recuperação de senha e responder a dúvidas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Marketing e Ofertas:</strong> Enviar newsletters, promoções e informações sobre novos cursos (você pode optar por cancelar o recebimento a qualquer momento).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Melhoria da Plataforma:</strong> Analisar o comportamento de uso para aprimorar a experiência de ensino, a qualidade dos vídeos e a navegação no site.</span>
              </li>
            </ul>
          </section>

          {/* 3. Compartilhamento de Informações */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">3</span>
              Compartilhamento de Informações
            </h3>
            <p className="text-slate-600">
              Nós não vendemos ou alugamos os seus dados pessoais. O compartilhamento ocorre apenas com parceiros essenciais para a prestação do serviço, tais como:
            </p>
            <div className="space-y-2 text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <p>
                • <strong>Processadores de Pagamento:</strong> Para viabilizar cobranças seguras (ex: Stripe, PayPal, Pagar.me, InfinitePay, etc.).
              </p>
              <p>
                • <strong>Plataformas de Hospedagem e E-mail Marketing:</strong> Para envio de aulas, materiais e comunicações automatizadas.
              </p>
              <p>
                • <strong>Obrigações Legais:</strong> Caso seja exigido por lei, ordem judicial ou autoridades competentes.
              </p>
            </div>
          </section>

          {/* 4. Segurança dos Dados */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">4</span>
              Segurança dos Dados
            </h3>
            <p className="text-slate-600">
              Adotamos medidas técnicas e organizacionais de segurança da informação (como criptografia SSL, controle de acesso e servidores seguros) para proteger os seus dados contra acessos não autorizados, perda, alteração ou destruição. No entanto, nenhum sistema na internet é 100% seguro, razão pela qual recomendamos que você também proteja sua senha de acesso.
            </p>
          </section>

          {/* 5. Seus Direitos */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">5</span>
              Seus Direitos
            </h3>
            <p className="text-slate-600">
              De acordo com as leis de proteção de dados aplicáveis, você tem direito a:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 mb-0.5">Confirmação e Acesso</strong>
                <span className="text-xs text-slate-600">Saber se tratamos seus dados e solicitar uma cópia deles.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 mb-0.5">Correção</strong>
                <span className="text-xs text-slate-600">Solicitar a correção de dados incompletos, inexatos ou desatualizados.</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 mb-0.5">Eliminação</strong>
                <span className="text-xs text-slate-600">Requerer a exclusão de seus dados pessoais (ressalvadas as hipóteses legais de guarda obrigatória).</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <strong className="block text-slate-900 mb-0.5">Revogação do Consentimento</strong>
                <span className="text-xs text-slate-600">Retirar a autorização para o envio de e-mails de marketing a qualquer momento.</span>
              </div>
            </div>
            <p className="text-slate-700 pt-1 font-medium">
              Para exercer seus direitos, entre em contato conosco através do e-mail:{' '}
              <a href="mailto:profa.geovanaferreira@gmail.com" className="text-[#3B14E2] font-bold underline">
                profa.geovanaferreira@gmail.com
              </a>
              .
            </p>
          </section>

          {/* 6. Cookies e Tecnologias de Rastreamento */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">6</span>
              Cookies e Tecnologias de Rastreamento
            </h3>
            <p className="text-slate-600">
              Utilizamos cookies e tecnologias similares para melhorar a sua experiência de navegação, lembrar preferências e analisar o tráfego do site. Você pode configurar o seu navegador para recusar cookies, embora isso possa afetar algumas funcionalidades da plataforma de ensino.
            </p>
          </section>

          {/* 7. Alterações nesta Política de Privacidade */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">7</span>
              Alterações nesta Política de Privacidade
            </h3>
            <p className="text-slate-600">
              Podemos atualizar esta Política de Privacidade periodicamente. A versão mais recente estará sempre disponível nesta página, com a data de atualização revisada. Recomendamos que você a consulte regularmente.
            </p>
          </section>

          {/* 8. Contato */}
          <section className="space-y-3 bg-gradient-to-br from-[#FAF8FF] to-[#F1EDFF] p-6 rounded-2xl border border-[#DDD0FE]">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">8</span>
              Contato
            </h3>
            <p className="text-slate-700">
              Se você tiver dúvidas, comentários ou solicitações referentes a esta Política de Privacidade, entre em contato conosco:
            </p>
            <div className="space-y-2 pt-1 text-slate-800 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#3B14E2] shrink-0" />
                <span>
                  <strong>E-mail:</strong>{' '}
                  <a href="mailto:profa.geovanaferreira@gmail.com" className="text-[#3B14E2] font-bold underline">
                    profa.geovanaferreira@gmail.com
                  </a>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#3B14E2] shrink-0 mt-0.5" />
                <span>
                  <strong>Endereço:</strong> Rua Prefeito Chagas, 338 — Sala 36 - Centro • Poços de Caldas — MG
                </span>
              </div>
            </div>
          </section>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © 2026 Geovana Maria Ferreira Aulas Particulares. Todos os direitos reservados.
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] hover:from-[#2E0B99] hover:to-[#1E0E5C] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            Entendido e Concordo
          </button>
        </div>
      </div>
    </div>
  );
};

