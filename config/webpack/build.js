'use strict';

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const customProperties = require('postcss-custom-properties');
const simpleVars = require('postcss-simple-vars');
const nested = require('postcss-nested');
const mixins = require('postcss-mixins');
const cssImport = require('postcss-import');
const customMedia = require('postcss-custom-media');
const autoprefixer = require('autoprefixer');
const reporter = require('postcss-reporter');
const assets = require('postcss-assets');

const buildUtils = require('./buildUtils');

const dirname = path.resolve(__dirname, '../..');
const reactPath = 'node_modules/react/dist/react.min.js';

module.exports = function(env) {
    const config = {
        // точка входа в приложение
        entry: env.server ? './applications/server' : './applications/client',

        output: {
            // куда выкладывать сгенерированные конфиги
            path: buildUtils.getPath(env),
            // как файлы должны быть видны клиенту
            publicPath: buildUtils.getPublicPath(env),
            libraryTarget: env.server ? 'commonjs2' : 'var',
            // как формировать имя собранного файла
            filename: buildUtils.getFilename(env)
        },
        resolve: {
            extensions: ['', '.js', '.jsx', '.css'],
            alias: buildUtils.getAliases(env)
        },
        module: {
            loaders: [
                {
                    test: /\.json$/,
                    loader: 'json-loader'
                },
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    loader: 'babel',
                    query: buildUtils.getBabelLoaderQuery(env)
                },
                {
                    test: /\.css$/,
                    loader: env.server ? 'null' : ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader')
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    loader: 'file-loader'
                },
                {
                    test: /\.svg$/,
                    loader: 'babel!svg-react'
                }
            ],
            noParse: [
                path.resolve(dirname, reactPath)
            ]
        },

        postcss: function() {
            return [
                mixins(),
                simpleVars(),
                assets(),
                cssImport(),
                customProperties(),
                customMedia(),
                nested,
                autoprefixer({ browsers: ['last 2 versions'] }),
                reporter({clearMessages: true, throwError: true})
            ];
        },

        // набор плагинов для сборки
        plugins: buildUtils.getPlugins(env),
        // штуки, которые используются, но в основную сборку не включаются
        externals: buildUtils.getExternals(env),
        target: env.server ? 'node' : 'web',

        // рассказываем webpack какие у нас есть "стандартные" библиотеки
        node: env.server && {
            __dirname: true,
            __filename: true,
            console: true,
            fs: 'empty',
            net: 'empty',
            tls: 'empty'
        },

        // конфиг для webpack-dev-server
        devtool: !env.build && 'inline-source-map',
        watch: !env.build,
        devServer: !env.build && {
            contentBase: path.resolve(__dirname, 'build'),
            hot: true,
            inline: true,
            stats: 'errors-only'
        }
    };

    return config;
};
