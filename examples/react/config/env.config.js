module.exports = {
  isDev: process.env.NODE_ENV
    ? process.env.NODE_ENV.toLowerCase() === 'development'
    : 'unknown',
};
