import React, { useState } from 'react';
import {
  ArrowLeft,
  Users,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  ExternalLink,
  MessageCircle,
  FileText,
  Lock,
  Unlock,
  Check,
  CreditCard,
  QrCode,
  Calendar,
  Layers,
  BookOpen,
  Filter
} from 'lucide-react';
import { CourseId, OrderPayment, UserAccount } from '../types';
import {
  COURSES_CATALOG,
  getStoredUsers,
  saveUser,
  deleteUser,
  getStoredOrders,
  saveOrder
} from '../services/storage';

interface TeacherAdminDashboardProps {
  onBackToPortal: () => void;
  onBackToHome: () => void;
}

export const TeacherAdminDashboard: React.FC<TeacherAdminDashboardProps> = ({
  onBackToPortal,
  onBackToHome
}) => {
  const [activeTab, setActiveTab] = useState<'students' | 'orders'>('students');
  const [users, setUsers] = useState<UserAccount[]>(() => getStoredUsers());
  const [orders, setOrders] = useState<OrderPayment[]>(() => getStoredOrders());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<'all' | CourseId>('all');

  // Modal para Adicionar Aluno Manualmente (Ex: Pagamento por PIX direto no WhatsApp)
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentPhone, setNewStudentPhone] = useState('');
  const [newStudentNotes, setNewStudentNotes] = useState('');
  const [newSelectedCourses, setNewSelectedCourses] = useState<CourseId[]>(['matematica-zero-avancado']);

  // Estatísticas Financeiras
  const totalRevenue = orders.reduce((acc, curr) => acc + (curr.status === 'paid' ? curr.amount : 0), 0);
  const totalStudents = users.filter((u) => u.role === 'student').length;
  const pixOrdersCount = orders.filter((o) => o.paymentMethod === 'pix').length;
  const cardOrdersCount = orders.filter((o) => o.paymentMethod === 'credit_card').length;

  // Filtragem de Alunos
  const filteredStudents = users.filter((u) => {
    if (u.role === 'teacher') return false; // Não lista a si mesma na lista de alunos comuns
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesCourse =
      selectedCourseFilter === 'all' || u.enrolledCourses?.includes(selectedCourseFilter);
    return matchesSearch && matchesCourse;
  });

  // Filtragem de Pedidos
  const filteredOrders = orders.filter((o) => {
    return (
      o.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Alternar permissão de um curso diretamente na tabela do aluno
  const handleToggleCoursePermission = (student: UserAccount, courseId: CourseId) => {
    let updatedCourses: CourseId[];
    if (student.enrolledCourses.includes(courseId)) {
      updatedCourses = student.enrolledCourses.filter((id) => id !== courseId);
    } else {
      updatedCourses = [...student.enrolledCourses, courseId];
    }

    const updatedUser: UserAccount = {
      ...student,
      enrolledCourses: updatedCourses
    };

    saveUser(updatedUser);
    setUsers(getStoredUsers());
  };

  const handleDeleteStudent = (studentId: string, studentName: string) => {
    if (window.confirm(`Tem certeza que deseja remover o aluno "${studentName}" do sistema?`)) {
      deleteUser(studentId);
      setUsers(getStoredUsers());
    }
  };

  const handleCreateStudentManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !newStudentEmail.trim()) return;

    const newStudent: UserAccount = {
      id: `user-${Date.now()}`,
      name: newStudentName.trim(),
      email: newStudentEmail.trim().toLowerCase(),
      phone: newStudentPhone.trim(),
      password: 'alunogeovana',
      role: 'student',
      enrolledCourses: newSelectedCourses,
      notes: newStudentNotes.trim() || 'Matrícula cadastrada manualmente pela Professora.',
      createdAt: new Date().toISOString()
    };

    saveUser(newStudent);

    // Opcional: registrar recebimento manual se quiser
    const course = COURSES_CATALOG.find(c => c.id === newSelectedCourses[0]);
    if (course) {
      saveOrder({
        id: `ord-man-${Date.now()}`,
        studentId: newStudent.id,
        studentName: newStudent.name,
        studentEmail: newStudent.email,
        studentPhone: newStudent.phone,
        courseId: course.id,
        courseTitle: course.name,
        amount: course.price,
        paymentMethod: 'pix',
        status: 'paid',
        createdAt: new Date().toISOString()
      });
      setOrders(getStoredOrders());
    }

    setUsers(getStoredUsers());
    setIsAddStudentOpen(false);

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
          <button
            onClick={onBackToPortal}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#3B14E2] bg-slate-100 hover:bg-[#F2EEFF] px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar às Aulas</span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B14E2] to-[#2509A6] text-white flex items-center justify-center font-black text-sm">
              👑
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold font-heading text-slate-900 leading-tight">
                Painel da Professora Geovana
              </h1>
              <p className="text-[10px] text-slate-500 font-medium">
                Gestão de Alunos, Recebimentos e Matrículas
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddStudentOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-[#3B14E2] to-[#2509A6] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#3B14E2]/25 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F5A300]" />
            <span className="hidden sm:inline">Matricular Aluno Manualmente</span>
            <span className="sm:hidden">Novo Aluno</span>
          </button>

          <button
            onClick={onBackToHome}
            className="text-xs font-bold text-slate-500 hover:text-[#3B14E2] px-3 py-1.5"
          >
            Ver Site
          </button>
        </div>
      </header>

      {/* Container Principal */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* Cards de Métricas e Faturamento */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Faturamento Total
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EEFF] text-[#3B14E2] flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Alunos Matriculados
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {totalStudents} alunos
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pagamentos via PIX
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {pixOrdersCount} pedidos
              </h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Pagamentos no Cartão
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900 mt-0.5">
                {cardOrdersCount} pedidos
              </h3>
            </div>
          </div>

        </div>

        {/* Abas e Filtros */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col gap-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            {/* Abas */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'students'
                    ? 'bg-white text-[#3B14E2] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Alunos & Acessos ({filteredStudents.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`py-2 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'orders'
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
                placeholder={activeTab === 'students' ? 'Buscar por nome, e-mail ou WhatsApp...' : 'Buscar recebimentos...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:border-[#3B14E2] outline-none"
              />
            </div>
          </div>

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
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                    selectedCourseFilter === 'all'
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
                    className={`px-3 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 ${
                      selectedCourseFilter === c.id
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
                      <th className="py-3 px-4">Cursos Liberados (Clique para alternar)</th>
                      <th className="py-3 px-4">Cadastro</th>
                      <th className="py-3 px-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Nome e Email */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900 text-sm">
                            {student.name}
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
                              className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full text-xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{student.phone}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 italic">Não informado</span>
                          )}
                        </td>

                        {/* Badges de Cursos (Com clique direto para ativar/desativar) */}
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap gap-1.5 max-w-md">
                            {COURSES_CATALOG.map((course) => {
                              const isEnrolled = student.enrolledCourses?.includes(course.id);
                              return (
                                <button
                                  key={course.id}
                                  onClick={() => handleToggleCoursePermission(student, course.id)}
                                  title={isEnrolled ? 'Clique para revogar acesso' : 'Clique para liberar acesso'}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 transition-all cursor-pointer ${
                                    isEnrolled
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
                        <td className="py-3.5 px-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(student.createdAt).toLocaleDateString('pt-BR')}
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
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-extrabold tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Código / Data</th>
                      <th className="py-3 px-4">Aluno Comprador</th>
                      <th className="py-3 px-4">Curso Adquirido</th>
                      <th className="py-3 px-4">Forma de Pagamento</th>
                      <th className="py-3 px-4">Valor</th>
                      <th className="py-3 px-4 text-right">Status</th>
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
                            {order.paymentMethod === 'pix' ? (
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
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Recebido</span>
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-400">
                          Nenhum recebimento encontrado.
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
                  Nome Completo do Aluno *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Amanda Silva"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
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
                    onChange={(e) => setNewStudentEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-[#3B14E2] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="(35) 99999-9999"
                    value={newStudentPhone}
                    onChange={(e) => setNewStudentPhone(e.target.value)}
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
                              setNewSelectedCourses(newSelectedCourses.filter(id => id !== course.id));
                            }
                          } else {
                            setNewSelectedCourses([...newSelectedCourses, course.id]);
                          }
                        }}
                        className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-semibold transition-all ${
                          isSelected
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
    </div>
  );
};
