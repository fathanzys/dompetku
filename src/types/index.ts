export type TransactionType = 'income' | 'expense' | 'transfer' | 'investment' | 'saving' | 'asset_sale';

export type AccountType = 'bank' | 'e_wallet' | 'investment' | 'cash' | 'credit_card' | 'other';

export type CategoryType = 
  | 'fixed_recurring' 
  | 'variable' 
  | 'one_time' 
  | 'wishlist_goal' 
  | 'family' 
  | 'lifestyle' 
  | 'emergency';

export type GoalStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'custom';

export type RecurringStatus = 'upcoming' | 'due' | 'paid' | 'skipped' | 'modified';

export interface Account {
  id: string;
  name: string;
  type: AccountType;
  institution?: string;
  balance: number;
  currency: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  isEssential: boolean;
  icon?: string;
  color?: string;
}

export interface IncomeSource {
  id: string;
  name: string;
  expectedAmount: number;
  frequency: RecurringFrequency;
  destinationAccountId?: string;
  isActive: boolean;
  notes?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  periodYear: number;
  periodMonth: number; // 1-12
  plannedAmount: number;
}

export interface Goal {
  id: string;
  name: string;
  targetPrice: number;
  minExpectedPrice?: number;
  maxBudget?: number;
  resaleValueExpected: number;
  currentSavedAmount: number;
  targetDate: string; // ISO date format YYYY-MM-DD
  priority: number;
  isEmergencyFund: boolean;
  emergencyLevel?: number; // 1 to 4
  status: GoalStatus;
}

export interface RecurringTransaction {
  id: string;
  accountId: string;
  categoryId?: string;
  type: TransactionType;
  amount: number;
  description: string;
  frequency: RecurringFrequency;
  nextDueDate: string;
  status: RecurringStatus;
  isActive: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  targetAccountId?: string; // For transfers
  categoryId?: string;
  goalId?: string; // For saving/goal contributions
  recurringTransactionId?: string;
  type: TransactionType;
  amount: number;
  transactionDate: string;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: string;
  name: string;
  estimatedPrice: number;
  priority: number;
  targetMonth?: string;
  categoryId?: string;
  isConvertedToGoal: boolean;
}

export interface FinancialSummary {
  totalCash: number;
  totalSavings: number;
  emergencyFund: number;
  totalInvestments: number;
  totalAssets: number;
  netWorth: number;
  monthlyExpectedIncome: number;
  monthlyActualIncome: number;
  monthlyPlannedExpenses: number;
  monthlyActualExpenses: number;
  totalPlannedCommitment: number;
  isOverAllocated: boolean;
  overAllocatedAmount: number;
  investmentRate: number;
  savingRate: number;
  totalWealthContribution: number;
  emergencyRunwayMonths: number;
  healthScore: number;
}
