import { Transaction, Account, Category, Goal } from '@/types';

export const exportTransactionsToCSV = (
  transactions: Transaction[],
  accounts: Account[],
  categories: Category[],
  goals: Goal[]
): void => {
  const headers = ['ID', 'Date', 'Type', 'Amount', 'Source Account', 'Target Account / Goal', 'Category', 'Description'];
  
  const rows = transactions.map(t => {
    const acc = accounts.find(a => a.id === t.accountId)?.name || t.accountId;
    const targetAcc = t.targetAccountId ? accounts.find(a => a.id === t.targetAccountId)?.name || t.targetAccountId : '';
    const goal = t.goalId ? goals.find(g => g.id === t.goalId)?.name || t.goalId : '';
    const cat = categories.find(c => c.id === t.categoryId)?.name || '';

    return [
      t.id,
      t.transactionDate,
      t.type,
      t.amount,
      `"${acc}"`,
      `"${targetAcc || goal}"`,
      `"${cat}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
    ].join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `finance_tracker_transactions_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
