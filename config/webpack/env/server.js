/**
 * Webpack config for server
 */
module.exports = require('./../build')({
    server: true,
    build: false
});
