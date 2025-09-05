import express from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { body, validationResult, query } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { videos, users } from '../data/mockData.js';

const router = express.Router();

// Configure multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'video') {
      cb(null, 'uploads/videos/');
    } else if (file.fieldname === 'thumbnail') {
      cb(null, 'uploads/thumbnails/');
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'video') {
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('فرمت ویدیو پشتیبانی نمی‌شود'), false);
      }
    } else if (file.fieldname === 'thumbnail') {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('فرمت تصویر پشتیبانی نمی‌شود'), false);
      }
    }
  }
});

// @route   GET /api/videos
// @desc    Get all published videos with pagination and filters
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('شماره صفحه باید عدد مثبت باشد'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('تعداد نتایج باید بین ۱ تا ۵۰ باشد'),
  query('category').optional().isString(),
  query('search').optional().isString(),
  query('sort').optional().isIn(['newest', 'oldest', 'popular', 'trending'])
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'پارامترهای جستجو نامعتبر است',
        errors: errors.array()
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const category = req.query.category;
    const search = req.query.search;
    const sort = req.query.sort || 'newest';

    let filteredVideos = videos.filter(video => video.status === 'published');

    // Apply category filter
    if (category && category !== 'All') {
      filteredVideos = filteredVideos.filter(video => video.category === category);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredVideos = filteredVideos.filter(video =>
        video.title.toLowerCase().includes(searchLower) ||
        video.description.toLowerCase().includes(searchLower) ||
        video.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        video.channel.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sort) {
      case 'newest':
        filteredVideos.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
        break;
      case 'oldest':
        filteredVideos.sort((a, b) => new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime());
        break;
      case 'popular':
        filteredVideos.sort((a, b) => b.views - a.views);
        break;
      case 'trending':
        filteredVideos.sort((a, b) => (b.likes - b.dislikes) - (a.likes - a.dislikes));
        break;
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedVideos = filteredVideos.slice(startIndex, endIndex);

    const totalPages = Math.ceil(filteredVideos.length / limit);

    res.json({
      success: true,
      data: {
        videos: paginatedVideos,
        pagination: {
          currentPage: page,
          totalPages,
          totalVideos: filteredVideos.length,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get videos error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت ویدیوها'
    });
  }
});

// @route   GET /api/videos/:id
// @desc    Get single video by ID
// @access  Public
router.get('/:id', (req, res) => {
  try {
    const video = videos.find(v => v.id === req.params.id);
    
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    // Increment view count
    video.views += 1;

    res.json({
      success: true,
      data: { video }
    });

  } catch (error) {
    console.error('Get video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت ویدیو'
    });
  }
});

// @route   POST /api/videos
// @desc    Upload new video
// @access  Private
router.post('/', authenticateToken, upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), [
  body('title').isLength({ min: 5 }).withMessage('عنوان باید حداقل ۵ کاراکتر باشد'),
  body('description').isLength({ min: 10 }).withMessage('توضیحات باید حداقل ۱۰ کاراکتر باشد'),
  body('category').notEmpty().withMessage('دسته‌بندی الزامی است'),
  body('tags').optional().isString()
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

    const { title, description, category, tags, privacy = 'public' } = req.body;
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Process uploaded files
    const videoFile = req.files?.video?.[0];
    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!videoFile) {
      return res.status(400).json({
        success: false,
        message: 'فایل ویدیو الزامی است'
      });
    }

    // Create new video object
    const newVideo = {
      id: uuidv4(),
      title,
      description,
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      privacy,
      thumbnail: thumbnailFile 
        ? `/uploads/thumbnails/${thumbnailFile.filename}`
        : 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: `/uploads/videos/${videoFile.filename}`,
      duration: '0:00', // در پروژه واقعی با ffmpeg محاسبه کنید
      views: 0,
      likes: 0,
      dislikes: 0,
      uploadDate: new Date().toISOString().split('T')[0],
      channel: {
        id: user.id,
        name: user.username,
        avatar: user.avatar,
        verified: user.verified
      },
      status: 'pending', // نیاز به تأیید ادمین
      isPremium: false,
      hasSubtitles: false,
      quality: ['720p', '1080p'],
      monetized: false,
      earnings: 0
    };

    videos.unshift(newVideo);

    res.status(201).json({
      success: true,
      message: 'ویدیو با موفقیت آپلود شد و در انتظار تأیید است',
      data: { video: newVideo }
    });

  } catch (error) {
    console.error('Upload video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در آپلود ویدیو'
    });
  }
});

