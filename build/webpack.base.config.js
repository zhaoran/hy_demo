var path = require('path');
var projectRoot = process.cwd();

var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var moduleName = 'hy_demo';
var staticName = moduleName + '_static';

module.exports = {
    entry: './public/main/app.js',

    output: {
        path: path.resolve(projectRoot, './output/' + staticName + '/'),
        publicPath: '/' + staticName + '/',
        filename: '[name]_[hash:8].js',
        chunkFilename: '[name]_[hash:8].js'
    },

    plugins: [
        new HtmlWebpackPlugin({
            inject: 'body',
            template: './business/index.html',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            ENV: JSON.stringify('online'),
            MODULE_NAME: JSON.stringify(moduleName)
        })
    ],

    module: {

        rules: [
            {
                test: /\.vue$/i,
                loader: 'vue-loader',
                options: {
                    postcss: [
                        require('autoprefixer')
                    ]
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(jpg|png|gif|svg|mp4|ttf)\??.*$/,
                loaders: [
                    'url-loader?limit=10000&name=[path][name]_[hash:8].[ext]'
                ]
            },
            {
                test: /\.html$/,
                loader: 'raw-loader'
            }
        ]
    },
    resolve: {
        modules: [
            "node_modules",
            path.resolve(projectRoot)
        ],
        extensions: ['.webpack.js', '.web.js', '.js', '.vue'],
        alias: {
            'vue$': 'vue/dist/vue.common.js',
            'components': 'public/components'
        }
    }

};