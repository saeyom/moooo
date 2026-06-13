import { Scale, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-right">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
          
          {/* Brand Info */}
          <div className="flex items-center space-x-2 space-x-reverse justify-center sm:justify-start">
            <div className="bg-teal-600 p-2 rounded-xl text-white shadow-md shadow-teal-600/20">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                مُحاسبَـة<span className="text-teal-400">.تفاعلية</span>
              </span>
              <span className="text-[9px] text-slate-500 font-mono tracking-wider block">THE LANGUAGE OF BUSINESS</span>
            </div>
          </div>

          {/* Quick statement on accounting value */}
          <p className="text-xs text-slate-450 max-w-sm leading-relaxed text-center sm:text-left font-light">
            تأسست هذه المنصة التفاعلية لتبسيط الفكر المالي وتمكين رواد الأعمال والمبتدئين من فهم لغة الاقتصاد وإدارة ثرواتهم بذكاء هندسي وعلمي دقيق.
          </p>

        </div>

        {/* Bottom Line */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light">
          <p>© {new Date().getFullYear()} منصة محاسبة تفاعلية. جميع الحقوق معفوظة ومحمية بالأنظمة الدولية.</p>
          
          <div className="flex items-center gap-1 text-slate-500">
            <span>صُنع بشغف لتبسيط العلم والمعرفة</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
}
