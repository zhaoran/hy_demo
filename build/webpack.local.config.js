var path = require('path');
var projectRoot = process.cwd();
var webpackConfig = require('./webpack.base.config.js');

var webpack = require('webpack');
var extend = require('util')._extend;

webpackConfig.devtool = 'source-map';

webpackConfig.plugins && webpackConfig.plugins.unshift(
    new webpack.DefinePlugin({
        ENV: JSON.stringify('local')
    })
);

extend(webpackConfig.output, {
    path: path.resolve(projectRoot, './output/'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js'
});



webpackConfig.devServer = {
    port: 8881,
    historyApiFallback: true,
    stats: 'errors-only',
    proxy: {
        '^/ffapi/**': {
            target: "http://fe2.rongyi.com:8088",
            changeOrigin: 'true'
        }
    }
};

module.exports = webpackConfig;

