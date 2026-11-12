import React, { useState } from 'react';
import {
  LogOut,
  Users,
  DollarSign,
  Search,
  Plus,
  CheckCircle2,
  Trash2,
  MessageCircle,
  Lock,
  Check,
  CreditCard,
  QrCode,
  Filter,
  Zap,
  Clock,
  XCircle,
  Bell,
  RotateCcw,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { CourseId, OrderPayment, UserAccount } from '../types';
import {
  COURSES_CATALOG,
  getStoredUsers,
  saveUser,
  deleteUser,
  getStoredOrders,
  saveOrder,
  deleteOrder,
  clearAllOrders,
  approveStudentCourse,
  revokeStudentCourse,
  rejectStudentCourse,
  formatPhoneBR,
  normalizeFullName,
  isValidFullName,
  isValidPhoneBR,
  formatDateTimeBR,
  INFINITEPAY_TAG,
  ADMIN_PIX_KEY
} from '../services/storage';
import {
  getAdminSecurityConfig,
  updateAdminSecurity
} from '../services/adminAuth';

interface TeacherAdminDashboardProps {
  onLogout: () => void;
  onBackToPortal?: () => void;
  onBackToHome?: () => void;
}

interface PendingApprovalItem {
  key: string;
  orderId?: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: CourseId;
  courseTitle: string;
  amount?: number;
  paymentMethod?: OrderPayment['paymentMethod'];
  createdAt: string;
}

export const TeacherAdminDashboard: React.FC<TeacherAdminDashboardProps> = ({
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'pending' | 'orders'>('students');
  const [users, setUsers] = useState<UserAccount[]>(() => getStoredUsers());
  const [orders, setOrders] = useState<OrderPayment[]>(() => getStoredOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | CourseId>('all');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [adminConfig, setAdminConfig] = useState(() => getAdminSecurityConfig());

  // Modal de Segurança / Alterar Senha da Administradora
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [secEmail, setSecEmail] = useState(() => getAdminSecurityConfig().email);
  const [secCurrentPassword, setSecCurrentPassword] = useState('');
  const [secNewPassword, setSecNewPassword] = useState('');
  const [secConfirmPassword, setSecConfirmPassword] = useState('');
  const [secRecoveryKey, setSecRecoveryKey] = useState('');
  const [showSecPasswords, setShowSecPasswords] = useState(false);
  const [secError, setSecError] = useState('');

  // Modal para Adicionar Aluno Manualmente (Ex: Pagamento por PIX direto no WhatsApp)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');
  const [newSelectedCourses, setNewSelectedCourses] = useState<CourseId[]>(['matematica-zero-avancado']);

  const refreshData = () => {
    setUsers(getStoredUsers());
    setOrders(getStoredOrders());
    setAdminConfig(getAdminSecurityConfig());
  };

  const openSecurityModal = () => {
    const cfg = getAdminSecurityConfig();
    setAdminConfig(cfg);
    setSecEmail(cfg.email);
    setSecCurrentPassword('');
    setSecNewPassword('');
    setSecConfirmPassword('');
    setSecRecoveryKey('');
    setSecError('');
    setShowSecPasswords(false);
    setIsSecurityModalOpen(true);
  };

  const handleSaveSecuritySettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSecError('');

    if (!secCurrentPassword) {
      setSecError('Informe sua senha atual para confirmar as alterações.');
      return;
    }

    if (secNewPassword && secNewPassword.length < 6) {
      setSecError('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (secNewPassword !== secConfirmPassword) {
      setSecError('A confirmação da nova senha não confere.');
      return;
    }

    if (!secNewPassword && secEmail.trim().toLowerCase() === adminConfig.email.toLowerCase() && !secRecoveryKey.trim()) {
      setSecError('Preencha a nova senha (ou altere o e-mail / chave de recuperação) para salvar.');
      return;
    }

    const res = updateAdminSecurity({
      currentPassword: secCurrentPassword,
      newPassword: secNewPassword || undefined,
      newEmail: secEmail.trim().toLowerCase(),
      newRecoveryKey: secRecoveryKey.trim() || undefined
    });

    if (!res.success) {
      setSecError(res.error);
      return;
    }

    setAdminConfig(getAdminSecurityConfig());
    setIsSecurityModalOpen(false);
    showToast('🔒 Configurações de segurança e senha da administradora atualizadas com sucesso!');
  };

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((prev) => (prev === msg ? null : prev));
    }, 4000);
  };

  // Monta lista unificada de solicitações pendentes do OK da professora
  const pendingApprovals: PendingApprovalItem[] = [];
  const seenKeys = new Set<string>();

  orders
    .filter((o) => o.status === 'pending')
    .forEach((o) => {
      const k = `${o.studentEmail.toLowerCase()}::${o.courseId}::${o.id}`;
      seenKeys.add(`${o.studentEmail.toLowerCase()}::${o.courseId}`);
      pendingApprovals.push({
        key: k,
        orderId: o.id,
        studentId: o.studentId,
        studentName: o.studentName,
        studentEmail: o.studentEmail,
        studentPhone: o.studentPhone,
        courseId: o.courseId,
        courseTitle: o.courseTitle,
        amount: o.amount,
        paymentMethod: o.paymentMethod,
        createdAt: o.createdAt
      });
    });

  users
    .filter((u) => u.role === 'student' && u.pendingCourses && u.pendingCourses.length > 0)
    .forEach((u) => {
      u.pendingCourses?.forEach((cId) => {
        const pairKey = `${u.email.toLowerCase()}::${cId}`;
        if (!seenKeys.has(pairKey)) {
          const courseObj = COURSES_CATALOG.find((c) => c.id === cId);
          pendingApprovals.push({
            key: pairKey,
            studentId: u.id,
            studentName: u.name,
            studentEmail: u.email,
            studentPhone: u.phone,
            courseId: cId,
            courseTitle: courseObj ? courseObj.name : cId,
            amount: courseObj?.price,
            createdAt: u.createdAt
          });
        }
      });
    });

  // Contabiliza somente as vendas presentes na página de controle da professora (vinculadas a alunos ativos no painel)
  const activeStudentsList = users.filter((u) => u.role === 'student');
  const controlOrders = orders.filter((o) =>
    activeStudentsList.some(
      (u) => u.id === o.studentId || u.email.toLowerCase() === o.studentEmail.toLowerCase()
    )
  );

  // Estatísticas Financeiras (somente vendas aprovadas presentes no controle da professora)
  const totalRevenue = controlOrders.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0);
  const totalStudents = activeStudentsList.length;
  const paidOrdersCount = controlOrders.filter((o) => o.status === 'paid').length;

  // Aprovar / Dar OK para liberar a aula ao aluno
  const handleApproveCourse = (
    studentEmailOrId: string,
    courseId: CourseId,
    studentName: string,
    courseTitle: string,
    orderId?: string
  ) => {
    approveStudentCourse(studentEmailOrId, courseId, orderId);
    refreshData();
    showToast(`✅ OK confirmado! Aula de "${courseTitle}" liberada para ${studentName}.`);
  };

  // Recusar solicitação pendente
  const handleRejectCourse = (
    studentEmailOrId: string,
    courseId: CourseId,
    studentName: string,
    orderId?: string
  ) => {
    if (window.confirm(`Deseja recusar a solicitação de liberação de "${studentName}"?`)) {
      rejectStudentCourse(studentEmailOrId, courseId, orderId);
      refreshData();
      showToast(`Solicitação de ${studentName} foi recusada.`);
    }
  };

  // Filtragem de Alunos
  const filteredStudents = activeStudentsList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesCourse =
      selectedCourseFilter === 'all' ||
      u.enrolledCourses?.includes(selectedCourseFilter) ||
      u.pendingCourses?.includes(selectedCourseFilter);
    return matchesSearch && matchesCourse;
  });

  // Filtragem de Pedidos (exibidos e contabilizados na página de controle)
  const filteredOrders = controlOrders.filter((o) => {
    return (
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Alternar permissão de um curso diretamente na tabela do aluno
  const handleToggleCoursePermission = (student: UserAccount, courseId: CourseId) => {
    const isEnrolled = student.enrolledCourses?.includes(courseId);
    const courseObj = COURSES_CATALOG.find((c) => c.id === courseId);
    if (!isEnrolled) {
      // Se estava pendente ou bloqueado, aprova, libera e contabiliza no painel!
      approveStudentCourse(student.email, courseId);
      refreshData();
      showToast(`✅ Acesso a "${courseObj?.name || courseId}" liberado para ${student.name}.`);
      return;
    }

    revokeStudentCourse(student.email, courseId);
    refreshData();
    showToast(`Acesso a "${courseObj?.name || courseId}" bloqueado para ${student.name}.`);
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o aluno "${studentName}" do sistema?`)) {
      deleteUser(studentId);
      refreshData();
    }
  };

  const handleDeleteOrder = (orderId: string, studentName: string) => {
    if (window.confirm(`Deseja remover este registro de venda de "${studentName}" do controle?`)) {
      deleteOrder(orderId);
      refreshData();
      showToast('Registro de venda removido do controle.');
    }
  };

  const handleResetAllSales = () => {
    if (window.confirm('Tem certeza que deseja zerar todas as vendas registradas até agora?')) {
      clearAllOrders();
      refreshData();
      showToast('✅ Todas as vendas foram zeradas. Novas vendas aprovadas aqui serão contabilizadas do zero.');
    }
  };

  const handleCreateStudentManual = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedName = normalizeFullName(newStudentName);
    const cleanEmail = newStudentEmail.trim().toLowerCase();
    const formattedPhone = formatPhoneBR(newStudentPhone);

    if (!isValidFullName(formattedName)) {
      alert('Por favor, informe o nome completo do aluno (nome e sobrenome).');
      return;
    }

    if (!cleanEmail.includes('@')) {
      alert('Por favor, informe um e-mail válido.');
      return;
    }

    if (!isValidPhoneBR(formattedPhone)) {
      alert('Por favor, informe um número de WhatsApp válido com DDD, ex: (35) 99999-9999.');
      return;
    }

    const registrationIso = new Date().toISOString();

    const newStudent: UserAccount = {
      id: `user-${Date.now()}`,
      name: formattedName,
      email: cleanEmail,
      phone: formattedPhone,
      password: 'alunogeovana',
      role: 'student',
      enrolledCourses: newSelectedCourses,
      pendingCourses: [],
      notes: newStudentNotes.trim() || 'Matrícula cadastrada manualmente pela Professora.',
      createdAt: registrationIso
    };

    saveUser(newStudent);

    // Registra recebimento aprovado manualmente para cada curso selecionado
    newSelectedCourses.forEach((selectedId, index) => {
      const course = COURSES_CATALOG.find((c) => c.id === selectedId);
      if (course) {
        saveOrder({
          id: `ord-man-${Date.now()}-${index}`,
          studentId: newStudent.id,
          studentName: newStudent.name,
          studentEmail: newStudent.email,
          studentPhone: newStudent.phone,
          courseId: course.id,
          courseTitle: course.name,
          amount: course.price,
          paymentMethod: 'pix',
          status: 'paid',
          createdAt: registrationIso
        });
      }
    });

    refreshData();
    setIsAddStudentOpen(false);
    showToast(`✅ Aluno ${newStudent.name} matriculado e liberado com sucesso!`);

    // Reset form
    setNewStudentName('');
    setNewStudentEmail('');
    setNewStudentPhone('');
    setNewStudentNotes('');
    setNewSelectedCourses(['matematica-zero-avancado']);
  };

  return (
    <div className="min-h-screen bg-[#F6F5FB] text-[#0D0B24] font-body flex flex-col">
      {/* Top Header do Painel */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20 shrink-0">
            👑
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-extrabold font-heading text-slate-900 leading-tight">
              Painel da Professora Geovana
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Gestão de Alunos, Liberação de Aulas e Recebimentos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openSecurityModal}
            title="Alterar senha e segurança do painel administrativo"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs"
          >
            <KeyRound className="w-4 h-4 text-amber-700" />
            <span className="hidden md:inline">Alterar Senha</span>
            <span className="md:hidden">Senha</span>
          </button>

          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3B14E2]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F5A300]" />
            <span className="hidden sm:inline">Matricular Aluno Manualmente</span>
            <span className="sm:hidden">Novo Aluno</span>
          </button>

          <button
            onClick={onLogout}
            title="Sair do Painel da Professora"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs sm:text-sm font-extrabold transition-all cursor-pointer shadow-xs hover:shadow-sm active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>SAIR</span>
          </button>
        </div>
      </header>

      {/* Container Principal */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">

        {/* Alerta de Recomendação de Segurança caso ainda use a senha inicial */}
        {adminConfig.isDefaultPassword && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Recomendação de Segurança: Altere sua senha padrão de administradora
                </h4>
                <p className="text-[11.5px] text-slate-600">
                  Você ainda está utilizando a senha inicial do sistema. Defina uma senha exclusiva sua para blindar o acesso ao painel.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openSecurityModal}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-extrabold text-xs shrink-0 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Criar Nova Senha Agora</span>
            </button>
          </div>
        )}

        {/* Feedback Toast de Liberação */}
        {feedbackToast && (
          <div className="bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-xs sm:text-sm font-bold animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span>{feedbackToast}</span>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-emerald-200 hover:text-white text-xs font-extrabold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Cards de Métricas e Faturamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Faturamento Liberado
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div
            onClick={() => setActiveTab('pending')}
            className={`rounded-3xl p-5 border shadow-xs flex items-center gap-4 cursor-pointer transition-all ${pendingApprovals.length > 0
                ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-300/40'
                : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${pendingApprovals.length > 0
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-100 text-slate-500'
                }`}
            >
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                Aguardando seu OK
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {pendingApprovals.length} {pendingApprovals.length === 1 ? 'aluno' : 'alunos'}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total de Cadastros
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {totalStudents} alunos
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Vendas Aprovadas
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {paidOrdersCount} pedidos
              </h3>
            </div>
          </div>

        </div>

        {/* DESTAQUE IMEDIATO QUANDO HOUVER ALUNOS AGUARDANDO O OK DA PROFESSORA */}
        {pendingApprovals.length > 0 && activeTab !== 'pending' && (
          <div className="bg-gradient-to-r from-amber-50 via-[#FFFDF5] to-amber-50/70 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-black font-heading text-slate-900">
                    Solicitações Aguardando seu OK para Liberar Aula ({pendingApprovals.length})
                  </h2>
                  <p className="text-xs text-slate-600">
                    Confirme abaixo o pagamento do aluno e clique em <strong>Aceitar / Dar OK</strong> para liberar o acesso imediato às aulas.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {pendingApprovals.map((item) => (
                <div
                  key={item.key}
                  className="bg-white rounded-2xl p-4 border border-amber-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-900">{item.studentName}</span>
                      <span className="text-xs text-slate-500">({item.studentEmail})</span>
                      {item.studentPhone && (
                        <a
                          href={`https://wa.me/55${item.studentPhone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full hover:underline"
                        >
                          <MessageCircle className="w-3 h-3" />
                          {formatPhoneBR(item.studentPhone)}
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-bold text-[#3B14E2] bg-[#F2EEFF] px-2.5 py-0.5 rounded-full">
                        {item.courseTitle}
                      </span>
                      {item.amount !== undefined && (
                        <span className="font-black text-slate-800">
                          R$ {item.amount.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                      {item.paymentMethod && (
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          via {item.paymentMethod === 'infinitepay' ? 'InfinitePay' : item.paymentMethod === 'pix' ? 'PIX' : 'Cartão'}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">
                        • Cadastrado em {formatDateTimeBR(item.createdAt).date} às {formatDateTimeBR(item.createdAt).time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() =>
                        handleApproveCourse(
                          item.studentEmail,
                          item.courseId,
                          item.studentName,
                          item.courseTitle,
                          item.orderId
                        )
                      }
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-105 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aceitar / Dar OK (Liberar Aula)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRejectCourse(item.studentEmail, item.courseId, item.studentName, item.orderId)
                      }
                      className="px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Recusar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Abas e Filtros */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col gap-5">

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Abas */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'students'
                    ? 'bg-white text-[#3B14E2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Users className="w-4 h-4" />
                <span>Alunos & Acessos ({filteredStudents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'pending'
                    ? 'bg-white text-amber-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Aguardando OK ({pendingApprovals.length})</span>
                {pendingApprovals.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'orders'
                    ? 'bg-white text-[#3B14E2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Recebimentos & Vendas ({filteredOrders.length})</span>
              </button>
            </div>

            {/* Input de Busca */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={activeTab === 'students' ? 'Buscar por nome, e-mail ou WhatsApp...' : 'Buscar registros...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#3B14E2] outline-none"
              />
            </div>
          </div>

          {/* TAB: AGUARDANDO OK DA PROFESSORA */}
          {activeTab === 'pending' && (
            <div className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-800">
                    Tudo em dia! Nenhuma aula pendente de liberação.
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Quando um novo aluno finalizar o cadastro e o pagamento no site, o pedido aparecerá aqui para você aceitar e dar o OK.
                  </p>
                </div>
              ) : (
                pendingApprovals.map((item) => (
                  <div
                    key={item.key}
                    className="bg-amber-50/50 rounded-2xl p-4 sm:p-5 border border-amber-200 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-950 text-[10px] font-black uppercase">
                          ⏳ Aguardando seu OK
                        </span>
                        <span className="font-extrabold text-sm text-slate-900">{item.studentName}</span>
                        <span className="text-xs text-slate-500">{item.studentEmail}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-xs">
                        <span className="font-bold text-[#3B14E2] bg-[#F2EEFF] px-2.5 py-0.5 rounded-full">
                          Curso: {item.courseTitle}
                        </span>
                        {item.amount !== undefined && (
                          <span className="font-black text-slate-900">
                            Valor: R$ {item.amount.toFixed(2).replace('.', ',')}
                          </span>
                        )}
                        {item.paymentMethod && (
                          <span className="text-slate-600 font-semibold">
                            Forma: {item.paymentMethod === 'infinitepay' ? 'InfinitePay' : item.paymentMethod === 'pix' ? 'PIX' : 'Cartão de Crédito'}
                          </span>
                        )}
                        {item.studentPhone && (
                          <a
                            href={`https://wa.me/55${item.studentPhone.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{item.studentPhone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleApproveCourse(
                            item.studentEmail,
                            item.courseId,
                            item.studentName,
                            item.courseTitle,
                            item.orderId
                          )
                        }
                        className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:brightness-105 text-white font-extrabold text-xs shadow-md transition-all inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aceitar / Dar OK (Liberar Aula)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleRejectCourse(item.studentEmail, item.courseId, item.studentName, item.orderId)
                        }
                        className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 font-bold text-xs transition-all inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Recusar</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 1: GESTÃO DE ALUNOS & CONTROLE DE ACESSO */}
          {activeTab === 'students' && (
            <div className="space-y-4">

              {/* Filtro por Curso */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="text-slate-400 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Filtrar curso:
                </span>
                <button
                  onClick={() => setSelectedCourseFilter('all')}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${selectedCourseFilter === 'all'
                      ? 'bg-[#3B14E2] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Todos
                </button>
                {COURSES_CATALOG.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCourseFilter(c.id)}
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${selectedCourseFilter === c.id
                        ? 'bg-[#3B14E2] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    <span>{c.icon}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>

              {/* Tabela de Alunos */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Aluno</th>
                      <th className="py-3 px-4">WhatsApp / Contato</th>
                      <th className="py-3 px-4">Cursos Liberados / Aguardando OK</th>
                      <th className="py-3 px-4">Cadastro</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Nome e Email */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <span>{student.name}</span>
                            {student.pendingCourses && student.pendingCourses.length > 0 && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold">
                                ⏳ Pendente OK
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {student.email}
                          </div>
                          {student.notes && (
                            <div className="text-[10px] text-amber-700 bg-amber-50 rounded-md px-1.5 py-0.5 mt-1 inline-block">
                              Obs: {student.notes}
                            </div>
                          )}
                        </td>

                        {/* WhatsApp */}
                        <td className="py-3.5 px-4">
                          {student.phone ? (
                            <a
                              href={`https://wa.me/55${student.phone.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full text-xs whitespace-nowrap"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{formatPhoneBR(student.phone)}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Não informado</span>
                          )}
                        </td>

                        {/* Badges de Cursos (Com aprovação rápida se estiver pendente ou clique direto para ativar/desativar) */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {COURSES_CATALOG.map((course) => {
                              const isEnrolled = student.enrolledCourses?.includes(course.id);
                              const isPending = !isEnrolled && student.pendingCourses?.includes(course.id);

                              if (isPending) {
                                return (
                                  <button
                                    key={course.id}
                                    onClick={() =>
                                      handleApproveCourse(
                                        student.email,
                                        course.id,
                                        student.name,
                                        course.name
                                      )
                                    }
                                    title="Clique para dar OK e liberar este curso para o aluno"
                                    className="px-3 py-1 rounded-full text-[10.5px] font-extrabold inline-flex items-center gap-1.5 bg-amber-100 text-amber-950 border-2 border-amber-400 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all cursor-pointer shadow-xs"
                                  >
                                    <Clock className="w-3 h-3" />
                                    <span>Dar OK: {course.name}</span>
                                  </button>
                                );
                              }

                              return (
                                <button
                                  key={course.id}
                                  onClick={() => handleToggleCoursePermission(student, course.id)}
                                  title={isEnrolled ? 'Clique para bloquear acesso' : 'Clique para liberar acesso manualmente'}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${isEnrolled
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-rose-100 hover:text-rose-800 hover:border-rose-300'
                                      : 'bg-slate-100 text-slate-400 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300'
                                    }`}
                                >
                                  {isEnrolled ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>{course.name}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3 text-slate-400" />
                                      <span>+ {course.name}</span>
                                    </>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </td>

                        {/* Data */}
                        <td className="py-3.5 px-4 text-slate-600 text-[11px] whitespace-nowrap">
                          <div className="font-bold text-slate-800">
                            {formatDateTimeBR(student.createdAt).date}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            às {formatDateTimeBR(student.createdAt).time}
                          </div>
                        </td>

                        {/* Ações */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteStudent(student.id, student.name)}
                            title="Remover aluno"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredStudents.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Nenhum aluno encontrado com esses filtros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: RECEBIMENTOS & HISTÓRICO DE VENDAS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-emerald-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#00FF85] text-slate-950 flex items-center justify-center font-black shrink-0">
                    <Zap className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-black">Conta Recebedora InfinitePay Ativa</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#00FF85]/20 text-[#00FF85] border border-[#00FF85]/30">
                        CONECTADO
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      InfiniteTag cadastrada:{' '}
                      <strong className="font-mono text-[#00FF85]">{INFINITEPAY_TAG}</strong>
                      {' • '}
                      Chave PIX:{' '}
                      <strong className="font-mono text-[#00FF85]">{ADMIN_PIX_KEY}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {controlOrders.length > 0 && (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <p className="text-xs text-slate-500">
                    Apenas vendas aprovadas e listadas aqui são contabilizadas no faturamento do painel.
                  </p>
                  <button
                    type="button"
                    onClick={handleResetAllSales}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Zerar Vendas</span>
                  </button>
                </div>
              )}

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Código / Data</th>
                      <th className="py-3 px-4">Aluno Comprador</th>
                      <th className="py-3 px-4">Curso Adquirido</th>
                      <th className="py-3 px-4">Forma de Pagamento</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4 text-right">Status / Liberação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-[11px] font-bold text-slate-700">
                            #{order.id}
                          </span>
                          <div className="text-[10px] text-slate-400">
                            {new Date(order.createdAt).toLocaleString('pt-BR')}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{order.studentName}</div>
                          <div className="text-slate-500 text-[11px]">{order.studentEmail}</div>
                          {order.studentPhone && (
                            <div className="text-[10px] text-emerald-700 font-semibold">{order.studentPhone}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {order.courseTitle}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                            {order.paymentMethod === 'infinitepay' ? (
                              <>
                                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="font-extrabold text-slate-900">InfinitePay</span>
                              </>
                            ) : order.paymentMethod === 'pix' ? (
                              <>
                                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                                <span>PIX</span>
                              </>
                            ) : (
                              <>
                                <CreditCard className="w-3.5 h-3.5 text-[#3B14E2]" />
                                <span>Cartão de Crédito</span>
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          R$ {order.amount.toFixed(2).replace('.', ',')}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {order.status === 'pending' ? (
                              <>
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                                  <Clock className="w-3 h-3 text-amber-700" />
                                  <span>Aguardando OK</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApproveCourse(
                                      order.studentEmail,
                                      order.courseId,
                                      order.studentName,
                                      order.courseTitle,
                                      order.id
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-extrabold inline-flex items-center gap-1 shadow-xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Dar OK / Liberar</span>
                                </button>
                              </>
                            ) : order.status === 'cancelled' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                                <XCircle className="w-3 h-3 text-rose-600" />
                                <span>Recusado</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Liberado & Recebido</span>
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id, order.studentName)}
                              title="Remover registro de venda"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Nenhuma venda registrada ainda. As novas vendas aprovadas no controle da professora aparecerão aqui.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Modal para Matrícula / Liberação Manual de Aluno */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/75 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-[#F5A300]" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-slate-900">
                    Matricular Aluno Manualmente
                  </h3>
                  <p className="text-xs text-slate-500">
                    Para alunos que pagaram por PIX direto no seu WhatsApp
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddStudentOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudentManual} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Nome Completo do Aluno (Nome e Sobrenome) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva Souza"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value.replace(/[0-9]/g, ''))}
                  onBlur={() => {
                    if (newStudentName.trim()) {
                      setNewStudentName(normalizeFullName(newStudentName));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    E-mail do Aluno *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="aluno@exemplo.com"
                    value={newStudentEmail}
                    onChange={(e) => setNewStudentEmail(e.target.value.trim())}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={15}
                    placeholder="(35) 99999-9999"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(formatPhoneBR(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                </div>
              </div>

              {/* Seleção dos Cursos a Liberar */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1.5">
                  Cursos a Liberar para este Aluno:
                </label>
                <div className="space-y-2">
                  {COURSES_CATALOG.map((course) => {
                    const isSelected = newSelectedCourses.includes(course.id);
                    return (
                      <div
                        key={course.id}
                        onClick={() => {
                          if (isSelected) {
                            if (newSelectedCourses.length > 1) {
                              setNewSelectedCourses(newSelectedCourses.filter((id) => id !== course.id));
                            }
                          } else {
                            setNewSelectedCourses([...newSelectedCourses, course.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-semibold transition-all ${isSelected
                            ? 'border-[#3B14E2] bg-[#F2EEFF] text-[#0D0B24]'
                            : 'border-slate-200 bg-slate-50 text-slate-600'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{course.icon}</span>
                          <span>{course.name}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center text-white ${isSelected ? 'bg-[#3B14E2]' : 'border border-slate-300'}`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                  Observações Internas (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Pagamento confirmado via comprovante PIX no WhatsApp..."
                  value={newStudentNotes}
                  onChange={(e) => setNewStudentNotes(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white font-bold text-xs shadow-md shadow-[#3B14E2]/25"
                >
                  Confirmar Matrícula
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Modal de Segurança e Alteração de Senha da Administradora */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0B24]/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-amber-400/40 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold font-heading text-slate-900">
                    Segurança & Senha de Administradora
                  </h3>
                  <p className="text-xs text-slate-500">
                    Acesso exclusivo blindado com criptografia SHA-256
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {secError && (
              <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{secError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecuritySettings} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                  E-mail de Login da Administradora *
                </label>
                <input
                  type="email"
                  required
                  value={secEmail}
                  onChange={(e) => setSecEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-extrabold uppercase text-slate-700">
                    Senha Atual *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecPasswords(!showSecPasswords)}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    {showSecPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showSecPasswords ? 'Ocultar senhas' : 'Mostrar senhas'}</span>
                  </button>
                </div>
                <input
                  type={showSecPasswords ? 'text' : 'password'}
                  required
                  value={secCurrentPassword}
                  onChange={(e) => setSecCurrentPassword(e.target.value)}
                  placeholder="Confirme sua senha atual para autorizar..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                    Nova Senha (mín. 6 dígitos)
                  </label>
                  <input
                    type={showSecPasswords ? 'text' : 'password'}
                    minLength={6}
                    value={secNewPassword}
                    onChange={(e) => setSecNewPassword(e.target.value)}
                    placeholder="Digite a nova senha..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold uppercase text-slate-700 mb-1">
                    Confirmar Nova Senha
                  </label>
                  <input
                    type={showSecPasswords ? 'text' : 'password'}
                    minLength={6}
                    value={secConfirmPassword}
                    onChange={(e) => setSecConfirmPassword(e.target.value)}
                    placeholder="Repita a nova senha..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:border-amber-500 outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-extrabold uppercase text-slate-700">
                    Chave Secreta de Recuperação (Opcional)
                  </label>
                  {adminConfig.recoveryKeyHash && (
                    <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      ✓ Já configurada
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Palavra ou código pessoal secreto usado apenas caso você clique em "Esqueci a senha" na tela de login.
                </p>
                <input
                  type={showSecPasswords ? 'text' : 'password'}
                  value={secRecoveryKey}
                  onChange={(e) => setSecRecoveryKey(e.target.value)}
                  placeholder={
                    adminConfig.recoveryKeyHash
                      ? 'Deixe em branco para manter a chave atual...'
                      : 'Ex: código pessoal que só você conhece...'
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:border-amber-500 outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsSecurityModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-md hover:brightness-105 cursor-pointer"
                >
                  Salvar Senha e Segurança
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
