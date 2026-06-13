import { useState, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { transactionPresets } from '../data';
import { Scale, RotateCcw, Plus, Calendar, Coins, ArrowUpRight, CheckCircle2, ChevronRight, AlertTriangle, BookOpen } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  title: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
}

// Map account names to their group and category
const accountMeta: Record<string, { category: 'Assets' | 'Liabilities' | 'Equity' | 'Revenues' | 'Expenses' }> = {
  'الصندوق (النقدية)': { category: 'Assets' },
  'المعدات والأجهزة': { category: 'Assets' },
  'المخزون (البضاعة)': { category: 'Assets' },
  'الذمم الدائنة (الموردين)': { category: 'Liabilities' },
  'رأس المال': { category: 'Equity' },
  'إيرادات الخدمات': { category: 'Revenues' },
  'مصروف الإيجار': { category: 'Expenses' }
};

export default function DoubleEntrySandbox() {
  const [journal, setJournal] = useState<JournalEntry[]>([
    {
      id: 'init-1',
      date: '2026-06-01',
      title: 'بدء النشاط واستثمار رأس المال',
      debitAccount: 'الصندوق (النقدية)',
      creditAccount: 'رأس المال',
      amount: 15000
    }
  ]);

  // Form states for creating custom journal entry
  const [customTitle, setCustomTitle] = useState('');
  const [customDebit, setCustomDebit] = useState('الصندوق (النقدية)');
  const [customCredit, setCustomCredit] = useState('رأس المال');
  const [customAmount, setCustomAmount] = useState<number>(1000);
  const [activeTab, setActiveTab] = useState<'preset' | 'custom'>('preset');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Preset Selection Handler
  const handleApplyPreset = (presetId: string) => {
    const preset = transactionPresets.find(p => p.id === presetId);
    if (!preset) return;

    // Check duplicate check (optional, but let's allow multi additions with different IDs)
    const newEntry: JournalEntry = {
      id: `preset-${presetId}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: preset.title,
      debitAccount: preset.debitAccount,
      creditAccount: preset.creditAccount,
      amount: preset.amount
    };

    setJournal(prev => [...prev, newEntry]);
    showToast(`✓ تم إثبات قيد: "${preset.title}" بقيمة $${preset.amount.toLocaleString()} وترحيله بنجاح!`);
  };

  // Custom User Entry Handler
  const handleAddCustomEntry = (e: FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) {
      showToast('⚠️ يرجى إدخال وصف مبسط للعملية المالية!');
      return;
    }
    if (customDebit === customCredit) {
      showToast('⚠️ خطأ: لا يمكن ترحيل القيد لنفس الحساب الأصلي مدين ودائن!');
      return;
    }
    if (customAmount <= 0) {
      showToast('⚠️ يجب أن تكون القيمة المالية أكبر من صفر!');
      return;
    }

    const newEntry: JournalEntry = {
      id: `custom-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: customTitle,
      debitAccount: customDebit,
      creditAccount: customCredit,
      amount: customAmount
    };

    setJournal(prev => [...prev, newEntry]);
    setCustomTitle('');
    setCustomAmount(1000);
    showToast('🚀 تم ترحيل قيدك المخصص بنجاح إلى حسابات الأستاذ العام!');
  };

  // Reset simulation
  const handleReset = () => {
    setJournal([]);
    showToast('🔄 تم مسح كافة العمليات المالية المصطنعة وإعادة تصفير الدفاتر.');
  };

  // Calculate balances for each T-Account
  const tAccountsData = useMemo(() => {
    // Initialize accounts
    const accounts: Record<string, { debits: { desc: string; amount: number }[]; credits: { desc: string; amount: number }[] }> = {
      'الصندوق (النقدية)': { debits: [], credits: [] },
      'المعدات والأجهزة': { debits: [], credits: [] },
      'المخزون (البضاعة)': { debits: [], credits: [] },
      'الذمم الدائنة (الموردين)': { debits: [], credits: [] },
      'رأس المال': { debits: [], credits: [] },
      'إيرادات الخدمات': { debits: [], credits: [] },
      'مصروف الإيجار': { debits: [], credits: [] }
    };

    // Post each journal entry to accounts
    journal.forEach(entry => {
      // Debit side post
      if (accounts[entry.debitAccount]) {
        accounts[entry.debitAccount].debits.push({ desc: entry.title, amount: entry.amount });
      }
      // Credit side post
      if (accounts[entry.creditAccount]) {
        accounts[entry.creditAccount].credits.push({ desc: entry.title, amount: entry.amount });
      }
    });

    return accounts;
  }, [journal]) as Record<string, { debits: { desc: string; amount: number }[]; credits: { desc: string; amount: number }[] }>;

  // Compute current running accounting equation values
  const equationValues = useMemo(() => {
    let assets = 0;
    let liabilities = 0;
    let equity = 0;
    let revenues = 0;
    let expenses = 0;

    Object.entries(tAccountsData).forEach(([accName, rawData]) => {
      const data = rawData as { debits: { desc: string; amount: number }[]; credits: { desc: string; amount: number }[] };
      const meta = accountMeta[accName];
      if (!meta) return;

      const totalDebit = data.debits.reduce((sum, item) => sum + item.amount, 0);
      const totalCredit = data.credits.reduce((sum, item) => sum + item.amount, 0);
      
      // Calculate balance based on normal account nature
      if (meta.category === 'Assets') {
        assets += (totalDebit - totalCredit);
      } else if (meta.category === 'Liabilities') {
        liabilities += (totalCredit - totalDebit);
      } else if (meta.category === 'Equity') {
        equity += (totalCredit - totalDebit);
      } else if (meta.category === 'Revenues') {
        revenues += (totalCredit - totalDebit);
      } else if (meta.category === 'Expenses') {
        expenses += (totalDebit - totalCredit);
      }
    });

    // Accounting Equation: Assets = Liabilities + (Equity + Revenues - Expenses)
    // Retained Earnings are Revenues - Expenses
    const calculatedEquity = equity + revenues - expenses;
    const rightSide = liabilities + calculatedEquity;

    return {
      assets,
      liabilities,
      equity: calculatedEquity,
      rightSide,
      isBalanced: Math.abs(assets - rightSide) < 0.01
    };
  }, [tAccountsData]);

  // Get active accounts list
  const accountOptions = Object.keys(accountMeta);

  return (
    <section id="ledger" className="py-20 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-teal-600 tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase font-mono">
            المختبر المحاسبي العملي
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            محاكي القيد المزدوج وحسابات الأستاذ
          </h2>
          <p className="text-slate-600 mt-3 font-light text-base sm:text-lg">
            قم بالتحكم وتجربة المعاملات المالية كأنك مدير مالي للشركة. اختر قوالب جاهزة أو ابنِ قيدك المخصص لترى ميزان الحسابات ومعادلة الميزانية وهي تتفاعل وتتوازن على الفور!
          </p>
        </div>

        {/* Live Equation Banner with animated scale balance indicator */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 md:p-8 mb-12 shadow-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Visual Balance Scale representation */}
            <div className="flex flex-col items-center gap-1.5 min-w-[200px]">
              <span className="text-xs font-bold text-slate-400">حالة الميزان المحاسبي</span>
              <motion.div 
                animate={{ rotate: equationValues.isBalanced ? 0 : [0, -3, 3, 0] }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-slate-200/80 shadow-xs"
              >
                <Scale className={`w-5 h-5 ${equationValues.isBalanced ? 'text-emerald-600 animate-pulse' : 'text-amber-500'}`} />
                <span className={`text-sm font-bold ${equationValues.isBalanced ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {equationValues.isBalanced ? 'متوازن تماماً ✓' : 'غير متوازن ⚠️'}
                </span>
              </motion.div>
            </div>

            {/* The Equation Math Cards */}
            <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              
              {/* Assets card */}
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <span className="text-xs font-bold text-emerald-800">الأصول (الممتلكات)</span>
                <p className="text-2xl font-black text-emerald-700 mt-1">${equationValues.assets.toLocaleString()}</p>
              </div>

              {/* Equals sign */}
              <div className="flex items-center justify-center font-bold text-2xl text-slate-300 pointer-events-none self-center h-full">
                =
              </div>

              {/* Liabilities + Equity card */}
              <div className="bg-teal-600/10 border border-teal-500/20 rounded-2xl p-4 md:col-span-1 sm:col-span-1">
                <span className="text-xs font-bold text-teal-800">الالتزامات + حقوق الملكية</span>
                <div className="flex flex-col">
                  <p className="text-2xl font-black text-teal-700 mt-1">${equationValues.rightSide.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    الديون (${equationValues.liabilities.toLocaleString()}) + حقوق الملاك (${equationValues.equity.toLocaleString()})
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Action Center - Two Column (Applying Preset / Creating Custom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Controls Box: Preset or Custom Selector */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-6 shadow-xs">
            
            <div className="flex bg-slate-200/80 p-1 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab('preset')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'preset' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                سيناريوهات جاهزة
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === 'custom' ? 'bg-white text-teal-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                صياغة قيد مخصص
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'preset' ? (
                <motion.div
                  key="preset-tab"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-3"
                >
                  <h4 className="font-bold text-slate-700 text-sm">اختر سيناريو لتطبيقه على الدفتر المالي:</h4>
                  <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
                    {transactionPresets.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handleApplyPreset(preset.id)}
                        className="w-full text-right bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-teal-200 rounded-xl p-3.5 transition-all text-sm group flex justify-between items-start"
                      >
                        <div className="space-y-1 pl-2">
                          <h5 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{preset.title}</h5>
                          <p className="text-xs text-slate-400 font-light leading-snug">{preset.description}</p>
                          <span className="inline-block text-[10px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                            {preset.debitAccount} (مدين) ← {preset.creditAccount} (دائن)
                          </span>
                        </div>
                        <div className="bg-teal-50 group-hover:bg-teal-100 text-teal-700 text-xs font-extrabold px-3 py-1.5 rounded-lg shrink-0 mt-0.5 font-mono">
                          +${preset.amount.toLocaleString()}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="custom-tab"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleAddCustomEntry}
                  className="space-y-4"
                >
                  <h4 className="font-bold text-slate-700 text-sm">اكتب واقعة مالية واصنع قيودها المحاسبية بنفسك:</h4>
                  
                  {/* Title Input */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-bold">وصف مبسط ومعبر للعملية</label>
                    <input
                      type="text"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="مثال: شراء لوازم مكتبية ورقية"
                      value={customTitle}
                      onChange={e => setCustomTitle(e.target.value)}
                    />
                  </div>

                  {/* Debit / Credit drop downs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-bold">الطرف المدين (+) (من حـ/)</label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={customDebit}
                        onChange={e => setCustomDebit(e.target.value)}
                      >
                        {accountOptions.map(acc => (
                          <option key={acc} value={acc}>{acc}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-500 font-bold">الطرف الدائن (-) (إلى حـ/)</label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        value={customCredit}
                        onChange={e => setCustomCredit(e.target.value)}
                      >
                        {accountOptions.map(acc => (
                          <option key={acc} value={acc}>{acc}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-1">
                    <label className="text-xs text-slate-500 font-bold">القيمة المالية بالدولار ($)</label>
                    <input
                      type="number"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
                      min={1}
                      value={customAmount}
                      onChange={e => setCustomAmount(Math.max(1, parseInt(e.target.value) || 0))}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold p-3.5 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5 text-sm transition-transform active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تسجيل وترحيل القيد المحاسبي 🚀</span>
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-mono uppercase">Interactive Sandbox Engine</span>
              <button
                onClick={handleReset}
                className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-semibold transition-colors"
                id="btn-reset-sandbox"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>مسح وإعادة تصفير</span>
              </button>
            </div>

          </div>

          {/* Applied Journal Entries List */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-6 rounded-2xl shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>دفتر اليومية العامة ( Journal Entries )</span>
              </h4>
              <span className="text-xs font-bold text-slate-400 font-mono bg-white border border-slate-200 px-3 py-1 rounded-full">
                {journal.length} عمليات مسجلة
              </span>
            </div>

            {journal.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-200 py-16 text-center text-slate-400 rounded-xl space-y-2">
                <AlertTriangle className="w-8 h-8 mx-auto text-amber-400 animate-bounce" />
                <p className="text-sm font-bold">لا توجد أي معملات مالية مسجلة حالياً.</p>
                <p className="text-xs text-slate-400 font-light">اختر أحد السيناريوهات الجاهزة من اليمين للبدء.</p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
                {journal.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-2xs space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="bg-teal-50 text-teal-700 w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center font-mono">
                          {index + 1}
                        </span>
                        <h5 className="font-bold text-slate-800 text-sm">{entry.title}</h5>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {entry.date}
                      </span>
                    </div>

                    {/* Classic Debit/Credit visual style */}
                    <div className="grid grid-cols-12 gap-2 text-xs md:text-sm font-medium">
                      
                      {/* Left Header columns: accounts details */}
                      <div className="col-span-8 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-emerald-800">
                          <span className="text-[10px] bg-emerald-50 border border-emerald-100 px-1.5 rounded-md font-bold">حـ/ مدين</span>
                          <span>من حـ/ {entry.debitAccount}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600 mr-4">
                          <span className="text-[10px] bg-slate-100 border border-slate-200 px-1.5 rounded-md font-bold">حـ/ دائن</span>
                          <span>إلى حـ/ {entry.creditAccount}</span>
                        </div>
                      </div>

                      {/* Right: Amounts */}
                      <div className="col-span-4 flex flex-col justify-between text-left font-mono">
                        <span className="text-emerald-700 font-bold">${entry.amount.toLocaleString()}</span>
                        <span className="text-slate-500 font-bold">${entry.amount.toLocaleString()}</span>
                      </div>

                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* T-Accounts Board (حسابات حرف T الشهيرة لأستاذ العام) */}
        {journal.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
            id="t-accounts-board"
          >
            <div className="border-b border-slate-100 pb-4">
              <h4 className="font-extrabold text-slate-800 text-lg">دفتر الأستاذ العام (التسجيل على حسابات T-Accounts):</h4>
              <p className="text-xs text-slate-500">يقوم النظام بترحيل قيود اليومية تلقائياً لدفتر الأستاذ وحساب صافي الأرصدة لكل حساب رئيسي.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(tAccountsData).map(([accName, rawData]) => {
                const accData = rawData as { debits: { desc: string; amount: number }[]; credits: { desc: string; amount: number }[] };
                // Sums calculation
                const debitsTotal = accData.debits.reduce((sum, d) => sum + d.amount, 0);
                const creditsTotal = accData.credits.reduce((sum, c) => sum + c.amount, 0);
                
                // Balance calculation & Normal account side logic
                const meta = accountMeta[accName];
                const isNormalDebit = meta?.category === 'Assets' || meta?.category === 'Expenses';
                
                let balance = 0;
                let balanceSide: 'Debit' | 'Credit' | 'Zero' = 'Zero';

                if (isNormalDebit) {
                  balance = debitsTotal - creditsTotal;
                  balanceSide = balance > 0 ? 'Debit' : balance < 0 ? 'Credit' : 'Zero';
                } else {
                  balance = creditsTotal - debitsTotal;
                  balanceSide = balance > 0 ? 'Credit' : balance < 0 ? 'Debit' : 'Zero';
                }

                // Skip rendering empty accounts to save screen space/noise, but always render Cash (الصندوق)
                if (accData.debits.length === 0 && accData.credits.length === 0 && accName !== 'الصندوق (النقدية)') {
                  return null;
                }

                return (
                  <div key={accName} className="bg-slate-50/60 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
                    
                    {/* Account Title */}
                    <div className="border-b-2 border-slate-400 pb-2 text-center">
                      <span className="text-[10px] text-slate-400 font-mono font-bold tracking-wide">ِACCOUNT LEDGER</span>
                      <h5 className="font-extrabold text-slate-800 text-sm mt-0.5">{accName}</h5>
                    </div>

                    {/* Left: Debit, Right: Credit split columns (The T structure) */}
                    <div className="flex-1 grid grid-cols-2 gap-x-3 divide-x divide-slate-300 divide-x-reverse mt-3 text-[11px] min-h-[140px] font-medium">
                      
                      {/* Debit Column (يمين في العربية، ولكن تقليدياً يمين الحساب مدين ويساره دائن) */}
                      <div className="space-y-1.5 text-right font-light pl-1">
                        <span className="text-center block text-[10px] font-bold text-emerald-700 bg-emerald-50 py-0.5 rounded-sm mb-1.5">مدين (Debit)</span>
                        {accData.debits.map((deb, j) => (
                          <div key={j} className="flex justify-between items-center mr-1">
                            <span className="text-slate-500 font-normal line-clamp-1 truncate max-w-[60%]">{deb.desc}</span>
                            <span className="font-mono text-emerald-600 font-bold">${deb.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Credit Column (يسار دائن) */}
                      <div className="space-y-1.5 text-right font-light pr-1">
                        <span className="text-center block text-[10px] font-bold text-amber-700 bg-amber-50 py-0.5 rounded-sm mb-1.5">دائن (Credit)</span>
                        {accData.credits.map((cred, j) => (
                          <div key={j} className="flex justify-between items-center ml-1">
                            <span className="text-slate-500 font-normal line-clamp-1 truncate max-w-[60%]">{cred.desc}</span>
                            <span className="font-mono text-slate-700 font-bold">${cred.amount.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                    </div>

                    {/* Account bottom line summary with total check */}
                    <div className="border-t border-slate-300 pt-3 mt-3 flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-bold">الحساب الناتج:</span>
                      <div className="text-left">
                        <span className={`font-mono font-black ${balanceSide === 'Debit' ? 'text-emerald-700' : 'text-slate-800'}`}>
                          ${Math.abs(balance).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold inline-block mr-1">
                          ({isNormalDebit ? 'مدين دفترياً' : 'دائن دفترياً'})
                        </span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

      </div>

      {/* Interactive global toast alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-medium text-xs sm:text-sm py-4 px-6 rounded-2xl shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
