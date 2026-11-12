import { CourseId, Lesson, OrderPayment, UserAccount } from '../types';
import {
  buildTeacherAccount,
  clearAdminSession,
  isAdminSessionValid,
  isReservedAdminEmail
} from './adminAuth';

const LEGACY_USERS_STORAGE_KEY = 'geo_student_users';
const USERS_STORAGE_KEY = 'geo_student_users_v2';
const CURRENT_USER_KEY = 'geo_current_user';
const LESSONS_STORAGE_KEY = 'geo_lessons_data';
const LEGACY_ORDERS_STORAGE_KEY = 'geo_orders_payments';
const LEGACY_ORDERS_STORAGE_KEY_V2 = 'geo_orders_payments_v2';
const ORDERS_STORAGE_KEY = 'geo_orders_payments_v3';

export const INFINITEPAY_TAG = '$geovana-maria-885';
export const INFINITEPAY_HANDLE = 'geovana-maria-885';
export const ADMIN_PIX_KEY = 'geovana-maria-885@jim.com';

function formatEmvField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

function computeCrc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function buildPixCopiaECola(amountReais: number): string {
  const merchantAccountInfo =
    formatEmvField('00', 'br.gov.bcb.pix') +
    formatEmvField('01', ADMIN_PIX_KEY);

  const amountStr = Math.max(0, amountReais).toFixed(2);
  const additionalData = formatEmvField('05', '***');

  const payloadWithoutCrc =
    formatEmvField('00', '01') +
    formatEmvField('26', merchantAccountInfo) +
    formatEmvField('52', '0000') +
    formatEmvField('53', '986') +
    formatEmvField('54', amountStr) +
    formatEmvField('58', 'BR') +
    formatEmvField('59', 'GEOVANA MARIA FERREIRA') +
    formatEmvField('60', 'POUSO ALEGRE') +
    formatEmvField('62', additionalData) +
    '6304';

  const crc = computeCrc16Ccitt(payloadWithoutCrc);
  return `${payloadWithoutCrc}${crc}`;
}

export interface InfinitePayCheckoutParams {
  courseId: CourseId;
  courseTitle: string;
  amountReais: number;
  orderNsu?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export function buildInfinitePayCheckoutUrl(params: InfinitePayCheckoutParams): string {
  const priceInCents = Math.max(100, Math.round(params.amountReais * 100));
  const items = [
    {
      name: params.courseTitle,
      price: priceInCents,
      quantity: 1
    }
  ];

  const query = new URLSearchParams();
  query.set('items', JSON.stringify(items));
  if (params.orderNsu) {
    query.set('order_nsu', params.orderNsu);
  }
  if (params.customerName && params.customerName.trim()) {
    query.set('customer_name', params.customerName.trim());
  }
  if (params.customerEmail && params.customerEmail.trim()) {
    query.set('customer_email', params.customerEmail.trim());
  }
  const phoneDigits = (params.customerPhone || '').replace(/\D/g, '');
  if (phoneDigits.length >= 10) {
    query.set('customer_cellphone', phoneDigits);
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    query.set('redirect_url', window.location.origin);
  }

  return `https://checkout.infinitepay.io/${INFINITEPAY_HANDLE}?${query.toString()}`;
}

export async function createInfinitePayCheckoutLink(params: InfinitePayCheckoutParams): Promise<string> {
  const fallbackUrl = buildInfinitePayCheckoutUrl(params);
  try {
    const priceInCents = Math.max(100, Math.round(params.amountReais * 100));
    const phoneDigits = (params.customerPhone || '').replace(/\D/g, '');
    const payload: Record<string, any> = {
      handle: INFINITEPAY_HANDLE,
      order_nsu: params.orderNsu || `geo-${params.courseId}-${Date.now()}`,
      items: [
        {
          description: params.courseTitle,
          quantity: 1,
          price: priceInCents
        }
      ]
    };

    if (typeof window !== 'undefined' && window.location?.origin) {
      payload.redirect_url = window.location.origin;
    }

    if (params.customerName || params.customerEmail || phoneDigits) {
      payload.customer = {
        ...(params.customerName ? { name: params.customerName.trim() } : {}),
        ...(params.customerEmail ? { email: params.customerEmail.trim() } : {}),
        ...(phoneDigits.length >= 10 ? { phone_number: `+55${phoneDigits}` } : {})
      };
    }

    const response = await fetch('https://api.infinitepay.io/invoices/public/checkout/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      if (data && typeof data.url === 'string' && data.url.startsWith('http')) {
        return data.url;
      }
    }
  } catch {
    // Fallback para a URL direta do Checkout Integrado InfinitePay
  }
  return fallbackUrl;
}

