import { Account, Budget, Category, Goal, IncomeSource, Transaction, FinancialSummary } from '@/types';

export const formatCurrency = (amount: number, currency = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const calculateMonthlyIncomeEquivalent = (sources: IncomeSource[]): number => {
  return sources.reduce((total, source) => {
    if (!source.isActive) return total;
    switch (source.frequency) {
      case 'weekly':
        return total + source.expectedAmount * 4.33;
      case 'biweekly':
        return total + source.expectedAmount * 2.165;
      case 'monthly':
      default:
        return total + source.expectedAmount;
    }
  }, 0);
};

export const calculateRequiredGoalMonthlySaving = (goal: Goal): number => {
  const remaining = Math.max(0, goal.targetPrice - (goal.resaleValueExpected || 0) - goal.currentSavedAmount);
  if (remaining === 0) return 0;

  const now = new Date();
  const target = new Date(goal.targetDate);
  
  // Calculate difference in months
  const yearDiff = target.getFullYear() - now.getFullYear();
  const monthDiff = target.getMonth() - now.getMonth();
  const totalMonths = Math.max(1, yearDiff * 12 + monthDiff);

  return Math.ceil(remaining / totalMonths);
};

export interface ReadinessStatus {
  status: 'READY' | 'WAIT';
  reasons: string[];
}

export const evaluateGoalReadiness = (
  goal: Goal,
  emergencyFundTotal: number,
  monthlyEssentialExpenses: number,
  monthlyCashFlowNet: number
): ReadinessStatus => {
  const reasons: string[] = [];
  
  // Rule 1: Fund fully saved or cash available
  const isFundSufficient = goal.currentSavedAmount >= goal.targetPrice;
  if (!isFundSufficient) {
    const diff = goal.targetPrice - goal.currentSavedAmount;
    reasons.push(`Saved amount is Rp ${diff.toLocaleString('id-ID')} short of target price.`);
  }

  // Rule 2: Emergency fund must be above minimum 3-month runway
  const minEmergencyFund = monthlyEssentialExpenses * 3;
  const isEmergencySafe = emergencyFundTotal >= minEmergencyFund;
  if (!isEmergencySafe) {
    reasons.push(`Emergency fund (Rp ${emergencyFundTotal.toLocaleString('id-ID')}) is below minimum 3-month buffer (Rp ${minEmergencyFund.toLocaleString('id-ID')}).`);
  }

  // Rule 3: Projected cash flow remains positive
  const isCashFlowPositive = monthlyCashFlowNet > 0;
  if (!isCashFlowPositive) {
    reasons.push(`Current projected monthly cash flow is negative or zero.`);
  }

  const status = isFundSufficient && isEmergencySafe && isCashFlowPositive ? 'READY' : 'WAIT';

  return { status, reasons };
};

export const calculateFinancialSummary = (
  accounts: Account[],
  goals: Goal[],
  incomeSources: IncomeSource[],
  budgets: Budget[],
  categories: Category[],
  transactions: Transaction[],
  minInvestmentTarget = 500000
): FinancialSummary => {
  // Cash & Bank balances
  const totalCash = accounts
    .filter(a => a.isActive && (a.type === 'bank' || a.type === 'e_wallet' || a.type === 'cash'))
    .reduce((sum, a) => sum + a.balance, 0);

  // Investments balance
  const totalInvestments = accounts
    .filter(a => a.isActive && a.type === 'investment')
    .reduce((sum, a) => sum + a.balance, 0);

  // Savings (Goals non-emergency)
  const totalSavings = goals
    .filter(g => g.status === 'active' && !g.isEmergencyFund)
    .reduce((sum, g) => sum + g.currentSavedAmount, 0);

  // Emergency Fund
  const emergencyFund = goals
    .filter(g => g.status === 'active' && g.isEmergencyFund)
    .reduce((sum, g) => sum + g.currentSavedAmount, 0);

  const totalAssets = totalCash + totalSavings + emergencyFund + totalInvestments;
  const netWorth = totalAssets; // Subtract liabilities if any in future

  // Monthly Expected Income
  const monthlyExpectedIncome = calculateMonthlyIncomeEquivalent(incomeSources);

  // Monthly Actual Income (Current Month)
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.transactionDate);
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth;
  });

  const monthlyActualIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Planned Expenses from Budgets
  const monthlyPlannedExpenses = budgets.reduce((sum, b) => sum + b.plannedAmount, 0);

  // Actual Expenses this month
  const monthlyActualExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Required Goal Contributions per month
  const requiredGoalSavingsTotal = goals
    .filter(g => g.status === 'active')
    .reduce((sum, g) => sum + calculateRequiredGoalMonthlySaving(g), 0);

  // Total Planned Commitment
  const totalPlannedCommitment = monthlyPlannedExpenses + requiredGoalSavingsTotal + minInvestmentTarget;

  const isOverAllocated = totalPlannedCommitment > monthlyExpectedIncome;
  const overAllocatedAmount = isOverAllocated ? totalPlannedCommitment - monthlyExpectedIncome : 0;

  // Investment and Savings Rates based on Expected Income
  const activeIncome = monthlyExpectedIncome > 0 ? monthlyExpectedIncome : 1;
  const actualInvestmentThisMonth = currentMonthTransactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const actualSavingsThisMonth = currentMonthTransactions
    .filter(t => t.type === 'saving')
    .reduce((sum, t) => sum + t.amount, 0);

  const investmentRate = Math.round((actualInvestmentThisMonth / activeIncome) * 100);
  const savingRate = Math.round(((actualSavingsThisMonth + requiredGoalSavingsTotal) / activeIncome) * 100);
  const totalWealthContribution = actualSavingsThisMonth + actualInvestmentThisMonth + requiredGoalSavingsTotal;

  // Emergency Runway (Months)
  const essentialCategories = categories.filter(c => c.isEssential).map(c => c.id);
  const essentialMonthlyExpenses = budgets
    .filter(b => essentialCategories.includes(b.categoryId))
    .reduce((sum, b) => sum + b.plannedAmount, 0) || 1500000;

  const emergencyRunwayMonths = Math.round((emergencyFund / essentialMonthlyExpenses) * 10) / 10;

  // Financial Health Score Calculation (0 - 100)
  // Weights: Savings Rate (20%), Emergency Runway (25%), Investment Consistency (20%), Budget Discipline (20%), Cash Flow (15%)
  const savingsScore = Math.min(100, (savingRate / 20) * 100);
  const emergencyScore = Math.min(100, (emergencyRunwayMonths / 6) * 100);
  const investmentScore = Math.min(100, (investmentRate / 15) * 100);
  const disciplineScore = isOverAllocated ? 50 : 100;
  const cashFlowScore = (monthlyExpectedIncome - monthlyPlannedExpenses) > 0 ? 100 : 40;

  const healthScore = Math.round(
    savingsScore * 0.20 +
    emergencyScore * 0.25 +
    investmentScore * 0.20 +
    disciplineScore * 0.20 +
    cashFlowScore * 0.15
  );

  return {
    totalCash,
    totalSavings,
    emergencyFund,
    totalInvestments,
    totalAssets,
    netWorth,
    monthlyExpectedIncome,
    monthlyActualIncome,
    monthlyPlannedExpenses,
    monthlyActualExpenses,
    totalPlannedCommitment,
    isOverAllocated,
    overAllocatedAmount,
    investmentRate,
    savingRate,
    totalWealthContribution,
    emergencyRunwayMonths,
    healthScore,
  };
};
