// postcss.config.js
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({
      flexbox: 'no-2009'
    })
  ]
};
