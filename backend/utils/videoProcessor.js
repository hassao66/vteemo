import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Generate video thumbnail
export const generateThumbnail = (videoPath, outputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshots({
        timestamps: ['10%'],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720'
      })
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
};

// Get video duration
export const getVideoDuration = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const duration = metadata.format.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        resolve(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    });
  });
};

// Convert video to different qualities
export const convertVideo = (inputPath, outputPath, quality) => {
  return new Promise((resolve, reject) => {
    const qualitySettings = {
      '240p': { width: 426, height: 240, bitrate: '400k' },
      '360p': { width: 640, height: 360, bitrate: '800k' },
      '480p': { width: 854, height: 480, bitrate: '1200k' },
      '720p': { width: 1280, height: 720, bitrate: '2500k' },
      '1080p': { width: 1920, height: 1080, bitrate: '5000k' }
    };

    const settings = qualitySettings[quality];
    if (!settings) {
      reject(new Error('کیفیت نامعتبر است'));
      return;
    }

    ffmpeg(inputPath)
      .output(outputPath)
      .videoCodec('libx264')
      .audioCodec('aac')
      .size(`${settings.width}x${settings.height}`)
      .videoBitrate(settings.bitrate)
      .audioBitrate('128k')
      .format('mp4')
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .on('progress', (progress) => {
        console.log(`Processing ${quality}: ${Math.round(progress.percent)}% done`);
      })
      .run();
  });
};

// Extract video metadata
export const getVideoMetadata = (videoPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
        const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
        
        resolve({
          duration: metadata.format.duration,
          size: metadata.format.size,
          bitrate: metadata.format.bit_rate,
          video: videoStream ? {
            codec: videoStream.codec_name,
            width: videoStream.width,
            height: videoStream.height,
            fps: eval(videoStream.r_frame_rate)
          } : null,
          audio: audioStream ? {
            codec: audioStream.codec_name,
            sampleRate: audioStream.sample_rate,
            channels: audioStream.channels
          } : null
        });
      }
    });
  });
};

// Create video preview (short clip)
export const createPreview = (inputPath, outputPath, duration = 30) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .seekInput(10) // Start from 10 seconds
      .duration(duration) // 30 seconds preview
      .videoCodec('libx264')
      .audioCodec('aac')
      .size('640x360')
      .videoBitrate('800k')
      .audioBitrate('128k')
      .format('mp4')
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err) => {
        reject(err);
      })
      .run();
  });
};

// Validate video file
export const validateVideo = async (videoPath) => {
  try {
    const metadata = await getVideoMetadata(videoPath);
    const maxDuration = 3600; // 1 hour
    const maxSize = 100 * 1024 * 1024; // 100MB

    const errors = [];

    if (metadata.duration > maxDuration) {
      errors.push('مدت زمان ویدیو نباید بیش از ۱ ساعت باشد');
    }

    if (metadata.size > maxSize) {
      errors.push('حجم فایل نباید بیش از ۱۰۰ مگابایت باشد');
    }

    if (!metadata.video) {
      errors.push('فایل ویدیو معتبر نیست');
    }

    return {
      isValid: errors.length === 0,
      errors,
      metadata
    };

  } catch (error) {
    return {
      isValid: false,
      errors: ['خطا در پردازش فایل ویدیو'],
      metadata: null
    };
  }
};