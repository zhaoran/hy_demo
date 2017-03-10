var path = require('path');
var projectRoot = process.cwd();
var webpackConfig = require('./webpack.base.config.js');

var webpack = require('webpack');
var extend = require('util')._extend;

webpackConfig.plugins && webpackConfig.plugins.unshift(
    new webpack.DefinePlugin({
        ENV: JSON.stringify('rd')
    })
);

webpackConfig.watch = true;

extend(webpackConfig.output, {
    filename: '[name].js',
    chunkFilename: '[name].js'
});

module.exports = webpackConfig;
