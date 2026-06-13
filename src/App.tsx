import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ConceptOverview from './components/ConceptOverview';
import DoubleEntrySandbox from './components/DoubleEntrySandbox';
import FinancialStatements from './components/FinancialStatements';
import HistoryTimeline from './components/HistoryTimeline';
import InteractiveQuiz from './components/InteractiveQuiz';
import Footer from './components/Footer';

export default function App() {
  const [activeSection, setActiveSection] = useState('concepts');

  // Simple active section tracker on scroll (IntersectionObserver)
  useEffect(() => {
    const sections = ['concepts', 'ledger', 'statements', 'timeline', 'quiz'];
    
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollToExplore = () => {
    const el = document.getElementById('concepts');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" dir="rtl">
      {/* Header / Navigation bar */}
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Landing */}
        <Hero onExploreClick={handleScrollToExplore} />

        {/* 1. Core Concepts Cards Grid */}
        <ConceptOverview />

        {/* 2. Interactive Double Entry Bookkeeping Sandbox */}
        <DoubleEntrySandbox />

        {/* 3. Interactive financial statements compiler */}
        <FinancialStatements />

        {/* 4. Historical Accounting Milestones map */}
        <HistoryTimeline />

        {/* 5. MCQ interactive test & Diploma certificate generator */}
        <InteractiveQuiz />
      </main>

      {/* Corporate Arabic Footer */}
      <Footer />
    </div>
  );
}
