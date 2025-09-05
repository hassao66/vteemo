import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { users, transactions } from '../data/mockData.js';

const router = express.Router();

// @route   GET /api/wallet/balance
// @desc    Get user wallet balance
// @access  Private
router.get('/balance', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.balance || 0,
        currency: 'IRR'
      }
    });

  } catch (error) {
    console.error('Get balance error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت موجودی'
    });
  }
});

// @route   GET /api/wallet/transactions
// @desc    Get user transaction history
// @access  Private
router.get('/transactions', authenticateToken, (req, res) => {
  try {
    const userTransactions = transactions.filter(t => t.userId === req.userId);
    
    res.json({
      success: true,
      data: { transactions: userTransactions }
    });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت تاریخچه تراکنش‌ها'
    });
  }
});

// @route   POST /api/wallet/deposit
// @desc    Deposit money to wallet
// @access  Private
router.post('/deposit', authenticateToken, [
  body('amount').isInt({ min: 10000 }).withMessage('حداقل مبلغ واریز ۱۰,۰۰۰ ریال است'),
  body('paymentMethod').isIn(['card', 'bank']).withMessage('روش پرداخت نامعتبر است')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات وارد شده نامعتبر است',
        errors: errors.array()
      });
    }

    const { amount, paymentMethod } = req.body;
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Create transaction record
    const newTransaction = {
      id: Date.now().toString(),
      userId: req.userId,
      type: 'deposit',
      amount,
      description: `واریز ${paymentMethod === 'card' ? 'از کارت بانکی' : 'انتقال بانکی'}`,
      status: 'pending',
      paymentMethod,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);

    // Simulate payment processing
    setTimeout(() => {
      // Update transaction status
      const transactionIndex = transactions.findIndex(t => t.id === newTransaction.id);
      if (transactionIndex !== -1) {
        transactions[transactionIndex].status = 'completed';
        
        // Update user balance
        users[userIndex].balance = (users[userIndex].balance || 0) + amount;
      }
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'درخواست واریز ثبت شد و در حال پردازش است',
      data: {
        transaction: newTransaction,
        estimatedTime: '۲-۵ دقیقه'
      }
    });

  } catch (error) {
    console.error('Deposit error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در واریز'
    });
  }
});

// @route   POST /api/wallet/withdraw
// @desc    Withdraw money from wallet
// @access  Private
router.post('/withdraw', authenticateToken, [
  body('amount').isInt({ min: 50000 }).withMessage('حداقل مبلغ برداشت ۵۰,۰۰۰ ریال است'),
  body('bankAccount').isLength({ min: 16, max: 16 }).withMessage('شماره حساب باید ۱۶ رقم باشد')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات وارد شده نامعتبر است',
        errors: errors.array()
      });
    }

    const { amount, bankAccount } = req.body;
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    const user = users[userIndex];

    // Check sufficient balance
    if ((user.balance || 0) < amount) {
      return res.status(400).json({
        success: false,
        message: 'موجودی کافی نیست'
      });
    }

    // Create transaction record
    const newTransaction = {
      id: Date.now().toString(),
      userId: req.userId,
      type: 'withdraw',
      amount,
      description: `برداشت به حساب ${bankAccount.slice(-4).padStart(16, '*')}`,
      status: 'pending',
      bankAccount,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);

    // Deduct amount from balance immediately
    users[userIndex].balance = (users[userIndex].balance || 0) - amount;

    res.status(201).json({
      success: true,
      message: 'درخواست برداشت ثبت شد و در حال بررسی است',
      data: {
        transaction: newTransaction,
        estimatedTime: '۲۴-۴۸ ساعت',
        newBalance: users[userIndex].balance
      }
    });

  } catch (error) {
    console.error('Withdraw error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در برداشت'
    });
  }
});

// @route   POST /api/wallet/earnings
// @desc    Add earnings from video views
// @access  Private (Internal use)
router.post('/earnings', authenticateToken, [
  body('videoId').notEmpty().withMessage('شناسه ویدیو الزامی است'),
  body('amount').isInt({ min: 1 }).withMessage('مبلغ باید عدد مثبت باشد'),
  body('source').isIn(['views', 'ads', 'premium']).withMessage('منبع درآمد نامعتبر است')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات وارد شده نامعتبر است',
        errors: errors.array()
      });
    }

    const { videoId, amount, source } = req.body;
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Create earning transaction
    const newTransaction = {
      id: Date.now().toString(),
      userId: req.userId,
      type: 'earning',
      amount,
      description: `درآمد از ${source === 'views' ? 'بازدید' : source === 'ads' ? 'تبلیغات' : 'پریمیوم'} ویدیو`,
      status: 'completed',
      videoId,
      source,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);

    // Update user balance
    users[userIndex].balance = (users[userIndex].balance || 0) + amount;

    res.status(201).json({
      success: true,
      message: 'درآمد به کیف پول اضافه شد',
      data: {
        transaction: newTransaction,
        newBalance: users[userIndex].balance
      }
    });

  } catch (error) {
    console.error('Add earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در اضافه کردن درآمد'
    });
  }
});

// @route   GET /api/wallet/stats
// @desc    Get wallet statistics
// @access  Private
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const userTransactions = transactions.filter(t => t.userId === req.userId);
    
    const stats = {
      totalEarnings: userTransactions
        .filter(t => t.type === 'earning' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      totalDeposits: userTransactions
        .filter(t => t.type === 'deposit' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      totalWithdrawals: userTransactions
        .filter(t => t.type === 'withdraw' && t.status === 'completed')
        .reduce((sum, t) => sum + t.amount, 0),
      pendingWithdrawals: userTransactions
        .filter(t => t.type === 'withdraw' && t.status === 'pending')
        .reduce((sum, t) => sum + t.amount, 0),
      thisMonthEarnings: userTransactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          const now = new Date();
          return t.type === 'earning' && 
                 t.status === 'completed' &&
                 transactionDate.getMonth() === now.getMonth() &&
                 transactionDate.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0)
    };

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get wallet stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت آمار کیف پول'
    });
  }
});

export default router;