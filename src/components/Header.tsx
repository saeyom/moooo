import { motion } from 'motion/react';
import { Scale, BookOpen, GraduationCap, FileText, History } from 'lucide-react';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function Header({ activeSection, setActiveSection }: HeaderProps) {
  const menuItems = [
    { id: 'concepts', label: 'المفاهيم الخمسة', icon: BookOpen },
    { id: 'ledger', label: 'محاكي القيود', icon: Scale },
    { id: 'statements', label: 'القوائم المالية التفاعلية', icon: FileText },
    { id: 'timeline', label: 'تاريخ المحاسبة', icon: History },
    { id: 'quiz', label: 'اختبر نفسك', icon: GraduationCap },
  ];

  const handleScroll = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-2 space-x-reverse cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-teal-600 p-2 rounded-xl text-white shadow-md shadow-teal-600/20">
              <Scale className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-slate-800">
                مُحاسبَـة<span className="text-teal-600">.تفاعلية</span>
              </span>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">INTERACTIVE ACCOUNTING HUB</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1 space-x-reverse">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleScroll(item.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-teal-50 text-teal-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  id={`nav-link-${item.id}`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Call to Action CTA or Quick Stats */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('quiz')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-xs transition-transform active:scale-95 duration-200"
              id="cta-try-quiz"
            >
              جرب الاختبار 🎓
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
