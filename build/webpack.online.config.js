var webpackConfig = require('./webpack.base.config.js');


webpackConfig.output.publicPath = 'http://js1.rongyi.com/fe/webroot' 
    + webpackConfig.output.publicPath;

module.exports = webpackConfig;