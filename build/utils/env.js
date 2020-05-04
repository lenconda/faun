module.exports.isDev = () => process.env.NODE_ENV === 'development';
module.exports.isProduction = () => process.env.NODE_ENV === 'production';
