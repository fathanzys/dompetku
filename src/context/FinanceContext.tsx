'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toSnakeCase, toCamelCase } from '@/utils/caseHelper';
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
  user: any;
  isLoaded: boolean;
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
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addAccount: (acc: Omit<Account, 'id'>) => void;
  updateAccount: (id: string, acc: Partial<Account>) => void;
  deleteAccount: (id: string) => void;
  addIncomeSource: (income: Omit<IncomeSource, 'id'>) => void;
  updateIncomeSource: (id: string, income: Partial<IncomeSource>) => void;
  deleteIncomeSource: (id: string) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, plannedAmount: number) => void;
  deleteBudget: (id: string) => void;
  addRecurringTransaction: (rec: Omit<RecurringTransaction, 'id'>) => void;
  updateRecurringStatus: (id: string, status: RecurringTransaction['status']) => void;
  deleteRecurringTransaction: (id: string) => void;
  addWishlistItem: (item: Omit<WishlistItem, 'id' | 'isConvertedToGoal'>) => void;
  convertWishlistToGoal: (itemId: string, targetDate: string) => void;
  deleteWishlistItem: (id: string) => void;
  resetToSeedData: () => void;
  clearAllData: () => void;
  exportDataJSON: () => string;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [minInvestmentTarget, setMinInvestmentTarget] = useState<number>(500000);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchFromSupabase(session.user.id);
      } else {
        loadFromLocal();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchFromSupabase(session.user.id);
      } else {
        loadFromLocal();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadFromLocal = () => {
    const saved = localStorage.getItem('fin_tracker_data_v4');
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
        console.error('Failed parsing local data', e);
      }
    }
    setIsLoaded(true);
  };

  const fetchFromSupabase = async (userId: string) => {
    try {
      const [acc, tx, cat, goal, bud, inc] = await Promise.all([
        supabase.from('accounts').select('*').eq('user_id', userId),
        supabase.from('transactions').select('*').eq('user_id', userId).order('transaction_date', { ascending: false }),
        supabase.from('categories').select('*').eq('user_id', userId),
        supabase.from('goals').select('*').eq('user_id', userId),
        supabase.from('budgets').select('*').eq('user_id', userId),
        supabase.from('income_sources').select('*').eq('user_id', userId),
      ]);

      if (acc.data) setAccounts(toCamelCase(acc.data));
      if (tx.data) setTransactions(toCamelCase(tx.data));
      if (cat.data) setCategories(toCamelCase(cat.data));
      if (goal.data) setGoals(toCamelCase(goal.data));
      if (bud.data) setBudgets(toCamelCase(bud.data));
      if (inc.data) setIncomeSources(toCamelCase(inc.data));
      
      // Fallback for tables that might not exist in Supabase yet
      const saved = localStorage.getItem('fin_tracker_data_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.recurringTransactions) setRecurringTransactions(parsed.recurringTransactions);
        if (parsed.wishlistItems) setWishlistItems(parsed.wishlistItems);
      }
    } catch (e) {
      console.error('Error fetching from Supabase', e);
    }
    setIsLoaded(true);
  };

  const syncState = (newState: any) => {
    // 1. Update local storage as a backup
    const data = {
      accounts, categories, incomeSources, budgets, goals, recurringTransactions, transactions, wishlistItems, minInvestmentTarget,
      ...newState,
    };
    localStorage.setItem('fin_tracker_data_v4', JSON.stringify(data));

    // 2. Sync to Supabase if logged in
    if (!user) return;
    
    // Fire and forget upserts (Optimistic UI approach)
    if (newState.accounts) {
      supabase.from('accounts').upsert(newState.accounts.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
    if (newState.transactions) {
      // Upsert only new/updated transactions if possible, but here we just upsert the whole array
      supabase.from('transactions').upsert(newState.transactions.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
    if (newState.categories) {
      supabase.from('categories').upsert(newState.categories.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
    if (newState.goals) {
      supabase.from('goals').upsert(newState.goals.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
    if (newState.budgets) {
      supabase.from('budgets').upsert(newState.budgets.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
    if (newState.incomeSources) {
      supabase.from('income_sources').upsert(newState.incomeSources.map((x: any) => toSnakeCase({ ...x, user_id: user.id }))).then();
    }
  };

  const syncDelete = (table: string, id: string) => {
    if (user) {
      supabase.from(table).delete().eq('id', id).eq('user_id', user.id).then();
    }
  };

  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    const nextTxs = [newTx, ...transactions];
    setTransactions(nextTxs);

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

    syncState({ transactions: nextTxs, accounts: nextAccs, goals: nextGoals });
  };

  const updateTransaction = (id: string, txPartial: Partial<Transaction>) => {
    const nextTxs = transactions.map(t => (t.id === id ? { ...t, ...txPartial } : t));
    setTransactions(nextTxs);
    syncState({ transactions: nextTxs });
  };

  const deleteTransaction = (id: string) => {
    const nextTxs = transactions.filter(t => t.id !== id);
    setTransactions(nextTxs);
    syncState({ transactions: nextTxs });
    syncDelete('transactions', id);
  };

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const nextAccs = [...accounts, { ...acc, id: crypto.randomUUID() }];
    setAccounts(nextAccs);
    syncState({ accounts: nextAccs });
  };

  const updateAccount = (id: string, accPartial: Partial<Account>) => {
    const nextAccs = accounts.map(a => (a.id === id ? { ...a, ...accPartial } : a));
    setAccounts(nextAccs);
    syncState({ accounts: nextAccs });
  };

  const deleteAccount = (id: string) => {
    const nextAccs = accounts.filter(a => a.id !== id);
    setAccounts(nextAccs);
    syncState({ accounts: nextAccs });
    syncDelete('accounts', id);
  };

  const addIncomeSource = (income: Omit<IncomeSource, 'id'>) => {
    const nextSources = [...incomeSources, { ...income, id: crypto.randomUUID() }];
    setIncomeSources(nextSources);
    syncState({ incomeSources: nextSources });
  };

  const updateIncomeSource = (id: string, incomePartial: Partial<IncomeSource>) => {
    const nextSources = incomeSources.map(i => (i.id === id ? { ...i, ...incomePartial } : i));
    setIncomeSources(nextSources);
    syncState({ incomeSources: nextSources });
  };

  const deleteIncomeSource = (id: string) => {
    const nextSources = incomeSources.filter(i => i.id !== id);
    setIncomeSources(nextSources);
    syncState({ incomeSources: nextSources });
    syncDelete('income_sources', id);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const nextGoals = [...goals, { ...goal, id: crypto.randomUUID() }];
    setGoals(nextGoals);
    syncState({ goals: nextGoals });
  };

  const updateGoal = (id: string, goalPartial: Partial<Goal>) => {
    const nextGoals = goals.map(g => (g.id === id ? { ...g, ...goalPartial } : g));
    setGoals(nextGoals);
    syncState({ goals: nextGoals });
  };

  const deleteGoal = (id: string) => {
    const nextGoals = goals.filter(g => g.id !== id);
    setGoals(nextGoals);
    syncState({ goals: nextGoals });
    syncDelete('goals', id);
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    const nextCats = [...categories, { ...cat, id: crypto.randomUUID() }];
    setCategories(nextCats);
    syncState({ categories: nextCats });
  };

  const updateCategory = (id: string, catPartial: Partial<Category>) => {
    const nextCats = categories.map(c => (c.id === id ? { ...c, ...catPartial } : c));
    setCategories(nextCats);
    syncState({ categories: nextCats });
  };

  const deleteCategory = (id: string) => {
    const nextCats = categories.filter(c => c.id !== id);
    setCategories(nextCats);
    syncState({ categories: nextCats });
    syncDelete('categories', id);
  };

  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const nextBudgets = [...budgets, { ...budget, id: crypto.randomUUID() }];
    setBudgets(nextBudgets);
    syncState({ budgets: nextBudgets });
  };

  const updateBudget = (id: string, plannedAmount: number) => {
    const nextBudgets = budgets.map(b => (b.id === id ? { ...b, plannedAmount } : b));
    setBudgets(nextBudgets);
    syncState({ budgets: nextBudgets });
  };

  const deleteBudget = (id: string) => {
    const nextBudgets = budgets.filter(b => b.id !== id);
    setBudgets(nextBudgets);
    syncState({ budgets: nextBudgets });
    syncDelete('budgets', id);
  };

  const addRecurringTransaction = (rec: Omit<RecurringTransaction, 'id'>) => {
    const nextRec = [...recurringTransactions, { ...rec, id: crypto.randomUUID() }];
    setRecurringTransactions(nextRec);
    syncState({ recurringTransactions: nextRec });
  };

  const updateRecurringStatus = (id: string, status: RecurringTransaction['status']) => {
    const nextRec = recurringTransactions.map(r => (r.id === id ? { ...r, status } : r));
    setRecurringTransactions(nextRec);
    syncState({ recurringTransactions: nextRec });
  };

  const deleteRecurringTransaction = (id: string) => {
    const nextRec = recurringTransactions.filter(r => r.id !== id);
    setRecurringTransactions(nextRec);
    syncState({ recurringTransactions: nextRec });
  };

  const addWishlistItem = (item: Omit<WishlistItem, 'id' | 'isConvertedToGoal'>) => {
    const nextWish = [...wishlistItems, { ...item, id: crypto.randomUUID(), isConvertedToGoal: false }];
    setWishlistItems(nextWish);
    syncState({ wishlistItems: nextWish });
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
    syncState({ wishlistItems: nextWish });
  };

  const deleteWishlistItem = (id: string) => {
    const nextWish = wishlistItems.filter(w => w.id !== id);
    setWishlistItems(nextWish);
    syncState({ wishlistItems: nextWish });
  };

  const resetToSeedData = () => {
    clearAllData();
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
    localStorage.setItem('fin_tracker_data_v4', JSON.stringify({ empty: true }));
  };

  const exportDataJSON = (): string => {
    return JSON.stringify(
      {
        exportedAt: new Date().toISOString(),
        accounts, categories, incomeSources, budgets, goals, recurringTransactions, transactions, wishlistItems,
      },
      null,
      2
    );
  };

  const summary = calculateFinancialSummary(accounts, goals, incomeSources, budgets, categories, transactions, minInvestmentTarget);

  return (
    <FinanceContext.Provider
      value={{
        user, isLoaded,
        accounts, categories, incomeSources, budgets, goals, recurringTransactions, transactions, wishlistItems,
        summary, minInvestmentTarget, setMinInvestmentTarget,
        addTransaction, updateTransaction, deleteTransaction,
        addAccount, updateAccount, deleteAccount,
        addIncomeSource, updateIncomeSource, deleteIncomeSource,
        addGoal, updateGoal, deleteGoal,
        addCategory, updateCategory, deleteCategory,
        addBudget, updateBudget, deleteBudget,
        addRecurringTransaction, updateRecurringStatus, deleteRecurringTransaction,
        addWishlistItem, convertWishlistToGoal, deleteWishlistItem,
        resetToSeedData, clearAllData, exportDataJSON,
      }}
    >
      {isLoaded ? children : null}
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
