import { useState } from "react";
import { DarkModeToggle } from "./components/DarkModeToggle";
import { SideNavigation } from "./components/SideNavigation";
import { ScrollToTop } from "./components/ScrollToTop";
import { HomePage } from "./components/HomePage";
import { UploadPage } from "./components/UploadPage";
import { ContactPage } from "./components/ContactPage";
import { Footer } from "./components/Footer";

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'upload' | 'contact'>('home');

  const navigateToUpload = () => setCurrentPage('upload');
  const navigateToHome = () => setCurrentPage('home');
  const navigateToContact = () => setCurrentPage('contact');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--pastel-blue)]/20 via-background to-[var(--pastel-mint)]/20">
      <SideNavigation 
        currentPage={currentPage}
        onNavigateToHome={navigateToHome}
        onNavigateToUpload={navigateToUpload}
        onNavigateToContact={navigateToContact}
      />
      <DarkModeToggle />
      <ScrollToTop />
      
      {currentPage === 'home' && (
        <>
          <HomePage onNavigateToUpload={navigateToUpload} />
          <Footer />
        </>
      )}
      
      {currentPage === 'upload' && (
        <>
          <UploadPage onNavigateToHome={navigateToHome} />
          <Footer />
        </>
      )}
      
      {currentPage === 'contact' && (
        <>
          <ContactPage />
          <Footer />
        </>
      )}
    </div>
  );
}