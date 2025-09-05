import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, CreditCard, TrendingUp, TrendingDown,
  Plus, Minus, Eye, Calendar, Filter, Download, Upload as UploadIcon
} from 'lucide-react';
import { useWallet } from '../contexts/WalletContext';
import { useLanguage } from '../contexts/LanguageContext';

const Wallet: React.FC = () => {
  const { balance, transactions, deposit, withdraw } = useWallet();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'deposit' | 'withdraw' | 'history'>('overview');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositAmount || isProcessing) return;

    setIsProcessing(true);
    const success = await deposit(parseInt(depositAmount));
    if (success) {
      setDepositAmount('');
    }
    setIsProcessing(false);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || !bankAccount || isProcessing) return;

    setIsProcessing(true);
    const success = await withdraw(parseInt(withdrawAmount), bankAccount);
    if (success) {
      setWithdrawAmount('');
      setBankAccount('');
    }
    setIsProcessing(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <Plus className="w-4 h-4 text-green-500" />;
      case 'withdraw':
        return <Minus className="w-4 h-4 text-red-500" />;
      case 'earning':
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case 'reward':
        return <TrendingUp className="w-4 h-4 text-gold-500" />;
      default:
        return <WalletIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'deposit':
      case 'earning':
      case 'reward':
        return 'text-green-600';
      case 'withdraw':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const tabs = [
    { id: 'overview', label: 'نمای کلی', icon: Eye },
    { id: 'deposit', label: 'واریز', icon: Plus },
    { id: 'withdraw', label: 'برداشت', icon: Minus },
    { id: 'history', label: 'تاریخچه', icon: Calendar },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('wallet.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          مدیریت موجودی و تراکنش‌های مالی شما
        </p>
      </div>

      {/* Wallet Card */}
      <div className="wallet-card relative">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <WalletIcon className="w-8 h-8" />
              <div>
                <p className="text-white/80 text-sm">موجودی کل</p>
                <p className="text-3xl font-bold">{formatBalance(balance)} ریال</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">شماره کیف پول</p>
              <p className="font-mono text-lg">VT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">درآمد این ماه</p>
              <p className="text-xl font-bold text-green-300">+{formatBalance(125000)} ریال</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">پاداش‌ها</p>
              <p className="text-xl font-bold text-gold-300">+{formatBalance(45000)} ریال</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-white/80 text-sm">برداشت‌ها</p>
              <p className="text-xl font-bold text-red-300">-{formatBalance(75000)} ریال</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-vitimo-600 border-b-2 border-vitimo-600 bg-vitimo-50 dark:bg-vitimo-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <IconComponent className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-green-700 dark:text-green-300">درآمد کل</h3>
                </div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                  {formatBalance(850000)} ریال
                </p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  +۱۵% نسبت به ماه قبل
                </p>
              </div>

              <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 p-6 rounded-xl border border-gold-200 dark:border-gold-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-gold-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gold-700 dark:text-gold-300">پاداش‌ها</h3>
                </div>
                <p className="text-2xl font-bold text-gold-800 dark:text-gold-200">
                  {formatBalance(125000)} ریال
                </p>
                <p className="text-sm text-gold-600 dark:text-gold-400 mt-1">
                  از ۲۵ فعالیت
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-blue-700 dark:text-blue-300">درآمد ویدیو</h3>
                </div>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {formatBalance(725000)} ریال
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                  از ۱۲ ویدیو
                </p>
              </div>

              <div className="bg-gradient-to-br from-vitimo-50 to-vitimo-100 dark:from-vitimo-900/20 dark:to-vitimo-800/20 p-6 rounded-xl border border-vitimo-200 dark:border-vitimo-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-vitimo-500 rounded-lg">
                    <WalletIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-vitimo-700 dark:text-vitimo-300">موجودی فعلی</h3>
                </div>
                <p className="text-2xl font-bold text-vitimo-800 dark:text-vitimo-200">
                  {formatBalance(balance)} ریال
                </p>
                <p className="text-sm text-vitimo-600 dark:text-vitimo-400 mt-1">
                  آماده برداشت
                </p>
              </div>
            </div>
          )}

          {/* Deposit Tab */}
          {activeTab === 'deposit' && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-vitimo rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  واریز به کیف پول
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  موجودی فعلی: {formatBalance(balance)} ریال
                </p>
              </div>

              <form onSubmit={handleDeposit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مبلغ واریز (ریال)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="مثال: 100000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    required
                    min="10000"
                    max="10000000"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    حداقل: ۱۰,۰۰۰ ریال - حداکثر: ۱۰,۰۰۰,۰۰۰ ریال
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-3">روش پرداخت</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <input type="radio" name="payment" value="card" defaultChecked className="text-vitimo-600" />
                      <CreditCard className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">کارت بانکی</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                      <input type="radio" name="payment" value="bank" className="text-vitimo-600" />
                      <WalletIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">انتقال بانکی</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!depositAmount || isProcessing}
                  className="w-full bg-gradient-vitimo text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-vitimo transition-all transform hover:scale-105"
                >
                  {isProcessing ? 'در حال پردازش...' : `واریز ${depositAmount ? formatBalance(parseInt(depositAmount)) : '0'} ریال`}
                </button>
              </form>
            </div>
          )}

          {/* Withdraw Tab */}
          {activeTab === 'withdraw' && (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Minus className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  برداشت از کیف پول
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  موجودی قابل برداشت: {formatBalance(balance)} ریال
                </p>
              </div>

              <form onSubmit={handleWithdraw} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    مبلغ برداشت (ریال)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="مثال: 50000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    required
                    min="50000"
                    max={balance}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    حداقل: ۵۰,۰۰۰ ریال - حداکثر: {formatBalance(balance)} ریال
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    شماره حساب بانکی
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="مثال: 1234567890123456"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-vitimo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    ⚠️ برداشت معمولاً ۲۴ تا ۴۸ ساعت زمان می‌برد. کارمزد برداشت ۵,۰۰۰ ریال است.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!withdrawAmount || !bankAccount || isProcessing || parseInt(withdrawAmount) > balance}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                  {isProcessing ? 'در حال پردازش...' : `برداشت ${withdrawAmount ? formatBalance(parseInt(withdrawAmount)) : '0'} ریال`}
                </button>
              </form>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  تاریخچه تراکنش‌ها
                </h2>
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>فیلتر</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-vitimo-100 dark:bg-vitimo-900 text-vitimo-700 dark:text-vitimo-300 hover:bg-vitimo-200 dark:hover:bg-vitimo-800 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span>دانلود</span>
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {transaction.description}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {transaction.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-lg ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'withdraw' ? '-' : '+'}
                        {formatBalance(transaction.amount)} ریال
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : transaction.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {transaction.status === 'completed' ? 'تکمیل شده' : 
                         transaction.status === 'pending' ? 'در انتظار' : 'ناموفق'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {transactions.length === 0 && (
                <div className="text-center py-12">
                  <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    هنوز تراکنشی انجام نشده
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;