export function formatPhoneBR(value: string): string {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatCpfBR(value: string): string {
  const digits = (value || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function normalizeFullName(value: string): string {
  const clean = (value || '')
    .replace(/[0-9]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!clean) return '';
  const lowerParticles = new Set(['da', 'de', 'do', 'das', 'dos', 'e']);
  return clean
    .split(' ')
    .map((word, idx) => {
      const lower = word.toLowerCase();
      if (idx > 0 && lowerParticles.has(lower)) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function isValidFullName(value: string): boolean {
  const parts = normalizeFullName(value)
    .split(' ')
    .filter(p => p.length >= 2);
  return parts.length >= 2;
}

export function isValidPhoneBR(value: string): boolean {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length !== 10 && digits.length !== 11) return false;
  const ddd = parseInt(digits.slice(0, 2), 10);
  if (isNaN(ddd) || ddd < 11 || ddd > 99) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  return true;
}

export function isValidCpfBR(value: string): boolean {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  return true;
}

export function formatDateTimeBR(isoOrDate?: string): { date: string; time: string } {
  const d = isoOrDate ? new Date(isoOrDate) : new Date();
  const validDate = isNaN(d.getTime()) ? new Date() : d;
  return {
    date: validDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }),
    time: validDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };
}

export const COURSES_CATALOG: { id: CourseId; name: string; subject: string; price: number; icon: string }[] = [
  {
    id: 'mentoria-vip-individual',
    name: 'Mentoria VIP (6 Meses)',
    subject: 'Personalizado',
    price: 2879,
    icon: '💎'
  },
  {
    id: 'mentoria-vip-10-meses',
    name: 'Mentoria VIP (10 Meses)',
    subject: 'Personalizado',
    price: 4500,
    icon: '💎'
  },
  {
    id: 'matematica-zero-avancado',
    name: 'Matemática',
    subject: 'Matemática',
    price: 297,
    icon: '📐'
  },
  {
    id: 'fisica-descomplicada',
    name: 'Física',
    subject: 'Física',
    price: 297,
    icon: '⚡'
  }
];

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'prof-geovana',
    name: 'Profa. Geovana Reis',
    email: 'geovana.prof@gmail.com',
    role: 'teacher',
    phone: '(35) 98412-1944',
    enrolledCourses: ['mentoria-vip-individual', 'mentoria-vip-10-meses', 'matematica-zero-avancado', 'fisica-descomplicada'],
    createdAt: '2026-01-10T10:00:00Z',
    notes: 'Professora Titular e Administradora'
  }
];

const INITIAL_ORDERS: OrderPayment[] = [];

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Funções de 1º e 2º Grau: Interpretação Gráfica e Macetes',
    subject: 'Matemática',
    courseId: 'matematica-zero-avancado',
    module: 'Módulo 1: Fundamentos para o ENEM e Vestibulares',
    description: 'Aprenda a analisar raízes, vértice da parábola, coeficientes a, b e c sem precisar decorar fórmulas complexas. Aplicação direta em questões reais.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '42 min',
    completed: true,
    materials: [
      { id: 'm-1', title: 'Resumo Ilustrado - Funções (PDF)', url: '#', type: 'pdf' },
      { id: 'm-2', title: 'Lista de Exercícios Resolvidos Passo a Passo', url: '#', type: 'exercise' }
    ],
    notes: 'Atenção aos sinais do coeficiente C (onde o gráfico corta o eixo y).'
  },
  {
    id: 'lesson-2',
    title: 'Cinemática do Zero: MRU e MRUV Sem Confundir Fórmulas',
    subject: 'Física',
    courseId: 'fisica-descomplicada',
    module: 'Módulo 2: Mecânica & Física Clássica',
    description: 'Entenda os conceitos reais de velocidade média, aceleração e como interpretar gráficos sxt e vxt de maneira lógica e visual.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '55 min',
    completed: false,
    materials: [
      { id: 'm-3', title: 'Guia Visual de Fórmulas de Cinemática', url: '#', type: 'pdf' },
      { id: 'm-4', title: 'Simulador Online PhET de Movimento', url: 'https://phet.colorado.edu/', type: 'link' }
    ],
    notes: 'Dica de ouro da Profa. Geovana: sempre identifique as grandezas dadas antes de escolher a equação!'
  },
  {
    id: 'lesson-3',
    title: 'Trigonometria no Triângulo Retângulo e Círculo Trigonométrico',
    subject: 'Matemática',
    courseId: 'matematica-zero-avancado',
    module: 'Módulo 1: Fundamentos para o ENEM e Vestibulares',
    description: 'Seno, cosseno, tangente, arcos notáveis (30°, 45°, 60°) e como nunca mais esquecer a tabela dos quadrantes.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '48 min',
    completed: false,
    materials: [
      { id: 'm-5', title: 'Círculo Trigonométrico Colorido para Imprimir', url: '#', type: 'pdf' }
    ]
  },
  {
    id: 'lesson-4',
    title: 'Dinâmica: Leis de Newton & Forças de Atrito',
    subject: 'Física',
    courseId: 'fisica-descomplicada',
    module: 'Módulo 2: Mecânica & Física Clássica',
    description: 'Como desenhar diagramas de corpo livre e calcular força resultante em planos inclinados e sistemas de blocos.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '60 min',
    completed: false,
    materials: [
      { id: 'm-6', title: 'Lista de Desafios - Planos Inclinados', url: '#', type: 'exercise' }
    ]
  },
  {
    id: 'lesson-5',
    title: 'Estratégia de Resolução Rápida de Questões do ENEM',
    subject: 'Geral',
    courseId: 'mentoria-vip-individual',
    module: 'Módulo Exclusivo Mentoria VIP (6 Meses): Técnicas de Prova',
    description: 'Como gerenciar o tempo, identificar questões fáceis primeiro e maximizar a nota TRI na prova de Matemática e Ciências da Natureza.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '35 min',
    completed: false,
    materials: [
      { id: 'm-7', title: 'Checklist de Gestão de Tempo no ENEM', url: '#', type: 'pdf' }
    ]
  },
  {
    id: 'lesson-6',
    title: 'Planejamento Anual de Estudos & Revisão Espaçada (Mentoria 10 Meses)',
    subject: 'Geral',
    courseId: 'mentoria-vip-10-meses',
    module: 'Módulo Exclusivo Mentoria VIP (10 Meses): Acompanhamento Anual',
    description: 'Cronograma completo para o ano letivo, organização de listas semanais e estratégia de evolução contínua com a Profa. Geovana.',
    videoUrl: 'https://www.youtube.com/embed/ZBJfPWZzc8k',
    duration: '45 min',
    completed: false,
    materials: [
      { id: 'm-8', title: 'Planner Anual de Estudos - Mentoria 10 Meses (PDF)', url: '#', type: 'pdf' }
    ]
  }
];

