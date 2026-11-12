import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  PlayCircle,
  FileText,
  CheckCircle2,
  Circle,
  BookOpen,
  Sparkles,
  Trash2,
  ExternalLink,
  Video,
  LogOut,
  Clock,
  Layers,
  Search,
  MessageCircle,
  Lock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { CourseId, Lesson, LessonMaterial, UserAccount } from '../types';
import {
  COURSES_CATALOG,
  getStoredLessons,
  saveLessons,
  addLesson,
  deleteLesson,
  hasCourseAccess
} from '../services/storage';

interface StudentPortalPageProps {
  currentUser: UserAccount;
  initialSubject?: 'Matemática' | 'Física';
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenTeacherDashboard?: () => void;
  onOpenCheckout?: (courseId: CourseId) => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  currentUser,
  onLogout,
  onBackToHome,
  onOpenTeacherDashboard,
  initialSubject = 'Todos'
}) => {
  const [lessons, setLessons] = useState<Lesson[]>(() => getStoredLessons());

  // Determinar dinamicamente a matéria inicial com base no curso que o aluno comprou
  const getInitialSubject = (): 'Todos' | 'Matemática' | 'Física' => {
    if (currentUser.role === 'teacher') return 'Todos';
    const courses = currentUser.enrolledCourses || [];
    if (courses.includes('mentoria-vip-individual') || courses.includes('mentoria-vip-10-meses')) {
      return 'Todos';
    }
    if (courses.includes('fisica-descomplicada') && !courses.includes('matematica-zero-avancado')) {
      return 'Física';
    }
    if (courses.includes('matematica-zero-avancado') && !courses.includes('fisica-descomplicada')) {
      return 'Matemática';
    }
    return 'Todos';
  };

  const [selectedSubject, setSelectedSubject] = useState<'Todos' | 'Matemática' | 'Física'>(getInitialSubject);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'Todos' | CourseId>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingMaterial, setViewingMaterial] = useState<LessonMaterial | null>(null);

  // Modal de inclusão de nova aula (para a professora ou admin)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<'Matemática' | 'Física' | 'Geral'>('Matemática');
  const [newCourseId, setNewCourseId] = useState<CourseId>('matematica-zero-avancado');
  const [newModule, setNewModule] = useState('Módulo 1: Fundamentos');
  const [newDescription, setNewDescription] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDuration, setNewDuration] = useState('45 min');
  const [newNotes, setNewNotes] = useState('');
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialsList, setMaterialsList] = useState<LessonMaterial[]>([]);

  // Filtragem considerando busca, matéria e curso
  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject = selectedSubject === 'Todos' || lesson.subject === selectedSubject;
    const matchesCourse = selectedCourseFilter === 'Todos' || lesson.courseId === selectedCourseFilter;
    const matchesSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesCourse && matchesSearch;
  });

  // A primeira aula liberada por padrão do acervo do aluno
  const firstAllowedOverall = lessons.find((l) => hasCourseAccess(currentUser, l.courseId));
  const firstAllowedInFilter = filteredLessons.find((l) => hasCourseAccess(currentUser, l.courseId)) || filteredLessons[0];

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    () => firstAllowedOverall?.id || firstAllowedInFilter?.id || lessons[0]?.id || ''
  );

  const activeLesson = lessons.find((l) => l.id === selectedLessonId) || firstAllowedInFilter || lessons[0];
  const isCurrentLessonAllowed = activeLesson ? hasCourseAccess(currentUser, activeLesson.courseId) : false;

  const handleToggleCompleted = (lessonId: string) => {
    const lesson = lessons.find(l => l.id === lessonId);
    if (!lesson || !hasCourseAccess(currentUser, lesson.courseId)) return;

    const updated = lessons.map((l) =>
      l.id === lessonId ? { ...l, completed: !l.completed } : l
    );
    setLessons(updated);
    saveLessons(updated);
  };

  const handleDeleteLesson = (lessonId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta aula?')) {
      deleteLesson(lessonId);
      const updated = lessons.filter((l) => l.id !== lessonId);
      setLessons(updated);
      if (selectedLessonId === lessonId && updated.length > 0) {
        setSelectedLessonId(updated[0].id);
      }
    }
  };


  const handleDownloadPDF = (material: LessonMaterial) => {
    const lessonTitle = activeLesson?.title || 'Aula Oficial';
    const lessonSubject = activeLesson?.subject || 'Matemática e Física';
    const lessonModule = activeLesson?.module || 'Módulo 1: Fundamentos';

    const printHtml = `
      <!DOCTYPE html>
      <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>${material.title} - Profa. Geovana Ferreira</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #0D0B24;
              margin: 0;
              padding: 24px;
              line-height: 1.6;
            }
            .header {
              border-bottom: 3px solid #3B14E2;
              padding-bottom: 16px;
              margin-bottom: 24px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .title-area h1 {
              margin: 0 0 6px 0;
              color: #1C0585;
              font-size: 22px;
            }
            .title-area p {
              margin: 0;
              font-size: 13px;
              color: #4B5563;
              font-weight: 600;
            }
            .badge {
              display: inline-block;
              background: #F2EEFF;
              color: #3B14E2;
              border: 1px solid #DDD0FE;
              padding: 4px 12px;
              border-radius: 9999px;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 8px;
            }
            .card {
              background: #FAF8FF;
              border: 1px solid #EAE3FB;
              border-radius: 12px;
              padding: 16px;
              margin-bottom: 20px;
            }
            .card h3 {
              margin: 0 0 8px 0;
              font-size: 14px;
              color: #3B14E2;
              text-transform: uppercase;
              letter-spacing: 0.03em;
            }
            .section {
              margin-bottom: 24px;
            }
            .section h2 {
              font-size: 16px;
              color: #0D0B24;
              border-left: 4px solid #F5A300;
              padding-left: 10px;
              margin: 0 0 12px 0;
            }
            ul, ol {
              margin: 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
              font-size: 13px;
            }
            .highlight-box {
              background: #FFFBEB;
              border: 1px solid #FDE68A;
              border-left: 4px solid #F5A300;
              padding: 12px 16px;
              border-radius: 8px;
              margin-top: 16px;
              font-size: 13px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 16px;
              border-top: 1px solid #E5E7EB;
              font-size: 11px;
              color: #6B7280;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title-area">
              <span class="badge">Apostila & Material Oficial • Profa. Geovana Ferreira</span>
              <h1>${material.title}</h1>
              <p>${lessonSubject} • ${lessonModule}</p>
            </div>
            <div style="text-align: right; font-size: 11px; color: #6B7280;">
              <strong>Plataforma GEO</strong><br>
              Aluno: ${currentUser.name}
            </div>
          </div>

          <div class="card">
            <h3>Conteúdo de Referência</h3>
            <p style="margin: 0; font-size: 13px; color: #374151;">
              <strong>Aula:</strong> ${lessonTitle}<br>
              ${activeLesson?.description || 'Material complementar desenvolvido para acompanhamento dos conceitos abordados em aula e prática dirigida de exercícios.'}
            </p>
          </div>

          <div class="section">
            <h2>1. Resumo Teórico & Pontos Essenciais</h2>
            <ul>
              <li><strong>Compreensão Conceitual:</strong> Entenda o significado de cada grandeza antes de aplicar qualquer fórmula matemática ou física.</li>
              <li><strong>Padrões de Questão:</strong> Identifique as palavras-chave no enunciado (ex.: repouso, velocidade constante, raiz da função, ponto máximo/mínimo).</li>
              <li><strong>Análise de Gráficos e Tabelas:</strong> Pratique a leitura atenta dos eixos e das unidades de medida antes de iniciar os cálculos.</li>
            </ul>
          </div>

          <div class="section">
            <h2>2. Dica de Resolução da Professora Geovana</h2>
            <div class="highlight-box">
              <strong>💡 Macete Exclusivo:</strong> ${activeLesson?.notes || 'Separe os dados do enunciado, faça um esboço gráfico rápido e revise os sinais das contas básicas.'}
            </div>
          </div>

          <div class="section">
            <h2>3. Exercícios Práticos & Checklist de Revisão</h2>
            <ol>
              <li>Refaça os 3 primeiros exercícios do caderno sem olhar a resolução comentada.</li>
              <li>Cronometre uma média de 3 minutos por questão para simular o ritmo de prova do ENEM e vestibulares.</li>
              <li>Anote as dúvidas e envie diretamente no WhatsApp da Profa. Geovana para destravar o conteúdo.</li>
            </ol>
          </div>

          <div class="footer">
            <span>© 2026 Profa. Geovana Ferreira • Matemática e Física Descomplicada</span>
            <span>WhatsApp Tira-Dúvidas: (35) 98412-1944</span>
          </div>
        </body>
      </html>
    `;

    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(printHtml);
      printWin.document.close();
      printWin.onload = () => {
        setTimeout(() => printWin.print(), 300);
      };
    }
  };

  const handleAddMaterialToForm = () => {
    if (!materialTitle.trim()) return;
    setMaterialsList([
      ...materialsList,
      {
        id: `mat-${Date.now()}`,
        title: materialTitle.trim(),
        url: materialUrl.trim() || '#',
        type: 'pdf'
      }
    ]);
    setMaterialTitle('');
    setMaterialUrl('');
  };

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    // Converter link do youtube normal em embed se necessário
    let finalVideoUrl = newVideoUrl.trim();
    if (finalVideoUrl.includes('watch?v=')) {
      finalVideoUrl = finalVideoUrl.replace('watch?v=', 'embed/');
    } else if (finalVideoUrl.includes('youtu.be/')) {
      finalVideoUrl = finalVideoUrl.replace('youtu.be/', 'www.youtube.com/embed/');
    }

    const created = addLesson({
      title: newTitle.trim(),
      subject: newSubject,
      courseId: newCourseId,
      module: newModule.trim() || 'Módulo Geral',
      description: newDescription.trim() || 'Aula prática com resolução e dicas.',
      videoUrl: finalVideoUrl,
      duration: newDuration.trim() || '40 min',
      completed: false,
      notes: newNotes.trim(),
      materials: materialsList
    });

    const updated = [created, ...lessons];
    setLessons(updated);
    setSelectedLessonId(created.id);
    setIsAddModalOpen(false);

    // Resetar campos
    setNewTitle('');
    setNewDescription('');
    setNewVideoUrl('');
    setNewNotes('');
    setMaterialsList([]);
  };

  // Estatísticas apenas das aulas que o aluno comprou
  const myAccessibleLessons = lessons.filter((l) => hasCourseAccess(currentUser, l.courseId));
  const completedCount = myAccessibleLessons.filter((l) => l.completed).length;
  const progressPercent = myAccessibleLessons.length > 0 ? Math.round((completedCount / myAccessibleLessons.length) * 100) : 0;

  // Nome do(s) curso(s) que o aluno comprou
  const purchasedCourseNames = COURSES_CATALOG
    .filter((c) => currentUser.enrolledCourses?.includes(c.id) || currentUser.role === 'teacher')
    .map((c) => c.name);

  // Cursos com pagamento registrado aguardando OK da professora
  const pendingCourseNames = COURSES_CATALOG
    .filter((c) => currentUser.pendingCourses?.includes(c.id) && !currentUser.enrolledCourses?.includes(c.id))
    .map((c) => c.name);

  const isCurrentLessonPending = activeLesson
    ? Boolean(currentUser.pendingCourses?.includes(activeLesson.courseId))
    : false;

  return (
    <div className="min-h-screen bg-[#F8F7FD] text-[#0D0B24] flex flex-col font-body">
      {/* Top Navbar do Portal */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#3B14E2]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#0D0B24]/70 hover:text-[#3B14E2] bg-[#F2EEFF] hover:bg-[#EAE3FB] px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Site</span>
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-black text-sm font-heading shrink-0">
              G
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold font-heading text-[#0D0B24] leading-tight truncate">
                Plataforma de Aulas GEO
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">Área Exclusiva com Acesso Protegido</p>
            </div>
          </div>
        </div>

        {/* Info do Aluno & Ações */}
        <div className="flex items-center gap-2.5">
          {currentUser.role === 'teacher' && onOpenTeacherDashboard && (
            <button
              onClick={onOpenTeacherDashboard}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs sm:text-sm font-black shadow-md shadow-amber-400/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
            >
              <span>👑 Painel da Professora</span>
            </button>
          )}

          <div className="hidden md:flex flex-col text-right pr-2">
            <span className="text-xs font-bold text-[#0D0B24]">{currentUser.name}</span>
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center justify-end gap-1">
              <ShieldCheck className="w-3 h-3" />
              {currentUser.role === 'teacher' ? 'Professora / Admin' : 'Aluno Matriculado'}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Sair da conta"
            className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {/* Banner de Boas-vindas e Cursos Ativos */}
        <div className="bg-gradient-to-r from-[#15132B] via-[#211A4A] to-[#3B14E2] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#3B14E2]/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-extrabold mb-2.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>BEM-VINDO(A), {currentUser.name.toUpperCase()}!</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight">
                Seu acervo de aulas particulares
              </h2>

              {/* Badges dos Cursos que o aluno possui */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs text-slate-300 font-semibold">Cursos Liberados:</span>
                {purchasedCourseNames.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {name}
                  </span>
                ))}
                {pendingCourseNames.map((name) => (
                  <span
                    key={`pending-${name}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold"
                  >
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {name} (Aguardando OK)
                  </span>
                ))}
              </div>
            </div>

            {/* Card de Progresso */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl min-w-[240px]">
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span>Progresso das Suas Aulas</span>
                <span className="text-amber-300">{progressPercent}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-[#F5A300] to-amber-300 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-300">
                {completedCount} de {myAccessibleLessons.length} aulas concluídas no seu plano
              </p>
            </div>
          </div>
        </div>

        {/* Banner Exclusivo para Aluno de Mentoria VIP */}
        {(currentUser.enrolledCourses?.includes('mentoria-vip-individual') || currentUser.enrolledCourses?.includes('mentoria-vip-10-meses')) && (
          <div className="bg-gradient-to-r from-[#200A58] via-[#3B14E2] to-[#5B10A8] rounded-3xl p-5 sm:p-6 text-white border-2 border-[#F5A300]/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shrink-0">
                💎
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    Mentoria VIP 1-on-1 Ativa
                  </span>
                  <span className="text-xs text-emerald-300 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Acesso Imediato Liberado
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black font-heading mt-1 text-white">
                  Seu acompanhamento individual com a Profa. Geovana está confirmado!
                </h3>
                <p className="text-xs text-slate-200 mt-0.5">
                  As aulas do seu pacote contratado estão liberadas abaixo, além dos seus encontros individuais ao vivo via Google Meet e WhatsApp pessoal.
                </p>
              </div>
            </div>

            <a
              href={`https://wa.me/5535984121944?text=${encodeURIComponent(`Olá Profa. Geovana! Meu nome é ${currentUser.name}, realizei minha matrícula na Mentoria VIP e gostaria de alinhar meus horários de aula ao vivo no Meet!`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F5A300] to-amber-400 text-slate-950 text-xs sm:text-sm font-black shadow-lg shadow-amber-400/25 hover:brightness-105 active:scale-95 transition-all shrink-0 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Agendar Encontro no WhatsApp</span>
            </a>
          </div>
        )}

        {/* Layout Duas Colunas: Vídeo/Conteúdo Atual + Playlist Lateral */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Coluna Esquerda: Player de Vídeo e Detalhes da Aula */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {activeLesson ? (
              <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#3B14E2]/10 shadow-sm flex flex-col gap-5">

                {/* Header da Aula Selecionada */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#F2EEFF] text-[#3B14E2] text-xs font-extrabold">
                      {activeLesson.subject}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {activeLesson.module}
                    </span>
                  </div>

                  {isCurrentLessonAllowed ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleCompleted(activeLesson.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeLesson.completed
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                        {activeLesson.completed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Concluída</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-3.5 h-3.5 text-slate-400" />
                            <span>Marcar como Concluída</span>
                          </>
                        )}
                      </button>

                      {currentUser.role === 'teacher' && (
                        <button
                          onClick={() => handleDeleteLesson(activeLesson.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
                          title="Excluir aula"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      Conteúdo Bloqueado
                    </span>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-[#0D0B24]">
                  {activeLesson.title}
                </h3>

                {/* Video Embed Player OU Bloqueio por falta de compra */}
                {isCurrentLessonAllowed ? (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-md">
                    {activeLesson.videoUrl ? (
                      <iframe
                        src={activeLesson.videoUrl}
                        title={activeLesson.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-white/80 p-6 text-center">
                        <Video className="w-12 h-12 mb-3 text-[#F5A300]" />
                        <p className="font-bold text-base">Nenhum vídeo anexado a esta aula ainda.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Tela de Bloqueio se o aluno não comprou este curso ou aguarda OK */
                  <div className="relative w-full p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-slate-900 via-[#1C1635] to-[#2509A6] text-white flex flex-col items-center text-center shadow-lg border border-[#3B14E2]/30">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F5A300] mb-4 shadow-inner">
                      {isCurrentLessonPending ? <Clock className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                    </div>
                    <span className="text-xs font-extrabold tracking-widest text-amber-300 uppercase mb-1">
                      {isCurrentLessonPending ? 'Aguardando Liberação da Professora' : 'Acesso Restrito ao Curso'}
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black font-heading mb-2">
                      {isCurrentLessonPending
                        ? 'Pagamento registrado! Aguardando o OK da Profa. Geovana'
                        : 'Esta aula faz parte de outro curso'}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                      {isCurrentLessonPending
                        ? 'Recebemos seu cadastro e pagamento deste curso. Assim que a Profa. Geovana confirmar no painel dela, suas aulas serão liberadas automaticamente!'
                        : 'Seu plano atual não inclui as aulas deste módulo. Para liberar este e outros conteúdos exclusivos, faça o upgrade ou fale diretamente com a professora Geovana.'}
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      {!isCurrentLessonPending && (
                        <button
                          onClick={onBackToHome}
                          className="px-5 py-2.5 rounded-full bg-white text-[#0D0B24] text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                        >
                          Ver Cursos e Preços
                        </button>
                      )}
                      <a
                        href={`https://wa.me/5535984121944?text=${encodeURIComponent(
                          isCurrentLessonPending
                            ? `Olá Profa. Geovana! Meu nome é ${currentUser.name} (${currentUser.email}). Já concluí o pagamento e aguardo seu OK para liberar minhas aulas!`
                            : 'Olá Profa Geovana, quero liberar o acesso à aula de '
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F5A300] to-amber-400 text-slate-950 text-xs font-extrabold shadow-md hover:brightness-105 transition-all inline-flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{isCurrentLessonPending ? 'Avisar no WhatsApp' : 'Falar com a Geovana no WhatsApp'}</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Descrição e Notas da Professora (Somente se liberado) */}
                {isCurrentLessonAllowed ? (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 font-heading">
                        Sobre esta aula
                      </h4>
                      <p className="text-sm text-slate-700 leading-relaxed">
                        {activeLesson.description}
                      </p>
                    </div>

                    {activeLesson.notes && (
                      <div className="p-4 rounded-2xl bg-[#FFF9E6] border border-[#F5A300]/30 text-amber-950">
                        <h5 className="text-xs font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5 mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-[#F5A300]" />
                          Dica da Profa. Geovana
                        </h5>
                        <p className="text-xs leading-relaxed font-medium">
                          {activeLesson.notes}
                        </p>
                      </div>
                    )}

                    {/* Materiais Complementares e PDFs */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-heading">
                        Materiais Didáticos & Exercícios
                      </h4>
                      {activeLesson.materials && activeLesson.materials.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {activeLesson.materials.map((mat) => (
                            <a
                              key={mat.id}
                              href={mat.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-between p-3 rounded-xl bg-[#FAF8FF] border border-[#EAE3FB] hover:border-[#3B14E2] hover:bg-[#F2EEFF] transition-all group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-lg bg-[#3B14E2]/10 text-[#3B14E2] flex items-center justify-center shrink-0">
                                  <FileText className="w-4 h-4" />
                                </div>
                                <span className="text-xs font-bold text-slate-800 truncate">
                                  {mat.title}
                                </span>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#3B14E2] shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">
                          Nenhum material adicional inserido nesta aula.
                        </p>
                      )}
                    </div>

                    {/* Tirar Dúvidas Direto com a Geovana */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="w-4 h-4 text-[#3B14E2]" />
                        <span>Duração: <strong>{activeLesson.duration || '45 min'}</strong></span>
                      </div>

                      <a
                        href="https://wa.me/5535984121944"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm transition-all"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Dúvidas desta aula no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ) : null}

              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
                <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-700">Nenhuma aula encontrada</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                  Cadastre uma nova aula ou altere os filtros de busca.
                </p>
              </div>
            )}
          </div>

          {/* Coluna Direita: Lista / Playlist de Aulas com Indicador de Acesso */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Filtros e Busca */}
            <div className="bg-white rounded-3xl p-5 border border-[#3B14E2]/10 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold font-heading text-[#0D0B24] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#3B14E2]" />
                  Aulas e Módulos
                </h4>
                <span className="text-xs font-bold text-[#3B14E2] bg-[#F2EEFF] px-2 py-0.5 rounded-full">
                  {filteredLessons.length}
                </span>
              </div>

              {/* Input de Busca */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar por assunto ou módulo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#3B14E2] outline-none bg-slate-50 focus:bg-white"
                />
              </div>

              {/* Filtro por Matéria */}
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold text-center">
                {(['Todos', 'Matemática', 'Física'] as const).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => {
                      setSelectedSubject(sub);
                      const matching = lessons.filter(l => sub === 'Todos' || l.subject === sub);
                      const firstUnlocked = matching.find(l => hasCourseAccess(currentUser, l.courseId)) || matching[0];
                      if (firstUnlocked) {
                        setSelectedLessonId(firstUnlocked.id);
                      }
                    }}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${selectedSubject === sub
                        ? 'bg-white text-[#3B14E2] shadow-xs'
                        : 'text-slate-600 hover:text-[#3B14E2]'
                      }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>

            {/* Playlist Cards com Distinção de Acesso Liberado vs Bloqueado */}
            <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
              {filteredLessons.map((lesson, idx) => {
                const isCurrent = lesson.id === activeLesson?.id;
                const isAllowed = hasCourseAccess(currentUser, lesson.courseId);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => setSelectedLessonId(lesson.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${isCurrent
                        ? 'bg-[#F2EEFF] border-[#3B14E2] shadow-sm'
                        : isAllowed
                          ? 'bg-white border-slate-200 hover:border-[#3B14E2]/40 hover:bg-[#FAF8FF]'
                          : 'bg-slate-50/80 border-slate-200 opacity-75 hover:opacity-100'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-[#3B14E2]/10 text-[#3B14E2] text-[10px] font-black flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {lesson.subject}
                        </span>
                      </div>

                      {/* Status: Concluído, Liberado ou Bloqueado */}
                      {isAllowed ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCompleted(lesson.id);
                          }}
                          className="text-slate-400 hover:text-emerald-600 p-0.5"
                          title={lesson.completed ? 'Aula concluída' : 'Marcar como concluída'}
                        >
                          {lesson.completed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-300" />
                          )}
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-200/60 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3 text-slate-400" />
                          Bloqueada
                        </span>
                      )}
                    </div>

                    <h5 className={`text-xs font-bold leading-snug ${isCurrent ? 'text-[#3B14E2]' : 'text-slate-900'}`}>
                      {lesson.title}
                    </h5>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="truncate max-w-[170px]">{lesson.module}</span>
                      <span className="font-semibold">{lesson.duration || '40 min'}</span>
                    </div>
                  </div>
                );
              })}

              {filteredLessons.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
                  Nenhuma aula encontrada com os termos buscados.
                </div>
              )}
            </div>

            {/* Suporte de Duvidas da Aula */}
            <a
              href="https://wa.me/5535984121944?text=Ola%20Profa.%20Geovana!%20Sou%20aluno%20da%20plataforma%20e%20gostaria%20de%20tirar%20uma%20duvida."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Tirar Dúvidas com a Professora</span>
            </a>
          </div>

        </div>

      </div>


    </div>
  );
};
