export interface AccountingConcept {
  id: string;
  nameAr: string;
  nameEn: string;
  description: string;
  color: string;
  icon: string;
  examples: string[];
  equationSign: '+' | '-';
  nature: 'Debit' | 'Credit'; // Debit (مدين) or Credit (دائن)
}

export interface TransactionPreset {
  id: string;
  title: string;
  description: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  equationEffect: string;
}

export interface TAccount {
  id: string;
  nameAr: string;
  nameEn: string;
  category: 'Assets' | 'Liabilities' | 'Equity' | 'Revenues' | 'Expenses';
  debits: { desc: string; amount: number }[];
  credits: { desc: string; amount: number }[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FinancialItem {
  id: string;
  nameAr: string;
  nameEn: string;
  amount: number;
  category: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  subCategory?: string;
}
