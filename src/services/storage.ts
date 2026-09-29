import { CourseId, Lesson, OrderPayment, UserAccount } from '../types';

const USERS_STORAGE_KEY = 'geo_student_users';
const CURRENT_USER_KEY = 'geo_current_user';
const LESSONS_STORAGE_KEY = 'geo_lessons_data';
const ORDERS_STORAGE_KEY = 'geo_orders_payments';

export const COURSES_CATALOG: { id: CourseId; name: string; subject: string; price: number; icon: string }[] = [
  {
    id: 'matematica-zero-avancado',
    name: 'Matemática do Zero ao Avançado',
    subject: 'Matemática',
    price: 297,
    icon: '📐'
  },
  {
    id: 'fisica-descomplicada',
    name: 'Física Descomplicada & Prática',
    subject: 'Física',
    price: 297,
    icon: '⚡'
  },
  {
    id: 'combo-exatas-turbo',
    name: 'Combo Exatas Turbo (Matemática + Física)',
    subject: 'Matemática & Física',
    price: 497,
    icon: '👑'
  },
  {
    id: 'mentoria-vip-individual',
    name: 'Mentoria VIP Individual & Acompanhamento',
    subject: 'Personalizado',
    price: 1297,
    icon: '💎'
  }
];

const INITIAL_USERS: UserAccount[] = [
  {
    id: 'prof-geovana',
    name: 'Profa. Geovana Reis',
    email: 'geovana.prof@gmail.com',
    role: 'teacher',
    phone: '(35) 98412-1944',
    enrolledCourses: ['combo-exatas-turbo', 'mentoria-vip-individual'],
    createdAt: '2026-01-10T10:00:00Z',
    notes: 'Professora Titular e Administradora'
  },
  {
    id: 'user-michele',
    name: 'Michele Vieira Reis',
    email: 'michele.vieira.reis@educacao.mg.gov.br',
    role: 'student',
    phone: '(35) 99876-5432',
    enrolledCourses: ['matematica-zero-avancado'],
    createdAt: '2026-02-15T14:30:00Z',
    notes: 'Focada em funções e geometria para concurso público.'
  },
  {
    id: 'user-lucas',
    name: 'Lucas Mendes Ferraz',
    email: 'lucas.mendes@gmail.com',
    role: 'student',
    phone: '(35) 98711-2233',
    enrolledCourses: ['combo-exatas-turbo'],
    createdAt: '2026-03-01T09:15:00Z',
    notes: 'Preparação intensiva para Medicina no ENEM.'
  },
  {
    id: 'user-beatriz',
    name: 'Beatriz Alcantara',
    email: 'bia.alcantara@hotmail.com',
    role: 'student',
    phone: '(35) 99122-3344',
    enrolledCourses: ['fisica-descomplicada'],
    createdAt: '2026-03-12T16:20:00Z',
    notes: 'Dificuldade em Cinemática e Leis de Newton.'
  }
];

const INITIAL_ORDERS: OrderPayment[] = [
  {
    id: 'ord-101',
    studentId: 'user-michele',
    studentName: 'Michele Vieira Reis',
    studentEmail: 'michele.vieira.reis@educacao.mg.gov.br',
    studentPhone: '(35) 99876-5432',
    courseId: 'matematica-zero-avancado',
    courseTitle: 'Matemática do Zero ao Avançado',
    amount: 297,
    paymentMethod: 'pix',
    status: 'paid',
    createdAt: '2026-02-15T14:32:00Z'
  },
  {
    id: 'ord-102',
    studentId: 'user-lucas',
    studentName: 'Lucas Mendes Ferraz',
    studentEmail: 'lucas.mendes@gmail.com',
    studentPhone: '(35) 98711-2233',
    courseId: 'combo-exatas-turbo',
    courseTitle: 'Combo Exatas Turbo (Matemática + Física)',
    amount: 497,
    paymentMethod: 'credit_card',
    status: 'paid',
    createdAt: '2026-03-01T09:18:00Z'
  },
  {
    id: 'ord-103',
    studentId: 'user-beatriz',
    studentName: 'Beatriz Alcantara',
    studentEmail: 'bia.alcantara@hotmail.com',
    studentPhone: '(35) 99122-3344',
    courseId: 'fisica-descomplicada',
    courseTitle: 'Física Descomplicada & Prática',
    amount: 297,
    paymentMethod: 'pix',
    status: 'paid',
    createdAt: '2026-03-12T16:22:00Z'
  }
];

const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Funções de 1º e 2º Grau: Interpretação Gráfica e Macetes',
    subject: 'Matemática',
    courseId: 'matematica-zero-avancado',
    module: 'Módulo 1: Fundamentos para o ENEM e Vestibulares',
    description: 'Aprenda a analisar raízes, vértice da parábola, coeficientes a, b e c sem precisar decorar fórmulas complexas. Aplicação direta em questões reais.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    courseId: 'combo-exatas-turbo',
    module: 'Módulo Exclusivo: Técnicas de Prova Turbo',
    description: 'Como gerenciar o tempo, identificar questões fáceis primeiro e maximizar a nota TRI na prova de Matemática e Ciências da Natureza.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    duration: '35 min',
    completed: false,
    materials: [
      { id: 'm-7', title: 'Checklist de Gestão de Tempo no ENEM', url: '#', type: 'pdf' }
    ]
  }
];

export function hasCourseAccess(user: UserAccount, courseId: CourseId): boolean {
  if (user.role === 'teacher') return true; // Professor tem acesso a tudo
  if (!user.enrolledCourses || user.enrolledCourses.length === 0) return false;
  // Se comprou o Combo Turbo ou Mentoria, tem acesso aos cursos de Matemática e Física
  if (user.enrolledCourses.includes('combo-exatas-turbo') || user.enrolledCourses.includes('mentoria-vip-individual')) {
    return true;
  }
  return user.enrolledCourses.includes(courseId);
}

export function getStoredUsers(): UserAccount[] {
  try {
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
  const users = getStoredUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function saveAllUsers(users: UserAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function deleteUser(userId: string): void {
  const users = getStoredUsers().filter(u => u.id !== userId);
  saveAllUsers(users);
}

export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function getStoredOrders(): OrderPayment[] {
  try {
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

export function getStoredLessons(): Lesson[] {
  try {
    const raw = localStorage.getItem(LESSONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(INITIAL_LESSONS));
      return INITIAL_LESSONS;
    }
    const parsed = JSON.parse(raw);
    return parsed.map((l: any) => ({
      ...l,
      courseId: l.courseId || (l.subject === 'Física' ? 'fisica-descomplicada' : 'matematica-zero-avancado')
    }));
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
