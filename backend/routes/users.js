import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { users, videos } from '../data/mockData.js';

const router = express.Router();

// @route   GET /api/users/:id
// @desc    Get user profile
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Get user's videos
    const userVideos = videos.filter(v => v.channel.id === user.id && v.status === 'published');
    const totalViews = userVideos.reduce((sum, video) => sum + video.views, 0);

    // Remove sensitive information
    const { password, ...userProfile } = user;

    res.json({
      success: true,
      data: {
        user: {
          ...userProfile,
          totalViews,
          totalVideos: userVideos.length
        },
        videos: userVideos
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت پروفایل کاربر'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, [
  body('username').optional().isLength({ min: 3 }).withMessage('نام کاربری باید حداقل ۳ کاراکتر باشد'),
  body('email').optional().isEmail().withMessage('ایمیل معتبر وارد کنید'),
  body('bio').optional().isLength({ max: 500 }).withMessage('بیوگرافی نباید بیش از ۵۰۰ کاراکتر باشد')
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

    const userIndex = users.findIndex(u => u.id === req.userId);
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Check if username or email already exists (if being updated)
    if (req.body.username || req.body.email) {
      const existingUser = users.find(u => 
        u.id !== req.userId && 
        (u.username === req.body.username || u.email === req.body.email)
      );
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'نام کاربری یا ایمیل قبلاً استفاده شده است'
        });
      }
    }

    // Update user
    const updatedUser = {
      ...users[userIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    users[userIndex] = updatedUser;

    // Remove password from response
    const { password, ...userResponse } = updatedUser;

    res.json({
      success: true,
      message: 'پروفایل با موفقیت به‌روزرسانی شد',
      data: { user: userResponse }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی پروفایل'
    });
  }
});

// @route   POST /api/users/:id/subscribe
// @desc    Subscribe/Unsubscribe to user
// @access  Private
router.post('/:id/subscribe', authenticateToken, (req, res) => {
  try {
    const targetUser = users.find(u => u.id === req.params.id);
    const currentUser = users.find(u => u.id === req.userId);

    if (!targetUser || !currentUser) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    if (targetUser.id === currentUser.id) {
      return res.status(400).json({
        success: false,
        message: 'نمی‌توانید خودتان را دنبال کنید'
      });
    }

    // در پروژه واقعی، subscriptions را در جدول جداگانه ذخیره کنید
    const isSubscribed = currentUser.subscriptions?.includes(targetUser.id);

    if (isSubscribed) {
      // Unsubscribe
      currentUser.subscriptions = currentUser.subscriptions.filter(id => id !== targetUser.id);
      targetUser.subscribers = Math.max(0, targetUser.subscribers - 1);
    } else {
      // Subscribe
      currentUser.subscriptions = currentUser.subscriptions || [];
      currentUser.subscriptions.push(targetUser.id);
      targetUser.subscribers += 1;
    }

    res.json({
      success: true,
      message: isSubscribed ? 'اشتراک لغو شد' : 'با موفقیت مشترک شدید',
      data: {
        isSubscribed: !isSubscribed,
        subscriberCount: targetUser.subscribers
      }
    });

  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور'
    });
  }
});

// @route   GET /api/users/:id/videos
// @desc    Get user's videos
// @access  Public
router.get('/:id/videos', (req, res) => {
  try {
    const user = users.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    const userVideos = videos.filter(v => 
      v.channel.id === user.id && 
      v.status === 'published'
    );

    res.json({
      success: true,
      data: { videos: userVideos }
    });

  } catch (error) {
    console.error('Get user videos error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت ویدیوهای کاربر'
    });
  }
});

// @route   POST /api/users/change-password
// @desc    Change user password
// @access  Private
router.post('/change-password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('رمز عبور فعلی الزامی است'),
  body('newPassword').isLength({ min: 6 }).withMessage('رمز عبور جدید باید حداقل ۶ کاراکتر باشد')
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

    const { currentPassword, newPassword } = req.body;
    const userIndex = users.findIndex(u => u.id === req.userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    const user = users[userIndex];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور فعلی اشتباه است'
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    users[userIndex].password = hashedNewPassword;
    users[userIndex].updatedAt = new Date().toISOString();

    res.json({
      success: true,
      message: 'رمز عبور با موفقیت تغییر کرد'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در تغییر رمز عبور'
    });
  }
});

export default router;