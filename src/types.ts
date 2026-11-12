export interface NavItem {
  label: string;
  href: string;
  active?: boolean;
  icon?: 'mentoria' | 'matematica-fisica' | string;
  badge?: string;
  highlight?: boolean;
}

export interface TargetAudience {
  id: string;
  title: string;
  subtitle?: string;
  iconName: string;
}

export interface MiniBenefit {
  number: string;
  title: string;
  description: string;
  iconName: string;
  highlight?: boolean;
}

export interface FloatingMathElement {
  id: string;
  type: 'formula' | 'graph' | 'physics' | 'symbol' | 'badge';
  content: string;
  subContent?: string;
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  rotation?: string;
  delay?: number;
}

export type CourseId = 
  | 'matematica-zero-avancado' 
  | 'fisica-descomplicada' 
  | 'mentoria-vip-individual'
  | 'mentoria-vip-10-meses';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'student' | 'teacher';
  createdAt: string;
  // Cursos comprados / liberados para este aluno
  enrolledCourses: CourseId[];
  // Cursos pagos/solicitados aguardando o OK de liberação da Professora
  pendingCourses?: CourseId[];
  notes?: string;
}

export interface OrderPayment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  courseId: CourseId;
  courseTitle: string;
  amount: number;
  paymentMethod: 'pix' | 'credit_card' | 'infinitepay';
  status: 'paid' | 'pending' | 'cancelled';
  createdAt: string;
}

export interface LessonMaterial {
  id: string;
  title: string;
  url: string;
  type?: 'pdf' | 'link' | 'exercise';
}

export interface Lesson {
  id: string;
  title: string;
  subject: 'Matemática' | 'Física' | 'Geral';
  module: string;
  courseId: CourseId; // A qual curso pertence para garantir o controle de acesso
  description: string;
  videoUrl?: string; // YouTube / Vimeo / drive / mp4
  duration?: string;
  materials?: LessonMaterial[];
  notes?: string;
  completed?: boolean;
}
