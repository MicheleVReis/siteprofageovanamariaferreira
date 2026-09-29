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
  onLogout: () => void;
  onBackToHome: () => void;
  onOpenTeacherDashboard?: () => void;
}

export const StudentPortalPage: React.FC<StudentPortalPageProps> = ({
  currentUser,
  onLogout,
  onBackToHome,
  onOpenTeacherDashboard
}) => {
  const [lessons, setLessons] = useState<Lesson[]>(() => getStoredLessons());
  const [selectedSubject, setSelectedSubject] = useState<'Todos' | 'Matemática' | 'Física'>('Todos');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'Todos' | CourseId>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // A primeira aula liberada por padrão
  const firstAllowed = filteredLessons.find((l) => hasCourseAccess(currentUser, l.courseId)) || filteredLessons[0];
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => firstAllowed?.id || lessons[0]?.id || '');

  const activeLesson = lessons.find((l) => l.id === selectedLessonId) || firstAllowed;
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

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3B14E2]/25 hover:shadow-lg hover:shadow-[#3B14E2]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-[#F5A300]" />
            <span className="hidden sm:inline">Inserir Nova Aula</span>
            <span className="sm:hidden">Nova Aula</span>
          </button>

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
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          activeLesson.completed
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
                  /* Tela de Bloqueio se o aluno não comprou este curso */
                  <div className="relative w-full p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-slate-900 via-[#1C1635] to-[#2509A6] text-white flex flex-col items-center text-center shadow-lg border border-[#3B14E2]/30">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#F5A300] mb-4 shadow-inner">
                      <Lock className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-extrabold tracking-widest text-amber-300 uppercase mb-1">
                      Acesso Restrito ao Curso
                    </span>
                    <h4 className="text-xl sm:text-2xl font-black font-heading mb-2">
                      Esta aula faz parte de outro curso
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mb-6 leading-relaxed">
                      Seu plano atual não inclui as aulas deste módulo. Para liberar este e outros conteúdos exclusivos, faça o upgrade ou fale diretamente com a professora Geovana.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={onBackToHome}
                        className="px-5 py-2.5 rounded-full bg-white text-[#0D0B24] text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                      >
                        Ver Cursos e Preços
                      </button>
                      <a
                        href="https://wa.me/5535984121944?text=Olá Profa Geovana, quero liberar o acesso à aula de "
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#F5A300] to-amber-400 text-slate-950 text-xs font-extrabold shadow-md hover:brightness-105 transition-all inline-flex items-center gap-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Falar com a Geovana no WhatsApp</span>
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
                    onClick={() => setSelectedSubject(sub)}
                    className={`py-1.5 rounded-lg transition-all cursor-pointer ${
                      selectedSubject === sub
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
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 relative ${
                      isCurrent
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

            {/* Ação rápida para cadastrar nova aula */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-[#3B14E2]/30 hover:border-[#3B14E2] hover:bg-[#F2EEFF] text-[#3B14E2] text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Inserir Mais Conteúdo</span>
            </button>
          </div>

        </div>

      </div>

      {/* Modal para Inserção de Aulas & Conteúdo com Vínculo ao Curso */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3B14E2]/20 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-bold">
                  <PlayCircle className="w-5 h-5 text-[#F5A300]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-[#0D0B24]">
                    Inserir Nova Aula ou Conteúdo
                  </h3>
                  <p className="text-xs text-slate-500">
                    Defina a qual curso essa aula pertence para proteger o acesso
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Título da Aula *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Análise Combinatória e Probabilidade"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                />
              </div>

              {/* Vínculo de Curso para controle de compra */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Curso ao qual a aula pertence * (Controle de Acesso)
                </label>
                <select
                  value={newCourseId}
                  onChange={(e) => setNewCourseId(e.target.value as CourseId)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#3B14E2]/30 text-xs focus:border-[#3B14E2] outline-none bg-white font-medium"
                >
                  {COURSES_CATALOG.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <p className="text-[10.5px] text-slate-400 mt-1">
                  Somente os alunos com este curso adquirido poderão assistir.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Disciplina
                  </label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none bg-white"
                  >
                    <option value="Matemática">Matemática</option>
                    <option value="Física">Física</option>
                    <option value="Geral">Geral / Dicas de Estudo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    Duração
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 50 min"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Módulo / Etapa do Curso
                </label>
                <input
                  type="text"
                  placeholder="Ex: Módulo 3: Álgebra e Geometria Espacial"
                  value={newModule}
                  onChange={(e) => setNewModule(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Link do Vídeo (YouTube, Vimeo ou Drive)
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Descrição e Roteiro da Aula
                </label>
                <textarea
                  rows={3}
                  placeholder="Explicação do que o aluno irá ver, conceitos abordados..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Dica de Ouro ou Observações (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Lembrar de converter km/h para m/s dividindo por 3,6"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                />
              </div>

              {/* Materiais Complementares */}
              <div className="pt-2 border-t border-slate-100">
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Adicionar Material Didático / Link de PDF
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome do arquivo (ex: Resumo PDF)"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                  <input
                    type="text"
                    placeholder="URL do arquivo / drive"
                    value={materialUrl}
                    onChange={(e) => setMaterialUrl(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddMaterialToForm}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-[#F2EEFF] text-[#3B14E2] font-bold text-xs"
                  >
                    + Adicionar
                  </button>
                </div>

                {materialsList.length > 0 && (
                  <div className="space-y-1">
                    {materialsList.map((m, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs bg-slate-50 p-2 rounded-lg">
                        <span className="font-semibold text-slate-700">{m.title}</span>
                        <button
                          type="button"
                          onClick={() => setMaterialsList(materialsList.filter((_, i) => i !== idx))}
                          className="text-rose-500 font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white font-bold text-xs shadow-md shadow-[#3B14E2]/25"
                >
                  Salvar Aula
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};
