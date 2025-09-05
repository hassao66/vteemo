import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken } from '../middleware/auth.js';
import { liveStreams, users } from '../data/mockData.js';

const router = express.Router();

// @route   GET /api/live/streams
// @desc    Get all active live streams
// @access  Public
router.get('/streams', (req, res) => {
  try {
    const activeStreams = liveStreams.filter(stream => stream.isLive);
    
    res.json({
      success: true,
      data: { streams: activeStreams }
    });

  } catch (error) {
    console.error('Get live streams error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت پخش‌های زنده'
    });
  }
});

// @route   GET /api/live/streams/:id
// @desc    Get single live stream
// @access  Public
router.get('/streams/:id', (req, res) => {
  try {
    const stream = liveStreams.find(s => s.id === req.params.id);
    
    if (!stream) {
      return res.status(404).json({
        success: false,
        message: 'پخش زنده یافت نشد'
      });
    }

    // Increment viewer count
    if (stream.isLive) {
      stream.viewers += 1;
    }

    res.json({
      success: true,
      data: { stream }
    });

  } catch (error) {
    console.error('Get live stream error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت پخش زنده'
    });
  }
});

// @route   POST /api/live/streams
// @desc    Create new live stream
// @access  Private
router.post('/streams', authenticateToken, [
  body('title').isLength({ min: 5 }).withMessage('عنوان باید حداقل ۵ کاراکتر باشد'),
  body('description').optional().isLength({ max: 1000 }).withMessage('توضیحات نباید بیش از ۱۰۰۰ کاراکتر باشد'),
  body('category').notEmpty().withMessage('دسته‌بندی الزامی است'),
  body('tags').optional().isString()
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

    const { title, description, category, tags } = req.body;
    const user = users.find(u => u.id === req.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Check if user already has an active stream
    const existingStream = liveStreams.find(s => s.streamer.id === req.userId && s.isLive);
    if (existingStream) {
      return res.status(400).json({
        success: false,
        message: 'شما در حال حاضر یک پخش زنده فعال دارید'
      });
    }

    // Create new live stream
    const newStream = {
      id: Date.now().toString(),
      title,
      description: description || '',
      category,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=800',
      streamer: {
        id: user.id,
        name: user.username,
        avatar: user.avatar,
        verified: user.verified
      },
      viewers: 0,
      isLive: true,
      startTime: new Date().toISOString(),
      streamKey: `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      rtmpUrl: `rtmp://localhost:1935/live`,
      chatMessages: [],
      duration: 0,
      revenue: 0
    };

    liveStreams.push(newStream);

    res.status(201).json({
      success: true,
      message: 'پخش زنده با موفقیت ایجاد شد',
      data: { stream: newStream }
    });

  } catch (error) {
    console.error('Create live stream error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در ایجاد پخش زنده'
    });
  }
});

// @route   PUT /api/live/streams/:id/end
// @desc    End live stream
// @access  Private
router.put('/streams/:id/end', authenticateToken, (req, res) => {
  try {
    const streamIndex = liveStreams.findIndex(s => s.id === req.params.id);
    
    if (streamIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'پخش زنده یافت نشد'
      });
    }

    const stream = liveStreams[streamIndex];

    // Check ownership
    if (stream.streamer.id !== req.userId) {
      return res.status(403).json({
        success: false,
        message: 'شما مجاز به پایان دادن این پخش زنده نیستید'
      });
    }

    // End stream
    liveStreams[streamIndex] = {
      ...stream,
      isLive: false,
      endTime: new Date().toISOString(),
      duration: Math.floor((new Date().getTime() - new Date(stream.startTime).getTime()) / 1000)
    };

    res.json({
      success: true,
      message: 'پخش زنده با موفقیت پایان یافت',
      data: { stream: liveStreams[streamIndex] }
    });

  } catch (error) {
    console.error('End live stream error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در پایان پخش زنده'
    });
  }
});

// @route   POST /api/live/streams/:id/chat
// @desc    Send chat message
// @access  Private
router.post('/streams/:id/chat', authenticateToken, [
  body('message').isLength({ min: 1, max: 500 }).withMessage('پیام باید بین ۱ تا ۵۰۰ کاراکتر باشد')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'پیام نامعتبر است',
        errors: errors.array()
      });
    }

    const { message } = req.body;
    const stream = liveStreams.find(s => s.id === req.params.id);
    const user = users.find(u => u.id === req.userId);

    if (!stream) {
      return res.status(404).json({
        success: false,
        message: 'پخش زنده یافت نشد'
      });
    }

    if (!stream.isLive) {
      return res.status(400).json({
        success: false,
        message: 'این پخش زنده فعال نیست'
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'کاربر یافت نشد'
      });
    }

    // Add chat message
    const chatMessage = {
      id: Date.now().toString(),
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      message,
      timestamp: new Date().toISOString(),
      isStreamer: user.id === stream.streamer.id,
      isModerator: user.isAdmin
    };

    stream.chatMessages = stream.chatMessages || [];
    stream.chatMessages.push(chatMessage);

    // Keep only last 100 messages
    if (stream.chatMessages.length > 100) {
      stream.chatMessages = stream.chatMessages.slice(-100);
    }

    res.status(201).json({
      success: true,
      message: 'پیام ارسال شد',
      data: { message: chatMessage }
    });

  } catch (error) {
    console.error('Send chat message error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در ارسال پیام'
    });
  }
});

// @route   GET /api/live/streams/:id/chat
// @desc    Get chat messages for stream
// @access  Public
router.get('/streams/:id/chat', (req, res) => {
  try {
    const stream = liveStreams.find(s => s.id === req.params.id);
    
    if (!stream) {
      return res.status(404).json({
        success: false,
        message: 'پخش زنده یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { 
        messages: stream.chatMessages || [],
        isLive: stream.isLive
      }
    });

  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({
      success: false,
      message: 'خطای سرور در دریافت پیام‌ها'
    });
  }
});

export default router;