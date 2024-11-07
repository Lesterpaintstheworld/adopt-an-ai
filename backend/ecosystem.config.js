module.exports = {
  apps: [{
    name: 'raise-an-ai-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      ENABLE_LOGGING: 'true',
      CLUSTER_MODE: 'true',
      LOG_LEVEL: 'info'
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001,
      ENABLE_LOGGING: 'true',
      CLUSTER_MODE: 'false',
      LOG_LEVEL: 'debug'
    },
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    error_file: 'logs/err.log',
    out_file: 'logs/out.log',
    log_file: 'logs/combined.log',
    merge_logs: true,
    time: true,
    log_type: 'json',
    max_restarts: 10,
    restart_delay: 4000,
    wait_ready: true,
    kill_timeout: 3000,
    listen_timeout: 8000,
    status_endpoint: '/health',
    node_args: '--max-old-space-size=2048'
  }]
};
