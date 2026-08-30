'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Account,
  Budget,
  Category,
  FinancialSummary,
  Goal,
  IncomeSource,
  RecurringTransaction,
  Transaction,
  WishlistItem,
} from '@/types';
import { calculateFinancialSummary } from '@/utils/financialCalculations';

interface FinanceContextType {
  accounts: Account[];
  categories: Category[];
  incomeSources: IncomeSource[];
  budgets: Budget[];
  goals: Goal[];
  recurringTransactions: RecurringTransaction[];
  transactions: Transaction[];
  wishlistItems: WishlistItem[];
  summary: FinancialSummary;
  minInvestmentTarget: number;
  setMinInvestmentTarget: (val: number) => void;
  // Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  // Accounts
  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  // Income Sources
  addIncomeSource: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncomeSource: (id: string, income: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;
  // Goals
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  // Categories & Budgets
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, plannedAmount: number) => void;
  deleteBudget: (id: string) => void;
  // Recurring
  addRecurringTransaction: (rec: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringStatus: (id: string, status: RecurringTransaction['status']) => void;
  deleteRecurringTransaction: (id: string) => void;
  // Wishlist
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'isConvertedToGoal'>) => void;
  convertWishlistToGoal: (itemId: string, targetDate: string) => void;
  deleteWishlistItem: (id: string) => void;
  // Reset & Clear
  resetToSeedData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
}

const DEFAULT_ACCOUNTS: Account[] = [
  { id: 'acc-1', name: 'Bank BCA Utama', type: 'bank', institution: 'BCA', balance: 4500000, currency: 'IDR', isActive: true },
  { id: 'acc-2', name: 'GoPay E-Wallet', type: 'e_wallet', institution: 'GoTo', balance: 650000, currency: 'IDR', isActive: true },
  { id: 'acc-3', name: 'Stockbit Investasi', type: 'investment', institution: 'Stockbit', balance: 5000000, currency: 'IDR', isActive: true },
  { id: 'acc-4', name: 'Dompet Tunai', type: 'cash', institution: 'Tunai', balance: 300000, currency: 'IDR', isActive: true },
];

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Sewa Kost & Tagihan', type: 'fixed_recurring', isEssential: true, icon: 'Home', color: '#059669' },
  { id: 'cat-2', name: 'Makanan & Groceries', type: 'variable', isEssential: true, icon: 'Utensils', color: '#10b981' },
  { id: 'cat-3', name: 'Transportasi', type: 'variable', isEssential: true, icon: 'Car', color: '#d97706' },
  { id: 'cat-4', name: 'Alokasi Keluarga', type: 'family', isEssential: true, icon: 'Heart', color: '#db2777' },
  { id: 'cat-5', name: 'Lifestyle & Jajan', type: 'lifestyle', isEssential: false, icon: 'Coffee', color: '#7c3aed' },
  { id: 'cat-6', name: 'Internet & Pulsa', type: 'fixed_recurring', isEssential: true, icon: 'Wifi', color: '#0891b2' },
];

const DEFAULT_INCOME_SOURCES: IncomeSource[] = [
  { id: 'inc-1', name: 'Gaji Internship', expectedAmount: 4500000, frequency: 'monthly', destinationAccountId: 'acc-1', isActive: true },
  { id: 'inc-2', name: 'Support Mingguan Ortu', expectedAmount: 150000, frequency: 'weekly', destinationAccountId: 'acc-1', isActive: true },
  { id: 'inc-3', name: 'Proyek Side Gig', expectedAmount: 750000, frequency: 'monthly', destinationAccountId: 'acc-2', isActive: true },
];

const DEFAULT_BUDGETS: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-1', periodYear: 2026, periodMonth: 9, plannedAmount: 1500000 },
  { id: 'bud-2', categoryId: 'cat-2', periodYear: 2026, periodMonth: 9, plannedAmount: 1200000 },
  { id: 'bud-3', categoryId: 'cat-3', periodYear: 2026, periodMonth: 9, plannedAmount: 400000 },
  { id: 'bud-4', categoryId: 'cat-4', periodYear: 2026, periodMonth: 9, plannedAmount: 500000 },
  { id: 'bud-5', categoryId: 'cat-5', periodYear: 2026, periodMonth: 9, plannedAmount: 500000 },
  { id: 'bud-6', categoryId: 'cat-6', periodYear: 2026, periodMonth: 9, plannedAmount: 150000 },
];