export function hasCourseAccess(user: UserAccount, courseId: CourseId): boolean {
  if (user.role === 'teacher') return true; // Professora tem acesso a tudo
  if (!user.enrolledCourses || user.enrolledCourses.length === 0) return false;
  // Libera estritamente os cursos que o aluno pagou e que foram confirmados pela administradora
  return user.enrolledCourses.includes(courseId);
}

export function getStoredUsers(): UserAccount[] {
  try {
    if (localStorage.getItem(LEGACY_USERS_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_USERS_STORAGE_KEY);
    }
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_USERS;
  }
}

export function saveUser(user: UserAccount): void {
  // Impede que cadastros comuns sobrescrevam ou assumam perfil de administradora
  if ((user.role === 'teacher' || isReservedAdminEmail(user.email)) && !isAdminSessionValid()) {
    return;
  }

  const sanitizedUser: UserAccount =
    user.role === 'teacher'
      ? { ...user, password: undefined }
      : { ...user, role: 'student' };

  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === sanitizedUser.email.toLowerCase());
  if (existingIndex >= 0) {
    if (users[existingIndex].role === 'teacher' && !isAdminSessionValid()) {
      return;
    }
    users[existingIndex] = sanitizedUser;
  } else {
    users.push(sanitizedUser);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function saveAllUsers(users: UserAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function deleteUser(userId: string): void {
  const allUsers = getStoredUsers();
  const targetUser = allUsers.find(u => u.id === userId);
  const users = allUsers.filter(u => u.id !== userId);
  saveAllUsers(users);

  // Remove também vendas associadas ao aluno removido do painel da professora
  const orders = getStoredOrders().filter(o => {
    if (o.studentId === userId) return false;
    if (targetUser && o.studentEmail.toLowerCase() === targetUser.email.toLowerCase()) return false;
    return true;
  });
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      return isAdminSessionValid() ? buildTeacherAccount() : null;
    }
    const user = JSON.parse(raw);
    if (user.id === 'user-aluno-demo') {
      localStorage.removeItem(CURRENT_USER_KEY);
      return null;
    }
    // Bloqueia acesso de administradora caso não haja sessão administrativa autenticada válida
    if (user.role === 'teacher') {
      if (!isAdminSessionValid()) {
        localStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }
      return buildTeacherAccount();
    }
    if (user.email) {
      const latest = getStoredUsers().find(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (latest && latest.role !== 'teacher') return latest;
    }
    return user;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    if (user.role === 'teacher') {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...user, password: undefined }));
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } else {
    clearAdminSession();
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getStoredOrders(): OrderPayment[] {
  try {
    // Limpa chaves legadas para garantir que vendas antigas/fictícias fiquem zeradas
    if (localStorage.getItem(LEGACY_ORDERS_STORAGE_KEY)) {
      localStorage.removeItem(LEGACY_ORDERS_STORAGE_KEY);
    }
    if (localStorage.getItem(LEGACY_ORDERS_STORAGE_KEY_V2)) {
      localStorage.removeItem(LEGACY_ORDERS_STORAGE_KEY_V2);
    }
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ORDERS;
  }
}

export function saveOrder(order: OrderPayment): void {
  const orders = getStoredOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function deleteOrder(orderId: string): void {
  const orders = getStoredOrders().filter(o => o.id !== orderId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function clearAllOrders(): void {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
}

export function getStoredLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(LESSONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(INITIAL_LESSONS));
      return INITIAL_LESSONS;
    }
    const parsed = JSON.parse(raw);
    let updated = false;
    const migrated = parsed.map((l: any) => {
      let videoUrl = l.videoUrl;
      if (!videoUrl || videoUrl.includes('dQw4w9WgXcQ')) {
        videoUrl = 'https://www.youtube.com/embed/ZBJfPWZzc8k';
        updated = true;
      } else if (videoUrl.includes('youtube.com/watch?v=')) {
        const videoId = videoUrl.split('watch?v=')[1]?.split('&')[0];
        if (videoId) {
          videoUrl = `https://www.youtube.com/embed/${videoId}`;
          updated = true;
        }
      }
      return {
        ...l,
        videoUrl,
        courseId: l.courseId || (l.subject === 'Física' ? 'fisica-descomplicada' : 'matematica-zero-avancado')
      };
    });
    if (!migrated.some((l: any) => l.courseId === 'mentoria-vip-10-meses')) {
      const lesson6 = INITIAL_LESSONS.find(l => l.id === 'lesson-6');
      if (lesson6) {
        migrated.push(lesson6);
        updated = true;
      }
    }
    if (updated) {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return INITIAL_LESSONS;
  }
}

export function saveLessons(lessons: Lesson[]): void {
  localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
}

export function addLesson(lesson: Omit<Lesson, 'id'>): Lesson {
  const lessons = getStoredLessons();
  const newLesson: Lesson = {
    ...lesson,
    id: `lesson-${Date.now()}`
  };
  lessons.unshift(newLesson);
  saveLessons(lessons);
  return newLesson;
}

export function updateLesson(updated: Lesson): void {
  const lessons = getStoredLessons();
  const index = lessons.findIndex(l => l.id === updated.id);
  if (index >= 0) {
    lessons[index] = updated;
    saveLessons(lessons);
  }
}

export function deleteLesson(id: string): void {
  const lessons = getStoredLessons().filter(l => l.id !== id);
  saveLessons(lessons);
}


export function approveStudentCourse(studentIdOrEmail: string, courseId: CourseId, orderId?: string): void {
  const users = getStoredUsers();
  const key = studentIdOrEmail.toLowerCase();
  const idx = users.findIndex(u => u.id.toLowerCase() === key || u.email.toLowerCase() === key);
  const matchedUser = idx >= 0 ? users[idx] : undefined;

  if (idx >= 0 && matchedUser) {
    const enrolled = Array.isArray(matchedUser.enrolledCourses) ? [...matchedUser.enrolledCourses] : [];
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
    }
    const pending = Array.isArray(matchedUser.pendingCourses)
      ? matchedUser.pendingCourses.filter(c => c !== courseId)
      : [];

    users[idx] = {
      ...matchedUser,
      enrolledCourses: enrolled,
      pendingCourses: pending
    };
    saveAllUsers(users);

    // Se for o usuário logado atualmente no mesmo navegador, mantém sincronizado
    try {
      const currentRaw = localStorage.getItem(CURRENT_USER_KEY);
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current.email && current.email.toLowerCase() === matchedUser.email.toLowerCase()) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[idx]));
        }
      }
    } catch {
      // ignore
    }
  }

  // Atualiza pedido correspondente para 'paid' ou cria registro caso liberado manualmente no painel
  const orders = getStoredOrders();
  let foundExistingOrder = false;
  let ordersChanged = false;

  const updatedOrders = orders.map(o => {
    const matchesStudent =
      o.studentId.toLowerCase() === key ||
      o.studentEmail.toLowerCase() === key ||
      (matchedUser && (o.studentId === matchedUser.id || o.studentEmail.toLowerCase() === matchedUser.email.toLowerCase()));

    const matchesOrder = orderId
      ? o.id === orderId
      : (o.courseId === courseId && matchesStudent && o.status !== 'cancelled');

    if (matchesOrder) {
      foundExistingOrder = true;
      if (o.status !== 'paid') {
        ordersChanged = true;
        return { ...o, status: 'paid' as const };
      }
    }
    return o;
  });

  if (!foundExistingOrder && matchedUser) {
    const courseObj = COURSES_CATALOG.find(c => c.id === courseId);
    if (courseObj) {
      updatedOrders.unshift({
        id: `ord-painel-${Date.now()}`,
        studentId: matchedUser.id,
        studentName: matchedUser.name,
        studentEmail: matchedUser.email,
        studentPhone: matchedUser.phone,
        courseId: courseObj.id,
        courseTitle: courseObj.name,
        amount: courseObj.price,
        paymentMethod: 'pix',
        status: 'paid',
        createdAt: new Date().toISOString()
      });
      ordersChanged = true;
    }
  }

  if (ordersChanged) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  }
}

