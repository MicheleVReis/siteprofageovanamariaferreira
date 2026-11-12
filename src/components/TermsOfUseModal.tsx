import React, { useEffect } from 'react';
import { X, Scale, FileText, CheckCircle2, AlertTriangle, ShieldAlert, Mail, MapPin, ExternalLink, Ban, Clock } from 'lucide-react';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ isOpen, onClose }) => {
  // Fechar com a tecla ESC
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
        <div className="bg-gradient-to-r from-[#0D0B24] via-[#1E0E5C] to-[#3B14E2] text-white px-6 sm:px-8 py-5 sm:py-6 relative flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#F5A300]">
              <Scale className="w-6 h-6 text-[#F5A300]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10.5px] font-black tracking-wider uppercase bg-[#F5A300]/20 text-[#F5A300] px-2.5 py-0.5 rounded-full border border-[#F5A300]/30">
                  Regras e Condições da Plataforma
                </span>
                <span className="text-xs text-white/70">
                  Atualizado em 05/11/2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-heading text-white tracking-tight mt-0.5">
                Termos de Uso
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
              <FileText className="w-5 h-5 text-[#3B14E2]" />
              <span>Bem-vindo a Geovana Maria Ferreira Aulas Particulares!</span>
            </div>
            <p>
              Estes Termos de Uso ("Termos") regem o acesso e a utilização do nosso site, plataforma de ensino, cursos, aulas e materiais disponibilizados por nós.
            </p>
            <p className="font-semibold text-slate-900">
              Ao acessar o site ou adquirir nossos produtos/serviços, você concorda expressamente com estes Termos. Caso não concorde com qualquer disposição, recomendamos que não utilize nossa plataforma.
            </p>
          </div>

          {/* 1. Cadastro e Conta de Usuário */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">1</span>
              Cadastro e Conta de Usuário
            </h3>
            <div className="space-y-3 text-slate-700">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">👤 Capacidade:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Para se cadastrar e adquirir nossos cursos, você deve ser maior de idade (18 anos) ou estar devidamente emancipado, ou contar com a devida assistência de seus responsáveis legais.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">📋 Veracidade dos Dados:</span>
                <span className="text-slate-600 text-xs sm:text-sm">
                  Você se compromete a fornecer informações verdadeiras, completas e atualizadas no momento do cadastro, mantendo-as sempre atualizadas.
                </span>
              </div>
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/90 text-amber-950">
                <span className="font-bold text-amber-900 block mb-1">🔐 Segurança da Senha:</span>
                <span className="text-amber-900 text-xs sm:text-sm">
                  Sua conta é pessoal e intransferível. Você é o único responsável por manter a confidencialidade da sua senha e por todas as atividades realizadas na sua conta. O compartilhamento de senhas ou de acessos à plataforma é proibido e pode resultar no cancelamento da conta sem direito a reembolso.
                </span>
              </div>
            </div>
          </section>

          {/* 2. Propriedade Intelectual */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">2</span>
              Propriedade Intelectual
            </h3>
            <p className="text-slate-600">
              Todo o conteúdo disponibilizado na plataforma — incluindo, mas não se limitando a vídeos, videoaulas, textos, apostilas, e-books, logotipos, marcas, códigos de programação, design e estruturas de layout — é de propriedade exclusiva de <strong>Geovana Maria Ferreira Aulas Particulares</strong> ou de seus instrutores parceiros, sendo protegido pelas leis de direitos autorais e propriedade intelectual.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-[#0D0B24] block mb-1">🎓 Licença de Uso:</span>
              <p className="text-slate-600 text-xs sm:text-sm">
                A compra de um curso concede a você uma licença limitada, pessoal, intransferível, revogável e não exclusiva para acessar e assistir ao conteúdo para fins estritamente educacionais e particulares.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <Ban className="w-4 h-4 text-rose-600 shrink-0" />
                <span>É expressamente proibido:</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-rose-900 pl-2">
                <li>• Copiar, baixar (salvar em disco local sem autorização expressa), reproduzir, distribuir, comercializar, reutilizar ou realizar engenharia reversa de qualquer material da plataforma.</li>
                <li>• Compartilhar links de acesso restrito ou revender o acesso aos cursos a terceiros.</li>
              </ul>
            </div>
          </section>

          {/* 3. Pagamentos, Preços e Política de Reembolso */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">3</span>
              Pagamentos, Preços e Política de Reembolso
            </h3>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="font-bold text-[#0D0B24] block mb-1">💳 Preços e Formas de Pagamento:</span>
                <p className="text-slate-600 text-xs sm:text-sm">
                  Os valores dos cursos e formas de pagamento disponíveis estão informados de maneira clara no site. Reservamo-nos o direito de alterar os preços dos cursos a qualquer momento, sem aviso prévio, respeitando as compras já finalizadas.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950 space-y-1.5">
                <span className="font-bold text-emerald-900 block font-heading text-sm">
                  🛡️ Garantia e Reembolso:
                </span>
                <p className="text-emerald-900 text-xs sm:text-sm">
                  Em conformidade com o Código de Defesa do Consumidor (para compras online), você tem o direito de solicitar o reembolso integral do valor pago no prazo de até <strong>7 (sete) dias corridos</strong> contados a partir da data da confirmação da compra, desde que não haja uso abusivo da plataforma.
                </p>
                <p className="text-emerald-800 text-xs font-medium pt-1">
                  Após o prazo legal de 7 dias (ou conforme regras específicas de campanhas promocionais divulgadas no ato da compra), os valores pagos não serão restituídos.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Regras de Conduta na Plataforma */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">4</span>
              Regras de Conduta na Plataforma
            </h3>
            <p className="text-slate-600">
              Ao interagir em nossa plataforma (fóruns, comentários de aulas, suporte ou comunidades associadas), você concorda em não:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
              <p>• Publicar conteúdo difamatório, ofensivo, racista, discriminatório, que viole a privacidade alheia ou que incentive atividades ilegais.</p>
              <p>• Enviar vírus, softwares maliciosos ou tentar corromper a segurança e o funcionamento técnico do site.</p>
              <p>• Utilizar a plataforma para fins de spam, captação indevida de clientes ou divulgação de produtos concorrentes.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-900 text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>O descumprimento dessas regras poderá acarretar a suspensão imediata ou o cancelamento definitivo da conta, sem direito a reembolso.</span>
            </div>
          </section>

          {/* 5. Disponibilidade do Serviço e Modificações */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">5</span>
              Disponibilidade do Serviço e Modificações
            </h3>
            <div className="space-y-2.5 text-slate-700 text-xs sm:text-sm">
              <p>
                Esforçamo-nos para manter a plataforma disponível 24 horas por dia, 7 dias por semana. No entanto, podem ocorrer interrupções temporárias devido a manutenções programadas, atualizações ou falhas técnicas imprevistas.
              </p>
              <p>
                Podemos modificar, descontinuar ou atualizar os cursos, materiais e funcionalidades do site periodicamente, visando a melhoria contínua da experiência de ensino.
              </p>
            </div>
          </section>

          {/* 6. Limitação de Responsabilidade */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">6</span>
              Limitação de Responsabilidade
            </h3>
            <div className="space-y-2.5 text-slate-700 text-xs sm:text-sm">
              <p>
                Os cursos e materiais têm caráter educacional e informativo. Não garantimos resultados profissionais, financeiros ou acadêmicos específicos, uma vez que o sucesso depende do esforço, dedicação e aplicação individual de cada aluno.
              </p>
              <p>
                Não nos responsabilizamos por instabilidades na conexão de internet do usuário, falhas em dispositivos de acesso ou por prejuízos decorrentes do uso inadequado da plataforma.
              </p>
            </div>
          </section>

          {/* 7. Links para Sites de Terceiros */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">7</span>
              Links para Sites de Terceiros
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Nosso site pode conter links para sites externos ou ferramentas de parceiros (como gateways de pagamento). Não exercemos controle sobre esses sites e não nos responsabilizamos pelo conteúdo, políticas de privacidade ou práticas de terceiros.
            </p>
          </section>

          {/* 8. Alterações destes Termos de Uso */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">8</span>
              Alterações destes Termos de Uso
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Reservamo-nos o direito de alterar estes Termos de Uso a qualquer momento. As modificações entrarão em vigor imediatamente após a sua publicação no site. O uso continuado da plataforma após a publicação das alterações constitui sua concordância com os novos termos.
            </p>
          </section>

          {/* 9. Legislação Aplicável e Foro */}
          <section className="space-y-3">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">9</span>
              Legislação Aplicável e Foro
            </h3>
            <p className="text-slate-600 text-xs sm:text-sm">
              Estes Termos são regidos pelas leis da República Federativa do Brasil. Eventuais controvérsias oriundas destes termos serão submetidas ao foro da comarca de <strong>Poços de Caldas / MG</strong>, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>
          </section>

          {/* 10. Contato */}
          <section className="space-y-3 bg-gradient-to-br from-[#FAF8FF] to-[#F1EDFF] p-6 rounded-2xl border border-[#DDD0FE]">
            <h3 className="text-lg font-black font-heading text-[#0D0B24] flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#3B14E2] text-white flex items-center justify-center text-xs font-bold">10</span>
              Contato
            </h3>
            <p className="text-slate-700 text-xs sm:text-sm">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
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
