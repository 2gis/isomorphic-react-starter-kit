const stats = getStats();

/**
 * Returns stats.json
 *
 * @returns {Object} Stats
 */
function getAssetsData(hostname) {
    return stats || {
        publicPath: `//${hostname}:8080/assets/`,
        assets: [
            {
                name: 'main.js',
                chunkNames: ['main']
            }
        ]
    };
}

/**
 * Returns stats.json if it exists
 *
 * @returns {Object|Boolean} Stats
 */
function getStats() {
    try {
        return require('./stats.json');
    } catch (err) {
        return false;
    }
}

/**
 * Returns the object with assets
 *
 * @param {Object} req req
 * @param {Object} res res
 * @param {Function} next next
 * @returns {void}
 */
function getAssets(req, res, next) {
    const hostname = req.headers.host.split(':')[0];
    const {publicPath, assets} = getAssetsData(hostname);

    req.assetsData = assets
        .filter(asset => asset.chunkNames.filter(name => !asset.name.indexOf(name)).length)
        .reduce((obj, {name}) => {
            if (/\.js$/.test(name)) {
                obj.scripts.push(`${publicPath}${name}`);
            } else if (/\.css$/.test(name)) {
                obj.styles.push(`${publicPath}${name}`);
            }
            return obj;
        }, {
            scripts: [],
            styles: []
        });

    next();
}

export default getAssets;
