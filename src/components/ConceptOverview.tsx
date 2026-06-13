import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { accountingConcepts } from '../data';
import { AccountingConcept } from '../types';
import { 
  Briefcase, 
  ShieldAlert, 
  Coins, 
  TrendingUp, 
  Receipt, 
  CheckCircle, 
  AlertCircle,
  HelpCircle,
  Hash,
  Scale
} from 'lucide-react';

export default function ConceptOverview() {
  const [selectedConcept, setSelectedConcept] = useState<AccountingConcept | null>(null);

  // Helper matching string names to Lucide icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-6 h-6" />;
      case 'ShieldAlert': return <ShieldAlert className="w-6 h-6" />;
      case 'Coins': return <Coins className="w-6 h-6" />;
      case 'TrendingUp': return <TrendingUp className="w-6 h-6" />;
      case 'Receipt': return <Receipt className="w-6 h-6" />;
      default: return <HelpCircle className="w-6 h-6" />;
    }
  };

  // Helper for background gradients and primary theme styling
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'emerald': return {
        bg: 'bg-emerald-50 hover:bg-emerald-100/50',
        border: 'border-emerald-100 hover:border-emerald-200',
        text: 'text-emerald-700',
        badge: 'bg-emerald-500/10 text-emerald-800'
      };
      case 'rose': return {
        bg: 'bg-rose-50 hover:bg-rose-100/50',
        border: 'border-rose-100 hover:border-rose-200',
        text: 'text-rose-700',
        badge: 'bg-rose-500/10 text-rose-800'
      };
      case 'amber': return {
        bg: 'bg-amber-50 hover:bg-amber-100/50',
        border: 'border-amber-100 hover:border-amber-200',
        text: 'text-amber-700',
        badge: 'bg-amber-500/10 text-amber-800'
      };
      case 'teal': return {
        bg: 'bg-teal-50 hover:bg-teal-100/50',
        border: 'border-teal-100 hover:border-teal-200',
        text: 'text-teal-700',
        badge: 'bg-teal-500/10 text-teal-800'
      };
      case 'violet': return {
        bg: 'bg-violet-50 hover:bg-violet-100/50',
        border: 'border-violet-100 hover:border-violet-200',
        text: 'text-violet-700',
        badge: 'bg-violet-500/10 text-violet-800'
      };
      default: return {
        bg: 'bg-slate-50 hover:bg-slate-100/50',
        border: 'border-slate-100 hover:border-slate-200',
        text: 'text-slate-700',
        badge: 'bg-slate-500/10 text-slate-800'
      };
    }
  };

  return (
    <section id="concepts" className="py-20 bg-slate-50/50 scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-teal-600 tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase font-mono">
            أركان النظام المالي
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            العناصر الخمسة الكبرى في المحاسبة
          </h2>
          <p className="text-slate-600 mt-3 font-light text-base sm:text-lg">
            كل الحسابات المالية والقوائم والميزانيات تنقسم تحت هذه الفئات الخمس الفريدة. انقر على أي فئة لمشاهدة تفاصيل متعمقة وطبيعتها المحاسبية (دائن أم مدين).
          </p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {accountingConcepts.map((concept, idx) => {
            const styling = getColorClasses(concept.color);
            const isSelected = selectedConcept?.id === concept.id;
            
            return (
              <motion.div
                key={concept.id}
                onClick={() => setSelectedConcept(selectedConcept?.id === concept.id ? null : concept)}
                className={`cursor-pointer rounded-2xl border p-6 transition-all duration-300 shadow-xs flex flex-col justify-between ${styling.bg} ${styling.border} ${
                  isSelected ? 'ring-2 ring-teal-500 scale-[1.02] shadow-md' : 'active:scale-98'
                }`}
                layoutId={`concept-card-${concept.id}`}
                whileHover={{ y: -4 }}
                id={`concept-card-${concept.id}`}
              >
                <div>
                  {/* Icon & Title */}
                  <div className={`p-3 rounded-xl inline-block bg-white ${styling.text} border border-slate-100 shadow-2xs`}>
                    {getIcon(concept.icon)}
                  </div>
                  
                  <div className="mt-4">
                    <span className="text-xs text-slate-400 font-mono tracking-wide">{concept.nameEn}</span>
                    <h3 className="text-xl font-bold text-slate-800 mt-0.5">{concept.nameAr}</h3>
                  </div>

                  <p className="text-xs text-slate-500 mt-2 line-clamp-3 font-light">
                    {concept.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
                  <span className={`text-xs font-semibold px-2 px-[7px] py-0.5 rounded-md ${styling.badge}`}>
                    طبيعته: {concept.nature === 'Debit' ? 'مدين ↗' : 'دائن ↘'}
                  </span>
                  
                  <span className="text-xs text-slate-400 font-bold">التفاصيل ←</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Detail Panel displaying the chosen Card under bento grid */}
        <AnimatePresence mode="wait">
          {selectedConcept && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-12 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden p-6 md:p-8"
              id="concept-details-container"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* General Description */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-teal-100/50 text-teal-700 p-2 text-xl rounded-xl">
                      {getIcon(selectedConcept.icon)}
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800">
                        {selectedConcept.nameAr} <span className="text-sm font-medium font-mono text-slate-400">({selectedConcept.nameEn})</span>
                      </h3>
                      <p className="text-xs text-teal-600 font-bold mt-0.5">تفاصيل وتحليل الحساب</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light">
                    {selectedConcept.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Nature Rule Box */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold text-slate-400">القاعدة المحاسبية ( Nature Rule ):</span>
                      <div className="flex items-center gap-2">
                        <Scale className="w-5 h-5 text-teal-600" />
                        <span className="text-sm font-bold text-slate-800">
                           حساب طبيعته <span className="text-teal-600 underline underline-offset-4">{selectedConcept.nature === 'Debit' ? 'مدين (Debit)' : 'دائن (Credit)'}</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        {selectedConcept.nature === 'Debit' 
                          ? 'أي زيادة على هذا الحساب يتم تسجيلها في الطرف المدين (من حـ/)، وأي انخفاض يسجل دائن (إلى حـ/).' 
                          : 'أي زيادة على هذا الحساب يتم تسجيلها في الطرف الدائن (إلى حـ/)، وأي انخفاض يسجل مدين (من حـ/).'}
                      </p>
                    </div>

                    {/* Effect on Balance Sheet Equation */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2">
                      <span className="text-xs font-bold text-slate-400">التأثير على معادلة الميزانية:</span>
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                        <span className="text-sm font-bold text-slate-800">
                          {selectedConcept.id === 'assets' && "يمثل يمين المعادلة للأصول"}
                          {selectedConcept.id === 'liabilities' && "يمثل يسار المعادلة للالتزامات"}
                          {selectedConcept.id === 'equity' && "يمثل يسار المعادلة لحقوق الملكية"}
                          {selectedConcept.id === 'revenues' && "يزيد صافي الدخل وحقوق الملكية (+)"}
                          {selectedConcept.id === 'expenses' && "يخفض صافي الدخل وحقوق الملكية (-)"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-light leading-relaxed">
                        {selectedConcept.id === 'assets' && "المعادلة: الأصول = الالتزامات + حقوق الملكية. زيادة الأصول تدفع لزيادة مساوية باليسار."}
                        {selectedConcept.id === 'liabilities' && "زيادة الالتزامات تمول شراء الأصول أو تطفىء ديوناً أخرى."}
                        {selectedConcept.id === 'equity' && "تمثل صافي القيمة المتبقية لملاك ومساهمي المنشأة في نهاية المطاف."}
                        {selectedConcept.id === 'revenues' && "كلما ارتفعت الإيرادات تزداد كفاءة وملاءة حقوق الملكية بشكل تلقائي."}
                        {selectedConcept.id === 'expenses' && "تمثل وقود تشغيل الإيرادات، وتؤثر بالسلب على الأرباح المحتفية في حقوق الملكية."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sub-Examples mapping */}
                <div className="lg:col-span-5 bg-teal-50/20 rounded-2xl border border-teal-100/40 p-6 space-y-4">
                  <h4 className="font-bold text-teal-800 flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>أمثلة تطبيقية هامة:</span>
                  </h4>
                  
                  <ul className="space-y-3">
                    {selectedConcept.examples.map((example, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600 font-medium text-xs sm:text-sm bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                        <span className="bg-teal-500/10 text-teal-700 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center font-mono">
                          {i + 1}
                        </span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-2 text-center">
                    <span className="text-[10px] text-slate-400 font-mono">FINANCIAL ACCOUNTING ELEMENTS</span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
