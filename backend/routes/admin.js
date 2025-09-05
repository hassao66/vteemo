import express from 'express';
import { body, validationResult } from 'express-validator';
import { users, videos, liveStreams, transactions } from '../data/mockData.js';

const router = express.Router();

// Middleware to check admin access
const requireAdmin = (req, res, next) => {
  const user = users.find(u => u.id === req.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'دسترسی مدیریت مورد نیاز است'
    });
  }
  next();
};

// Apply admin middleware to all routes
router.use(requireAdmin);

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard', (req, res) => {
  try {
    const totalUsers = users.length;
    const totalVideos = videos.length;
    const publishedVideos = videos.filter(v => v.status === 'published').length;
    const pendingVideos = videos.filter(v => v.status === 'pending').length;
    const totalViews = videos.reduce((sum, video) => sum + video.views, 0);
    const totalEarnings = videos.reduce((sum, video) => sum + (video.earnings || 0), 0);
    const activeLiveStreams = liveStreams.filter(s => s.isLive).length;
    const totalRevenue = transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    // Monthly data for charts
    const monthlyData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleDateString('fa-IR', { month: 'long' });
      
      monthlyData.push({
        month: monthName,
        users: Math.floor(totalUsers * (0.7 + i * 0.05)),
        videos: Math.floor(publishedVideos * (0.6 + i * 0.07)),
        views: Math.floor(totalViews * (0.5 + i * 0.08)),
        revenue: Math.floor(totalRevenue * (0.4 + i * 0.1))
      });
    }

    const stats = {
      overview: {
        totalUsers,
        totalVideos,
        publishedVideos,
        pendingVideos,
        totalViews,
        totalEarnings,
        activeLiveStreams,
        totalRevenue
      },
      growth: {
        usersGrowth: '+12%',
        videosGrowth: '+8%',
        viewsGrowth: '+15%',
        revenueGrowth: '+25%'
      },
      monthlyData,
      recentActivity: [
        {
          type: 'video_upload',
          message: 'ویدیو جدید آپلود شد',
          user: 'آکادمی کدنویسی',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'user_register',
          message: 'کاربر جدید ثبت نام کرد',
          user: 'محمد رضایی',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'premium_purchase',
          message: 'اشتراک پریمیوم خریداری شد',
          user: 'سارا احمدی',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت آمار داشبورد'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with admin info
// @access  Private (Admin only)
router.get('/users', (req, res) => {
  try {
    const usersWithStats = users.map(user => {
      const userVideos = videos.filter(v => v.channel.id === user.id);
      const userTransactions = transactions.filter(t => t.userId === user.id);
      
      const { password, ...userInfo } = user;
      
      return {
        ...userInfo,
        videosCount: userVideos.length,
        totalViews: userVideos.reduce((sum, v) => sum + v.views, 0),
        totalEarnings: userTransactions
          .filter(t => t.type === 'earning' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        lastActivity: userVideos.length > 0 
          ? userVideos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())[0].uploadDate
          : user.createdAt
      };
    });

    res.json({
      success: true,
      data: { users: usersWithStats }
    });

  } catch (error) {
    console.error('Get admin users error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت لیست کاربران'
    });
  }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Update user status (ban, suspend, activate)
// @access  Private (Admin only)
router.put('/users/:id/status', [
  body('status').isIn(['active', 'suspended', 'banned']).withMessage('وضعیت نامعتبر است'),
  body('reason').optional().isString()
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

    const { status, reason } = req.body;
    const userIndex = users.findIndex(u => u.id === req.params.id);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Update user status
    users[userIndex] = {
      ...users[userIndex],
      status,
      statusReason: reason,
      statusUpdatedAt: new Date().toISOString(),
      statusUpdatedBy: req.userId
    };

    const statusMessages = {
      active: 'کاربر فعال شد',
      suspended: 'کاربر تعلیق شد',
      banned: 'کاربر مسدود شد'
    };

    res.json({
      success: true,
      message: statusMessages[status],
      data: { user: users[userIndex] }
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی وضعیت کاربر'
    });
  }
});

// @route   PUT /api/admin/videos/:id/status
// @desc    Update video status (approve, reject)
// @access  Private (Admin only)
router.put('/videos/:id/status', [
  body('status').isIn(['published', 'rejected']).withMessage('وضعیت نامعتبر است'),
  body('reason').optional().isString()
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

    const { status, reason } = req.body;
    const videoIndex = videos.findIndex(v => v.id === req.params.id);
    
    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    // Update video status
    videos[videoIndex] = {
      ...videos[videoIndex],
      status,
      reviewReason: reason,
      reviewedAt: new Date().toISOString(),
      reviewedBy: req.userId
    };

    const statusMessages = {
      published: 'ویدیو تأیید و منتشر شد',
      rejected: 'ویدیو رد شد'
    };

    res.json({
      success: true,
      message: statusMessages[status],
      data: { video: videos[videoIndex] }
    });

  } catch (error) {
    console.error('Update video status error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی وضعیت ویدیو'
    });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get detailed analytics
// @access  Private (Admin only)
router.get('/analytics', (req, res) => {
  try {
    // Calculate various analytics
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const analytics = {
      userAnalytics: {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status !== 'banned').length,
        newUsersLast30Days: users.filter(u => new Date(u.createdAt) > last30Days).length,
        premiumUsers: users.filter(u => u.isPremium).length
      },
      videoAnalytics: {
        totalVideos: videos.length,
        publishedVideos: videos.filter(v => v.status === 'published').length,
        pendingVideos: videos.filter(v => v.status === 'pending').length,
        totalViews: videos.reduce((sum, v) => sum + v.views, 0),
        averageViews: Math.floor(videos.reduce((sum, v) => sum + v.views, 0) / videos.length)
      },
      revenueAnalytics: {
        totalRevenue: transactions
          .filter(t => t.status === 'completed')
          .reduce((sum, t) => sum + (t.type === 'deposit' ? t.amount : 0), 0),
        totalPayouts: transactions
          .filter(t => t.type === 'withdraw' && t.status === 'completed')
          .reduce((sum, t) => sum + t.amount, 0),
        pendingPayouts: transactions
          .filter(t => t.type === 'withdraw' && t.status === 'pending')
          .reduce((sum, t) => sum + t.amount, 0)
      },
      liveAnalytics: {
        totalStreams: liveStreams.length,
        activeStreams: liveStreams.filter(s => s.isLive).length,
        totalViewers: liveStreams.reduce((sum, s) => sum + s.viewers, 0)
      }
    };

    res.json({
      success: true,
      data: analytics
    });

  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت آمار'
    });
  }
});

export default router;