import { motion } from 'motion/react';
import { Scale, Activity, ArrowDownLeft, ShieldCheck, Database } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
}

export default function Hero({ onExploreClick }: HeroProps) {
  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <section className="relative overflow-hidden bg-radial from-teal-50/70 via-white to-white py-16 md:py-24 border-b border-slate-100">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-200/10 rounded-full blur-3xl -z-10 animate-pulse duration-10000" />
      <div className="absolute bottom-10 left-1/4 w-80 h-80 bg-amber-200/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text and Primary CTA */}
          <motion.div 
            className="lg:col-span-7 space-y-6 text-right"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold"
              variants={itemVariants}
            >
              <Activity className="w-3.5 h-3.5 text-teal-600 animate-spin duration-3000" />
              <span>لغة المال والأعمال، الآن تفاعلية وبسيطة</span>
            </motion.div>

            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]"
              variants={itemVariants}
              id="hero-main-title"
            >
              أسرار <span className="text-teal-600 bg-linear-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">المحاسبة المالية</span> <br />
              في واجهة بصرية ملهمة
            </motion.h1>

            <motion.p 
              className="text-lg text-slate-600 max-w-2xl leading-relaxed font-light"
              variants={itemVariants}
            >
              يقول الخبراء إن "المحاسبة هي لغة الأعمال". بدونها، تُبحر الشركات كالعميان في عاصفة مالية. أهلاً بك في منصتنا المصممة خصيصاً لتكشف لك جمال توازن القيود، والمنطق الكامن وراء "المدين والدائن"، بلغة عربية سلسلة وعروض تفاعلية حية.
            </motion.p>

            <motion.div 
              className="flex flex-wrap items-center gap-4 pt-4 justify-start"
              variants={itemVariants}
            >
              <button
                onClick={onExploreClick}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-teal-600/10 transition-all hover:translate-y-[-2px] active:translate-y-0 duration-200 text-base"
                id="hero-cta-explore"
              >
                أبحر في كوكب المحاسبة 🚀
              </button>
              
              <a
                href="#ledger"
                className="inline-flex items-center gap-1.5 text-slate-700 hover:text-teal-700 font-semibold px-5 py-4 rounded-2xl border border-slate-200 bg-white shadow-xs hover:border-teal-200 transition-all duration-200 text-sm"
              >
                <span>جرب محاكي القيود المزدوجة</span>
                <ArrowDownLeft className="w-4 h-4 text-slate-400" />
              </a>
            </motion.div>

            {/* Quick feature indicators */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2.5">
                <div className="bg-emerald-50 rounded-lg p-2 text-emerald-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">دقة متوازنة</h4>
                  <p className="text-xs text-slate-400">توازن دائم 100%</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <div className="bg-amber-50 rounded-lg p-2 text-amber-600">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">هيكلة واضحة</h4>
                  <p className="text-xs text-slate-400">المعادلة المحاسبية</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="bg-violet-50 rounded-lg p-2 text-violet-600">
                  <Scale className="w-5 h-5 animate-bounce duration-3000" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">مدين ودائن</h4>
                  <p className="text-xs text-slate-400">تتبع ذكي ومبسط</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Interactive Visual Element (Scale Animation) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ type: 'spring', duration: 1.5 }}
              className="relative w-full max-w-[400px] aspect-square bg-white rounded-3xl border border-slate-100 shadow-xl p-6 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                  <div className="w-3.5 h-3.5 rounded-full bg-teal-400" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">LEDGER BALANCE SYSTEM</span>
              </div>

              {/* Graphical Scale */}
              <div className="flex-1 flex flex-col items-center justify-center py-6">
                <motion.div 
                  initial={{ rotate: -5 }}
                  animate={{ rotate: [5, -5, 5, 0] }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 7, ease: "easeInOut" }}
                  className="w-full flex flex-col items-center"
                >
                  {/* Balance Bar */}
                  <div className="w-4/5 h-2 bg-slate-800 rounded-full relative">
                    {/* Left Plate (Debit) */}
                    <div className="absolute top-0 -left-4 w-12 h-20 flex flex-col items-center">
                      <div className="w-0.5 h-12 bg-slate-500" />
                      <div className="w-12 h-6 bg-emerald-500 rounded-b-full border border-emerald-600 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-emerald-500/20">
                        DEBIT
                      </div>
                    </div>
                    {/* Right Plate (Credit) */}
                    <div className="absolute top-0 -right-4 w-12 h-20 flex flex-col items-center">
                      <div className="w-0.5 h-12 bg-slate-500" />
                      <div className="w-12 h-6 bg-teal-600 rounded-b-full border border-teal-700 flex items-center justify-center text-[9px] font-bold text-white shadow-md shadow-teal-500/20">
                        CREDIT
                      </div>
                    </div>
                  </div>
                  {/* Stand */}
                  <div className="w-1.5 h-28 bg-slate-800 relative z-10" />
                  <div className="w-20 h-4 bg-slate-800 rounded-t-lg" />
                </motion.div>
                
                {/* Visual Math balancing indicator */}
                <span className="text-xs text-slate-500 mt-4 text-center">
                  الأصول (100) = الالتزامات (40) + حقوق الملكية (60)
                </span>
                <div className="mt-2 text-[10px] text-emerald-600 font-mono tracking-wider bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-bold animate-pulse">
                  ✓ EQUATION BALANCED
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-2xl flex items-center justify-between text-xs text-slate-500">
                <span>توازن الكفتين مبدأ أساسي</span>
                <span className="font-bold text-teal-700">القيد المزدوج</span>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