const DEFAULT_GOALS: Goal[] = [
  {
    id: 'goal-1',
    name: 'Tabungan iPhone 16',
    targetPrice: 14000000,
    resaleValueExpected: 3000000,
    currentSavedAmount: 3500000,
    targetDate: '2027-03-31',
    priority: 1,
    isEmergencyFund: false,
    status: 'active',
  },
  {
    id: 'goal-2',
    name: 'Liburan Naikk Gunung',
    targetPrice: 3000000,
    resaleValueExpected: 0,
    currentSavedAmount: 1200000,
    targetDate: '2026-11-30',
    priority: 2,
    isEmergencyFund: false,
    status: 'active',
  },
  {
    id: 'goal-3',
    name: 'Dana Darurat (6 Bulan)',
    targetPrice: 12000000,
    resaleValueExpected: 0,
    currentSavedAmount: 6000000,
    targetDate: '2027-12-31',
    priority: 1,
    isEmergencyFund: true,
    emergencyLevel: 2,
    status: 'active',
  },
];

const DEFAULT_RECURRING: RecurringTransaction[] = [
  { id: 'rec-1', accountId: 'acc-1', categoryId: 'cat-1', type: 'expense', amount: 1500000, description: 'Sewa Kost Bulanan', frequency: 'monthly', nextDueDate: '2026-09-01', status: 'upcoming', isActive: true },
  { id: 'rec-2', accountId: 'acc-1', categoryId: 'cat-6', type: 'expense', amount: 150000, description: 'Paket Internet Wi-Fi', frequency: 'monthly', nextDueDate: '2026-09-05', status: 'upcoming', isActive: true },
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 'tx-1', accountId: 'acc-1', type: 'income', amount: 4500000, transactionDate: '2026-08-25', description: 'Stipend Internship Agustus', categoryId: undefined, createdAt: new Date().toISOString() },
  { id: 'tx-2', accountId: 'acc-1', categoryId: 'cat-2', type: 'expense', amount: 95000, transactionDate: '2026-08-28', description: 'Makan Siang & Groceries', createdAt: new Date().toISOString() },
  { id: 'tx-3', accountId: 'acc-1', targetAccountId: 'acc-3', type: 'investment', amount: 500000, transactionDate: '2026-08-26', description: 'Investasi Stockbit (DCA)', createdAt: new Date().toISOString() },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>(DEFAULT_ACCOUNTS);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>(DEFAULT_INCOME_SOURCES);
  const [budgets, setBudgets] = useState<Budget[]>(DEFAULT_BUDGETS);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>(DEFAULT_RECURRING);
  const [transactions, setTransactions] = useState<Transaction[]>(DEFAULT_TRANSACTIONS);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [minInvestmentTarget, setMinInvestmentTarget] = useState<number>(500000);

  // Sync to LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('fin_tracker_data_classic_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.accounts) setAccounts(parsed.accounts);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.incomeSources) setIncomeSources(parsed.incomeSources);
        if (parsed.budgets) setBudgets(parsed.budgets);
        if (parsed.goals) setGoals(parsed.goals);
        if (parsed.recurringTransactions) setRecurringTransactions(parsed.recurringTransactions);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.wishlistItems) setWishlistItems(parsed.wishlistItems);
        if (parsed.minInvestmentTarget) setMinInvestmentTarget(parsed.minInvestmentTarget);
      } catch (e) {
        console.error('Failed parsing local financial state', e);
      }
    }
  }, []);

  const saveToStorage = (updatedState: Record<string, unknown>) => {
    const data = {
      accounts,
      categories,
      incomeSources,
      budgets,
      goals,
      recurringTransactions,
      transactions,
      wishlistItems,
      minInvestmentTarget,
      ...updatedState,
    };
    localStorage.setItem('fin_tracker_data_classic_v3', JSON.stringify(data));
  };

  // Transactions CRUD
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

    // Update physical account balance
    const nextAccs = accounts.map(acc => {
      if (acc.id === tx.accountId) {
        if (tx.type === 'expense' || tx.type === 'saving' || tx.type === 'investment' || tx.type === 'transfer') {
          return { ...acc, balance: Math.max(0, acc.balance - tx.amount) };
        } else if (tx.type === 'income' || tx.type === 'asset_sale') {
          return { ...acc, balance: acc.balance + tx.amount };
        }
      }
      if (tx.type === 'transfer' && acc.id === tx.targetAccountId) {
        return { ...acc, balance: acc.balance + tx.amount };
      }
      return acc;
    });
    setAccounts(nextAccs);

    let nextGoals = goals;
    if ((tx.type === 'saving' || tx.type === 'asset_sale') && tx.goalId) {
      nextGoals = goals.map(g => (g.id === tx.goalId ? { ...g, currentSavedAmount: g.currentSavedAmount + tx.amount } : g));
      setGoals(nextGoals);
    }

    saveToStorage({ transactions: nextTxs, accounts: nextAccs, goals: nextGoals });
  };

  const updateTransaction = (id: string, txPartial: Partial<Transaction>) => {
    const nextTxs = transactions.map(t => (t.id === id ? { ...t, ...txPartial } : t));
    setTransactions(nextTxs);
    saveToStorage({ transactions: nextTxs });
  };

  const deleteTransaction = (id: string) => {
    const nextTxs = transactions.filter(t => t.id !== id);
    setTransactions(nextTxs);
    saveToStorage({ transactions: nextTxs });
  };

  // Accounts CRUD
  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc: Account = { ...acc, id: `acc-${Date.now()}` };
    const nextAccs = [...accounts, newAcc];
    setAccounts(nextAccs);
    saveToStorage({ accounts: nextAccs });
  };

  const updateAccount = (id: string, accPartial: Partial<Account>) => {
    const nextAccs = accounts.map(a => (a.id === id ? { ...a, ...accPartial } : a));
    setAccounts(nextAccs);
    saveToStorage({ accounts: nextAccs });
  };

  const deleteAccount = (id: string) => {
    const nextAccs = accounts.filter(a => a.id !== id);
    setAccounts(nextAccs);
    saveToStorage({ accounts: nextAccs });
  };

  // Income Sources CRUD
  const addIncomeSource = (income: Omit<IncomeSource, 'id'>) => {
    const newIncome: IncomeSource = { ...income, id: `inc-${Date.now()}` };
    const nextSources = [...incomeSources, newIncome];
    setIncomeSources(nextSources);
    saveToStorage({ incomeSources: nextSources });
  };

  const updateIncomeSource = (id: string, incomePartial: Partial<IncomeSource>) => {
    const nextSources = incomeSources.map(i => (i.id === id ? { ...i, ...incomePartial } : i));
    setIncomeSources(nextSources);
    saveToStorage({ incomeSources: nextSources });
  };

  const deleteIncomeSource = (id: string) => {
    const nextSources = incomeSources.filter(i => i.id !== id);
    setIncomeSources(nextSources);
    saveToStorage({ incomeSources: nextSources });
  };

  // Goals CRUD
  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal: Goal = { ...goal, id: `goal-${Date.now()}` };
    const nextGoals = [...goals, newGoal];
    setGoals(nextGoals);
    saveToStorage({ goals: nextGoals });
  };

  const updateGoal = (id: string, goalPartial: Partial<Goal>) => {
    const nextGoals = goals.map(g => (g.id === id ? { ...g, ...goalPartial } : g));
    setGoals(nextGoals);
    saveToStorage({ goals: nextGoals });
  };

  const deleteGoal = (id: string) => {
    const nextGoals = goals.filter(g => g.id !== id);
    setGoals(nextGoals);
    saveToStorage({ goals: nextGoals });
  };

  // Categories & Budgets CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = { ...cat, id: `cat-${Date.now()}` };
    const nextCats = [...categories, newCat];
    setCategories(nextCats);
    saveToStorage({ categories: nextCats });
  };

  const updateCategory = (id: string, catPartial: Partial<Category>) => {
    const nextCats = categories.map(c => (c.id === id ? { ...c, ...catPartial } : c));
    setCategories(nextCats);
    saveToStorage({ categories: nextCats });
  };

  const deleteCategory = (id: string) => {
    const nextCats = categories.filter(c => c.id !== id);
    setCategories(nextCats);
    saveToStorage({ categories: nextCats });
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget: Budget = { ...budget, id: `bud-${Date.now()}` };
    const nextBudgets = [...budgets, newBudget];
    setBudgets(nextBudgets);
    saveToStorage({ budgets: nextBudgets });
  };

  const updateBudget = (id: string, plannedAmount: number) => {
    const nextBudgets = budgets.map(b => (b.id === id ? { ...b, plannedAmount } : b));
    setBudgets(nextBudgets);
    saveToStorage({ budgets: nextBudgets });
  };

  const deleteBudget = (id: string) => {
    const nextBudgets = budgets.filter(b => b.id !== id);
    setBudgets(nextBudgets);
    saveToStorage({ budgets: nextBudgets });
  };

  // Recurring
  const addRecurringTransaction = (rec: Omit<RecurringTransaction, 'id'>) => {
    const newRec: RecurringTransaction = { ...rec, id: `rec-${Date.now()}` };
    const nextRec = [...recurringTransactions, newRec];
    setRecurringTransactions(nextRec);
    saveToStorage({ recurringTransactions: nextRec });
  };

  const updateRecurringStatus = (id: string, status: RecurringTransaction['status']) => {
    const nextRec = recurringTransactions.map(r => (r.id === id ? { ...r, status } : r));
    setRecurringTransactions(nextRec);
    saveToStorage({ recurringTransactions: nextRec });
  };

  const deleteRecurringTransaction = (id: string) => {
    const nextRec = recurringTransactions.filter(r => r.id !== id);
    setRecurringTransactions(nextRec);
    saveToStorage({ recurringTransactions: nextRec });
  };

  // Wishlist
  const addWishlistItem = (item: Omit<WishlistItem, 'id' | 'isConvertedToGoal'>) => {
    const newItem: WishlistItem = { ...item, id: `wish-${Date.now()}`, isConvertedToGoal: false };
    const nextWish = [...wishlistItems, newItem];
    setWishlistItems(nextWish);
    saveToStorage({ wishlistItems: nextWish });
  };

  const convertWishlistToGoal = (itemId: string, targetDate: string) => {
    const item = wishlistItems.find(w => w.id === itemId);
    if (!item) return;

    addGoal({
      name: item.name,
      targetPrice: item.estimatedPrice,
      resaleValueExpected: 0,
      currentSavedAmount: 0,
      targetDate: targetDate,
      priority: item.priority,
      isEmergencyFund: false,
      status: 'active',
    });

    const nextWish = wishlistItems.map(w => (w.id === itemId ? { ...w, isConvertedToGoal: true } : w));
    setWishlistItems(nextWish);
    saveToStorage({ wishlistItems: nextWish });
  };

  const deleteWishlistItem = (id: string) => {
    const nextWish = wishlistItems.filter(w => w.id !== id);
    setWishlistItems(nextWish);
    saveToStorage({ wishlistItems: nextWish });
  };

  const resetToSeedData = () => {
    setAccounts(DEFAULT_ACCOUNTS);
    setCategories(DEFAULT_CATEGORIES);
    setIncomeSources(DEFAULT_INCOME_SOURCES);
    setBudgets(DEFAULT_BUDGETS);
    setGoals(DEFAULT_GOALS);
    setRecurringTransactions(DEFAULT_RECURRING);
    setTransactions(DEFAULT_TRANSACTIONS);
    setWishlistItems([]);
    setMinInvestmentTarget(500000);
    localStorage.removeItem('fin_tracker_data_classic_v3');
  };

  const clearAllData = () => {
    setAccounts([]);
    setIncomeSources([]);
    setBudgets([]);
    setGoals([]);
    setRecurringTransactions([]);
    setTransactions([]);
    setWishlistItems([]);
    setMinInvestmentTarget(0);
    localStorage.setItem('fin_tracker_data_classic_v3', JSON.stringify({ empty: true }));
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        accounts,
        categories,
        incomeSources,
        budgets,
        goals,
        recurringTransactions,
        transactions,
        wishlistItems,
      },
      null,
      2
    );
  };

  const summary = calculateFinancialSummary(
    accounts,
    goals,
    incomeSources,
    budgets,
    categories,
    transactions,
    minInvestmentTarget
  );

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        categories,
        incomeSources,
        budgets,
        goals,
        recurringTransactions,
        transactions,
        wishlistItems,
        summary,
        minInvestmentTarget,
        setMinInvestmentTarget,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addAccount,
        updateAccount,
        deleteAccount,
        addIncomeSource,
        updateIncomeSource,
        deleteIncomeSource,
        addGoal,
        updateGoal,
        deleteGoal,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addRecurringTransaction,
        updateRecurringStatus,
        deleteRecurringTransaction,
        addWishlistItem,
        convertWishlistToGoal,
        deleteWishlistItem,
        resetToSeedData,
        clearAllData,
        exportDataJSON,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
