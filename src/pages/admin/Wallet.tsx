import React, { useState } from 'react';
import { 
  Wallet, CreditCard, TrendingUp, TrendingDown, DollarSign, 
  Users, ArrowUpRight, ArrowDownLeft, Filter, Download,
  Calendar, Search, RefreshCw, AlertCircle, CheckCircle
} from 'lucide-react';
import { useWallet } from '../../contexts/WalletContext';
import { useLanguage } from '../../contexts/LanguageContext';

const AdminWallet: React.FC = () => {
  const { balance, transactions, totalEarnings, pendingWithdrawals } = useWallet();
  const { language } = useLanguage();
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal' | 'earning'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyRevenue = [
    { month: 'فروردین', revenue: 2500000, transactions: 145 },
    { month: 'اردیبهشت', revenue: 3200000, transactions: 189 },
    { month: 'خرداد', revenue: 4100000, transactions: 234 },
    { month: 'تیر', revenue: 4800000, transactions: 267 },
    { month: 'مرداد', revenue: 5500000, transactions: 298 },
    { month: 'شهریور', revenue: 6200000, transactions: 325 },
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="w-4 h-4 text-red-500" />;
      case 'earning':
        return <DollarSign className="w-4 h-4 text-gold-500" />;
      default:
        return <CreditCard className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      completed: { color: 'green', text: language === 'fa' ? 'تکمیل شده' : 'Completed' },
      pending: { color: 'yellow', text: language === 'fa' ? 'در انتظار' : 'Pending' },
      failed: { color: 'red', text: language === 'fa' ? 'ناموفق' : 'Failed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-400`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {language === 'fa' ? 'مدیریت کیف پول' : 'Wallet Management'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'fa' 
              ? 'مدیریت تراکنش‌ها، درآمدها و برداشت‌های پلتفرم'
              : 'Manage transactions, earnings, and platform withdrawals'
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>{language === 'fa' ? 'گزارش' : 'Export'}</span>
          </button>
          <button className="bg-vitimo-500 hover:bg-vitimo-600 text-white px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'fa' ? 'بروزرسانی' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-500 rounded-xl">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                {language === 'fa' ? 'موجودی کل' : 'Total Balance'}
              </p>
              <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                {formatCurrency(balance)} ریال
              </p>
              <p className="text-green-500 dark:text-green-400 text-xs">+12% این ماه</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-blue-500 rounded-xl">
              <ArrowDownLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                {language === 'fa' ? 'کل واریزی‌ها' : 'Total Deposits'}
              </p>
              <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                {formatCurrency(totalDeposits)} ریال
              </p>
              <p className="text-blue-500 dark:text-blue-400 text-xs">+8% این هفته</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500 rounded-xl">
              <ArrowUpRight className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                {language === 'fa' ? 'کل برداشت‌ها' : 'Total Withdrawals'}
              </p>
              <p className="text-3xl font-bold text-red-700 dark:text-red-300">
                {formatCurrency(totalWithdrawals)} ریال
              </p>
              <p className="text-red-500 dark:text-red-400 text-xs">{pendingWithdrawals} در انتظار</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold-50 to-gold-100 dark:from-gold-900/20 dark:to-gold-800/20 rounded-xl p-6 border border-gold-200 dark:border-gold-800">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gold-500 rounded-xl">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-gold-600 dark:text-gold-400 text-sm font-medium">
                {language === 'fa' ? 'کل درآمدها' : 'Total Earnings'}
              </p>
              <p className="text-3xl font-bold text-gold-700 dark:text-gold-300">
                {formatCurrency(totalEarnings)} ریال
              </p>
              <p className="text-gold-500 dark:text-gold-400 text-xs">+25% این ماه</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Withdrawals Alert */}
      {pendingWithdrawals > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            <div>
              <h3 className="font-bold text-yellow-800 dark:text-yellow-400">
                {language === 'fa' ? 'برداشت‌های در انتظار' : 'Pending Withdrawals'}
              </h3>
              <p className="text-yellow-700 dark:text-yellow-300">
                {language === 'fa' 
                  ? `${pendingWithdrawals} درخواست برداشت در انتظار بررسی است`
                  : `${pendingWithdrawals} withdrawal requests are pending review`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {language === 'fa' ? 'تاریخچه تراکنش‌ها' : 'Transaction History'}
            </h2>
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'fa' ? 'جستجو...' : 'Search...'}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vitimo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-vitimo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{language === 'fa' ? 'همه تراکنش‌ها' : 'All Transactions'}</option>
                <option value="deposit">{language === 'fa' ? 'واریزی‌ها' : 'Deposits'}</option>
                <option value="withdrawal">{language === 'fa' ? 'برداشت‌ها' : 'Withdrawals'}</option>
                <option value="earning">{language === 'fa' ? 'درآمدها' : 'Earnings'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'نوع' : 'Type'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'کاربر' : 'User'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'مبلغ' : 'Amount'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'توضیحات' : 'Description'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'وضعیت' : 'Status'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'تاریخ' : 'Date'}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {language === 'fa' ? 'عملیات' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.slice(0, 20).map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.type)}
                      <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {language === 'fa' ? (
                          transaction.type === 'deposit' ? 'واریز' :
                          transaction.type === 'withdrawal' ? 'برداشت' :
                          transaction.type === 'earning' ? 'درآمد' : transaction.type
                        ) : transaction.type}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-medium">
                      {transaction.user}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-bold ${
                      transaction.type === 'deposit' || transaction.type === 'earning' 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}
                      {formatCurrency(transaction.amount)} ریال
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {transaction.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {new Date(transaction.date).toLocaleDateString('fa-IR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        {language === 'fa' ? 'جزئیات' : 'Details'}
                      </button>
                      {transaction.status === 'pending' && (
                        <button className="text-green-600 hover:text-green-800 transition-colors">
                          {language === 'fa' ? 'تایید' : 'Approve'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'fa' ? 'درآمد ماهانه' : 'Monthly Revenue'}
          </h3>
          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{month.month}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {month.transactions} تراکنش
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">
                    {formatCurrency(month.revenue)} ریال
                  </p>
                  <p className="text-xs text-gray-500">
                    {index > 0 ? (
                      <span className={`flex items-center ${
                        month.revenue > monthlyRevenue[index - 1].revenue 
                          ? 'text-green-500' 
                          : 'text-red-500'
                      }`}>
                        {month.revenue > monthlyRevenue[index - 1].revenue ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(((month.revenue - monthlyRevenue[index - 1].revenue) / monthlyRevenue[index - 1].revenue) * 100).toFixed(1)}%
                      </span>
                    ) : null}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'fa' ? 'درخواست‌های برداشت' : 'Withdrawal Requests'}
          </h3>
          <div className="space-y-4">
            {transactions
              .filter(t => t.type === 'withdrawal' && t.status === 'pending')
              .slice(0, 5)
              .map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{withdrawal.user}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatCurrency(withdrawal.amount)} ریال
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(withdrawal.date).toLocaleDateString('fa-IR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>{language === 'fa' ? 'تایید' : 'Approve'}</span>
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors">
                      {language === 'fa' ? 'رد' : 'Reject'}
                    </button>
                  </div>
                </div>
              ))}
            
            {transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">
                  {language === 'fa' ? 'همه درخواست‌ها پردازش شده‌اند' : 'All requests have been processed'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          {language === 'fa' ? 'خلاصه مالی' : 'Financial Summary'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-vitimo-50 to-vitimo-100 dark:from-vitimo-900/20 dark:to-vitimo-800/20 rounded-xl">
            <DollarSign className="w-12 h-12 text-vitimo-600 mx-auto mb-3" />
            <h4 className="font-bold text-vitimo-700 dark:text-vitimo-300 text-lg">
              {language === 'fa' ? 'درآمد امروز' : "Today's Revenue"}
            </h4>
            <p className="text-2xl font-bold text-vitimo-800 dark:text-vitimo-200">
              {formatCurrency(125000)} ریال
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h4 className="font-bold text-green-700 dark:text-green-300 text-lg">
              {language === 'fa' ? 'رشد ماهانه' : 'Monthly Growth'}
            </h4>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">+18.5%</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
            <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h4 className="font-bold text-blue-700 dark:text-blue-300 text-lg">
              {language === 'fa' ? 'کاربران فعال' : 'Active Users'}
            </h4>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">1,247</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWallet;