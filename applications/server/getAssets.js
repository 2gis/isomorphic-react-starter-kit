const stats = getStats();

/**
 * Returns stats.json
 *
 * @returns {Object} Stats
 */
function getAssetsData() {
    return stats || {
        publicPath: 'http://localhost:8080/assets/',
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
 * @returns {Object} Assets for application
 */
function getAssets() {
    const {publicPath, assets} = getAssetsData();

    return assets
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
}

export default getAssets;
