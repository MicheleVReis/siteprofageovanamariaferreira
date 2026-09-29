import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroLeft } from './components/HeroLeft';
import { HeroRight } from './components/HeroRight';
import { MiniBenefits } from './components/MiniBenefits';
import { MethodSection } from './components/MethodSection';
import { TargetAudienceSection } from './components/TargetAudienceSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { TransformationsSection } from './components/TransformationsSection';
import { WhyLearnSection } from './components/WhyLearnSection';
import { PricingSection } from './components/PricingSection';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { FinalCTAAndFooter } from './components/FinalCTAAndFooter';
import { ContactModal } from './components/ContactModal';
import { StudentLoginModal } from './components/StudentLoginModal';
import { StudentPortalPage } from './components/StudentPortalPage';
import { CheckoutPage } from './components/CheckoutPage';
import { TeacherAdminDashboard } from './components/TeacherAdminDashboard';
import { CourseId, UserAccount } from './types';
import { getCurrentUser, setCurrentUser } from './services/storage';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | undefined>(undefined);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'landing' | 'portal' | 'checkout' | 'admin'>('landing');
  const [checkoutCourseId, setCheckoutCourseId] = useState<CourseId>('combo-exatas-turbo');
  const [activeUser, setActiveUser] = useState<UserAccount | null>(() => getCurrentUser());

  const handleOpenContact = (courseName?: string) => {
    setSelectedCourse(courseName);
    setIsContactOpen(true);
  };

  const handleOpenCheckout = (courseId?: CourseId) => {
    if (courseId) {
      setCheckoutCourseId(courseId);
    }
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStudentPortal = () => {
    if (activeUser) {
      setCurrentView('portal');
    } else {
      setIsStudentModalOpen(true);
    }
  };

  const handleOpenTeacherAdmin = () => {
    // Se não tiver login ativo de professora, inicializa como Geovana para testes e gestão
    if (!activeUser || activeUser.role !== 'teacher') {
      const teacherUser: UserAccount = {
        id: 'prof-geovana',
        name: 'Profa. Geovana Reis',
        email: 'geovana.prof@gmail.com',
        role: 'teacher',
        enrolledCourses: ['combo-exatas-turbo', 'mentoria-vip-individual'],
        createdAt: new Date().toISOString()
      };
      setActiveUser(teacherUser);
      setCurrentUser(teacherUser);
    }
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = (user: UserAccount) => {
    setActiveUser(user);
    if (user.role === 'teacher') {
      setCurrentView('admin');
    } else {
      setCurrentView('portal');
    }
  };

  const handlePaymentSuccess = (user: UserAccount) => {
    setActiveUser(user);
    setCurrentView('portal');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveUser(null);
    setCurrentView('landing');
  };

  // 1. Painel da Professora Geovana (Gestão de Alunos, Acessos e Recebimentos)
  if (currentView === 'admin') {
    return (
      <TeacherAdminDashboard
        onBackToPortal={() => setCurrentView('portal')}
        onBackToHome={() => setCurrentView('landing')}
      />
    );
  }

  // 2. Tela de Checkout / Compra de Cursos
  if (currentView === 'checkout') {
    return (
      <CheckoutPage
        initialCourseId={checkoutCourseId}
        onBack={() => setCurrentView('landing')}
        onPaymentSuccess={handlePaymentSuccess}
      />
    );
  }

  // 3. Tela da Plataforma de Aulas do Aluno
  if (currentView === 'portal' && activeUser) {
    return (
      <StudentPortalPage
        currentUser={activeUser}
        onLogout={handleLogout}
        onBackToHome={() => setCurrentView('landing')}
        onOpenTeacherDashboard={handleOpenTeacherAdmin}
      />
    );
  }

  // 4. Landing Page Principal
  return (
    <div className="min-h-screen bg-[#FAF9FF] text-[#0D0B24] flex flex-col items-center justify-start relative selection:bg-[#3B14E2] selection:text-white font-body p-0 sm:p-2 md:p-4 2xl:p-6 scroll-smooth">
      
      {/* 1. SEÇÃO 1: HERO SECTION */}
      <div
        id="inicio"
        className="relative w-full max-w-[1560px] min-h-[85vh] lg:min-h-[88vh] bg-gradient-to-br from-[#FFFFFF] via-[#FAF8FF] to-[#F2EEFF] rounded-none sm:rounded-[32px] shadow-2xl shadow-[#15132B]/10 border border-[#3B14E2]/15 overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle background ambient glows */}
        <div className="absolute top-0 left-0 w-[550px] h-[550px] bg-[#F1EDFF] rounded-full blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-[#3B14E2]/10 rounded-full blur-3xl pointer-events-none -z-0"></div>

        {/* Header Navigation com Destaques: Cursos e Acesso Aluno */}
        <Header
          onOpenContact={() => handleOpenContact()}
          onOpenStudentPortal={handleOpenStudentPortal}
        />

        {/* Main Hero Content */}
        <main className="relative z-10 w-full px-6 sm:px-10 lg:px-12 xl:px-14 flex-1 flex flex-col justify-center pt-2 sm:pt-4 pb-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 xl:gap-8 items-center">
            {/* Left Column: Headline, Copy, Audience Card, CTA Chamativo */}
            <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center">
              <HeroLeft onOpenContact={() => handleOpenContact()} />
            </div>

            {/* Right Column: Teacher Portrait, Studio Arch, Circle Badge, Math/Physics Art */}
            <div className="lg:col-span-6 xl:col-span-6 flex items-end justify-center lg:justify-end">
              <HeroRight />
            </div>
          </div>
        </main>

        {/* Bottom Mini Benefits Bar */}
        <div className="relative z-30 w-full px-6 sm:px-10 lg:px-12 xl:px-14 pb-4 sm:pb-6">
          <MiniBenefits />
        </div>
      </div>

      {/* 2. SEÇÃO 2: O MÉTODO GEO */}
      <MethodSection onOpenContact={() => handleOpenContact()} />

      {/* 3. SEÇÃO 3: PARA QUEM É */}
      <TargetAudienceSection onOpenContact={() => handleOpenContact()} />

      {/* 4. SEÇÃO 4: COMO FUNCIONA */}
      <HowItWorksSection />

      {/* 5. SEÇÃO 5: O QUE VOCÊ PODE CONQUISTAR */}
      <TransformationsSection />

      {/* 6. SEÇÃO 6: POR QUE APRENDER COM A GEOVANA */}
      <WhyLearnSection />

      {/* 7. SEÇÃO 7: CURSOS & PREÇOS COM COMPRA DIRETA */}
      <PricingSection
        onOpenContact={handleOpenContact}
        onOpenCheckout={handleOpenCheckout}
      />

      {/* 8. SEÇÃO 8: SOBRE A GEOVANA */}
      <AboutSection />

      {/* 9. SEÇÃO 9: FAQ */}
      <FAQSection />

      {/* 10. SEÇÃO 10: CTA FINAL + FOOTER */}
      <FinalCTAAndFooter
        onOpenContact={() => handleOpenContact()}
        onOpenTeacherDashboard={handleOpenTeacherAdmin}
      />

      {/* Interactive Contact & Matrícula Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => {
          setIsContactOpen(false);
          setSelectedCourse(undefined);
        }}
        selectedCourse={selectedCourse}
      />

      {/* Student Login & Portal Modal */}
      <StudentLoginModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
