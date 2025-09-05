import React, { createContext, useContext, useState, ReactNode } from 'react';
import { walletAPI } from '../services/api';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'earning' | 'reward';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  deposit: (amount: number) => Promise<boolean>;
  withdraw: (amount: number, bankAccount: string) => Promise<boolean>;
  addEarning: (amount: number, description: string) => void;
  addReward: (amount: number, description: string) => void;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [balance, setBalance] = useState(245000); // Initial balance in Rial
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'earning',
      amount: 50000,
      description: 'درآمد از ویدیو "آموزش React"',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'reward',
      amount: 25000,
      description: 'پاداش ورود روزانه',
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'deposit',
      amount: 100000,
      description: 'واریز از کارت بانکی',
      date: '2024-01-13',
      status: 'completed'
    },
    {
      id: '4',
      type: 'withdraw',
      amount: 75000,
      description: 'برداشت به حساب بانکی',
      date: '2024-01-12',
      status: 'completed'
    }
  ]);

  const fetchBalance = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.getBalance();
      if (response.success && response.data?.balance !== undefined) {
        setBalance(response.data.balance);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت موجودی');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.getTransactions();
      if (response.success && response.data?.transactions) {
        setTransactions(response.data.transactions);
      }
    } catch (err: any) {
      setError(err.message || 'خطا در دریافت تراکنش‌ها');
    } finally {
      setLoading(false);
    }
  };

  const deposit = async (amount: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.deposit(amount, 'card');
      if (response.success) {
        await fetchBalance();
        await fetchTransactions();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'خطا در واریز');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const withdraw = async (amount: number, bankAccount: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await walletAPI.withdraw(amount, bankAccount);
      if (response.success) {
        await fetchBalance();
        await fetchTransactions();
        return true;
      }
      return false;
    } catch (err: any) {
      setError(err.message || 'خطا در برداشت');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addEarning = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'earning',
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
  };

  const addReward = (amount: number, description: string) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      type: 'reward',
      amount,
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'completed'
    };

    setTransactions(prev => [newTransaction, ...prev]);
    setBalance(prev => prev + amount);
  };

  const value = {
    balance,
    transactions,
    loading,
    error,
    deposit,
    withdraw,
    addEarning,
    addReward,
    fetchBalance,
    fetchTransactions
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};