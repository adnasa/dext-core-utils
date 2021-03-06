const path = require('path');
const fs = require('fs');
const Conf = require('../utils/conf');
const { PLUGIN_PATH } = require('../utils/paths');

// initialize a new config file
const config = new Conf();

/**
 * Retrieve a list of enabled plugins (from the config)
 *
 * @return {String[]} - A list of enabled plugins
 */
const getAll = () => config.get('plugins') || [];

/**
 * Retrieve all plugins in the file system
 *
 * @return {String[]} - A list of plugins found in the plugins directory
 */
const fetchPlugins = () =>
    new Promise((resolve, reject) => {
        fs.readdir(PLUGIN_PATH, (err, files) => {
            if (err) {
                reject(err);
            } else {
                const ret = files.filter(file =>
                    fs.statSync(path.join(PLUGIN_PATH, file)).isDirectory()
                );
                resolve(ret);
            }
        });
    });

/**
 * Checks if the plugin is already enabled
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
const isEnabled = plugin => ~getAll().indexOf(plugin);

/**
 * Checks if the plugin is installed
 *
 * @param {String} plugin - The plugin name
 * @return {Boolean}
 */
const isInstalled = plugin => fs.existsSync(path.resolve(PLUGIN_PATH, plugin));

/**
 * Enables the plugin by adding it to the config
 *
 * @param {String} plugin - The plugin name
 */
const enable = plugin => {
    const plugins = getAll();
    plugins.push(plugin);
    config.set('plugins', plugins);
};

/**
 * Disables the plugin by removing it from the config
 *
 * @param {String} plugin - The plugin name
 */
const disable = plugin => {
    const plugins = getAll();
    plugins.splice(plugins.indexOf(plugin), 1);
    config.set('plugins', plugins);
};

module.exports = {
    getAll,
    fetchPlugins,
    isEnabled,
    isInstalled,
    enable,
    disable,
};
