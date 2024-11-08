const config = require('./index');

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || config.cors.origins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'), false);
    }
  },
  credentials: config.cors.credentials,
  allowedHeaders: config.cors.allowedHeaders,
  methods: config.cors.methods,
  maxAge: config.cors.maxAge
};

module.exports = corsOptions;
