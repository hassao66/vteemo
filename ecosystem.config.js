module.exports = {
  apps: [{
    name: 'videotube',
    script: 'serve',
    args: '-s dist -l 3000',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/videotube/logs/err.log',
    out_file: '/home/videotube/logs/out.log',
    log_file: '/home/videotube/logs/combined.log',
    time: true
  }]
}