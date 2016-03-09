'use strict';

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');

var dirname = path.resolve(__dirname, '../..');

/**
 * Формирует массив с плагинами
 *
 * @param {Object} env Объект с опциями сборки
 * @return {Array} Массив с плагинами
 */
module.exports.getPlugins = function(env) {
    const plugins = [];

    const extractOptions = {
        disable: env.server || env.test || !env.build
    };

    if (!env.server) {
        plugins.push(
            new ExtractTextPlugin('[name].[hash].css', extractOptions)
        );
    }

    if (!env.server && !env.build) {
        plugins.push(new webpack.HotModuleReplacementPlugin());
        plugins.push(new webpack.NoErrorsPlugin());
    }

    if (env.build && !env.server) {
        plugins.push(
            new webpack.NoErrorsPlugin(),
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.UglifyJsPlugin({
                output: {
                    comments: false
                },
                compress: {
                    warnings: false
                }
            })
        );
    }

    if (!env.server) {
        plugins.push(new StatsPlugin('./../../stats.json'));
    }

    return plugins;
};

/**
 * Формирует output.path
 *
 * @param {object} env Объект с опциями сборки
 * @returns {string} Строка с путем
 */
module.exports.getPath = function(env) {
    return path.resolve(dirname, env.server ? 'build' : 'build/public/assets');
};

/**
 * Формирует output.publicPath
 *
 * @param {object} env Объект с опциями сборки
 * @returns {string} Строка с путем
 */
module.exports.getPublicPath = function(env) {
    return env.build ? '/assets/' : 'http://localhost:8080/assets/';
};

/**
 * Формирует объект с описанием node_modules для externals
 *
 * @return {object} Объект с описанием node_modules для externals
 */
function getNodeModules() {
    var exclusions = ['leaflet'];

    /**
     * Фильтр для исключения из списка модулей .bin и react
     *
     * @param {string} module Название модуля
     * @returns {boolean} Булевый флаг
     */
    function filter(module) {
        return ['.bin'].indexOf(module) == -1;
    }

    /**
     * Фильтр для формирования списка модулей в нужном для конфига формате
     *
     * @param {string} nodeModules Массив с названиями модулей
     * @param {string} module Название модуля
     * @returns {Array} Масив модулей
     */
    function reduce(nodeModules, module) {
        if (exclusions.indexOf(module) == -1) {
            nodeModules[module] = 'commonjs ' + module;
        }

        return nodeModules;
    }

    return fs
        .readdirSync(path.resolve(dirname, 'node_modules'))
        .filter(filter)
        .reduce(reduce, {
            react: 'commonjs react'
        });
}

/**
 * Формирует externals для конфига
 *
 * @param {object} env Объект с опциями сборки
 * @return {Array} Массив externals
 */
module.exports.getExternals = function(env) {
    var externals = [];
    var stats = {
        './stats.json': 'commonjs ./stats.json'
    };

    if (env.server) {
        externals.push(stats, getNodeModules());
    }

    return externals;
};


/**
 * Формирует output.filename
 *
 * @param {object} env Объект с опциями сборки
 * @returns {string} Имя файла
 */
module.exports.getFilename = function(env) {
    var filename = '[name].js';

    if (env.server) {
        filename = 'server.js';
    } else if (env.build) {
        filename = '[name].[hash].js';
    }

    return filename;
};

/**
 * Формирует query для babel-loader
 *
 * @param {object} env Объект с опциями сборки
 * @returns {Object} babel-query
 */
module.exports.getBabelLoaderQuery = function(env) {
    const query = {
        cacheDirectory: true,
        presets: [
            'react',
            'es2015',
            'stage-0'
        ],
        plugins: []
    };

    if (env.server) {
        query.plugins.push('transform-async-to-generator');
    } else if (!env.build) {
        query.plugins.push(['react-transform', {
            // must be an array of objects
            transforms: [{
                // can be an NPM module name or a local path
                transform: 'react-transform-hmr',
                // see transform docs for "imports" and "locals" dependencies
                imports: ['react'],
                locals: ['module']
            }, {
                // you can have many transforms, not just one
                transform: 'react-transform-catch-errors',
                imports: ['react', 'redbox-react']
            }]
        }]);
    }

    return query;
};

/**
 * Формирует resolve.alias
 * https://webpack.github.io/docs/configuration.html#resolve-alias
 *
 * @param {object} env Объект с опциями сборки
 * @returns {object} Aliases
 */
module.exports.getAliases = function(env) {
    // var leafletPath = 'node_modules/leaflet/dist/leaflet.js';
    var alias = {};

    if (env.prod && !env.server) {
        // alias.leaflet = path.resolve(dirname, leafletPath);
    }

    return alias;
};