export function revokeStudentCourse(studentIdOrEmail: string, courseId: CourseId): void {
  const users = getStoredUsers();
  const key = studentIdOrEmail.toLowerCase();
  const idx = users.findIndex(u => u.id.toLowerCase() === key || u.email.toLowerCase() === key);
  const matchedUser = idx >= 0 ? users[idx] : undefined;

  if (idx >= 0 && matchedUser) {
    const updatedCourses = (matchedUser.enrolledCourses || []).filter(id => id !== courseId);
    users[idx] = {
      ...matchedUser,
      enrolledCourses: updatedCourses
    };
    saveAllUsers(users);

    try {
      const currentRaw = localStorage.getItem(CURRENT_USER_KEY);
      if (currentRaw) {
        const current = JSON.parse(currentRaw);
        if (current.email && current.email.toLowerCase() === matchedUser.email.toLowerCase()) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(users[idx]));
        }
      }
    } catch {
      // ignore
    }
  }

  // Remove a venda correspondente do controle da professora ao bloquear o curso
  const orders = getStoredOrders().filter(o => {
    const matchesStudent =
      o.studentId.toLowerCase() === key ||
      o.studentEmail.toLowerCase() === key ||
      (matchedUser && (o.studentId === matchedUser.id || o.studentEmail.toLowerCase() === matchedUser.email.toLowerCase()));
    return !(matchesStudent && o.courseId === courseId);
  });
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function rejectStudentCourse(studentIdOrEmail: string, courseId: CourseId, orderId?: string): void {
  const users = getStoredUsers();
  const key = studentIdOrEmail.toLowerCase();
  const idx = users.findIndex(u => u.id.toLowerCase() === key || u.email.toLowerCase() === key);

  if (idx >= 0) {
    const u = users[idx];
    const pending = Array.isArray(u.pendingCourses)
      ? u.pendingCourses.filter(c => c !== courseId)
      : [];
    users[idx] = {
      ...u,
      pendingCourses: pending
    };
    saveAllUsers(users);
  }

  const orders = getStoredOrders();
  let ordersChanged = false;
  const updatedOrders = orders.map(o => {
    const matchesOrder = orderId
      ? o.id === orderId
      : (o.status === 'pending' &&
        o.courseId === courseId &&
        (o.studentId.toLowerCase() === key || o.studentEmail.toLowerCase() === key));
    if (matchesOrder && o.status === 'pending') {
      ordersChanged = true;
      return { ...o, status: 'cancelled' as const };
    }
    return o;
  });

  if (ordersChanged) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders));
  }
}