// @route   PUT /api/videos/:id
// @desc    Update video
// @access  Private (Owner or Admin)
router.put('/:id', authenticateToken, [
  body('title').optional().isLength({ min: 5 }).withMessage('عنوان باید حداقل ۵ کاراکتر باشد'),
  body('description').optional().isLength({ min: 10 }).withMessage('توضیحات باید حداقل ۱۰ کاراکتر باشد'),
  body('category').optional().notEmpty().withMessage('دسته‌بندی نمی‌تواند خالی باشد')
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

    const videoIndex = videos.findIndex(v => v.id === req.params.id);
    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    const video = videos[videoIndex];
    const user = users.find(u => u.id === req.userId);

    // Check ownership or admin access
    if (video.channel.id !== req.userId && !user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'شما مجاز به ویرایش این ویدیو نیستید'
      });
    }

    // Update video
    const updatedVideo = {
      ...video,
      ...req.body,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : video.tags,
      updatedAt: new Date().toISOString()
    };

    videos[videoIndex] = updatedVideo;

    res.json({
      success: true,
      message: 'ویدیو با موفقیت به‌روزرسانی شد',
      data: { video: updatedVideo }
    });

  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در به‌روزرسانی ویدیو'
    });
  }
});

// @route   DELETE /api/videos/:id
// @desc    Delete video
// @access  Private (Owner or Admin)
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const videoIndex = videos.findIndex(v => v.id === req.params.id);
    if (videoIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    const video = videos[videoIndex];
    const user = users.find(u => u.id === req.userId);

    // Check ownership or admin access
    if (video.channel.id !== req.userId && !user?.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'شما مجاز به حذف این ویدیو نیستید'
      });
    }

    videos.splice(videoIndex, 1);

    res.json({
      success: true,
      message: 'ویدیو با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در حذف ویدیو'
    });
  }
});

// @route   POST /api/videos/:id/like
// @desc    Like/Unlike video
// @access  Private
router.post('/:id/like', authenticateToken, (req, res) => {
  try {
    const video = videos.find(v => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    // در پروژه واقعی، likes را در جدول جداگانه ذخیره کنید
    video.likes += 1;

    res.json({
      success: true,
      message: 'ویدیو پسندیده شد',
      data: {
        likes: video.likes,
        dislikes: video.dislikes
      }
    });

  } catch (error) {
    console.error('Like video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور'
    });
  }
});

// @route   POST /api/videos/:id/dislike
// @desc    Dislike video
// @access  Private
router.post('/:id/dislike', authenticateToken, (req, res) => {
  try {
    const video = videos.find(v => v.id === req.params.id);
    if (!video) {
      return res.status(404).json({
        success: false,
        message: 'ویدیو یافت نشد'
      });
    }

    video.dislikes += 1;

    res.json({
      success: true,
      message: 'نظر شما ثبت شد',
      data: {
        likes: video.likes,
        dislikes: video.dislikes
      }
    });

  } catch (error) {
    console.error('Dislike video error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور'
    });
  }
});

// @route   GET /api/videos/trending
// @desc    Get trending videos
// @access  Public
router.get('/trending', (req, res) => {
  try {
    const trendingVideos = videos
      .filter(v => v.status === 'published')
      .sort((a, b) => {
        // Algorithm for trending: views + likes - dislikes + recent upload bonus
        const scoreA = a.views + (a.likes * 10) - (a.dislikes * 5) + 
          (new Date().getTime() - new Date(a.uploadDate).getTime() < 7 * 24 * 60 * 60 * 1000 ? 1000 : 0);
        const scoreB = b.views + (b.likes * 10) - (b.dislikes * 5) + 
          (new Date().getTime() - new Date(b.uploadDate).getTime() < 7 * 24 * 60 * 60 * 1000 ? 1000 : 0);
        return scoreB - scoreA;
      })
      .slice(0, 20);

    res.json({
      success: true,
      data: { videos: trendingVideos }
    });

  } catch (error) {
    console.error('Get trending videos error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت ویدیوهای ترند'
    });
  }
});

// @route   GET /api/videos/categories
// @desc    Get all video categories
// @access  Public
router.get('/categories', (req, res) => {
  try {
    const categories = [...new Set(videos.map(v => v.category))];
    
    const categoriesWithCount = categories.map(category => ({
      name: category,
      count: videos.filter(v => v.category === category && v.status === 'published').length
    }));

    res.json({
      success: true,
      data: { categories: categoriesWithCount }
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت دسته‌بندی‌ها'
    });
  }
});

export default router;