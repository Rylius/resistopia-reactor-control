var merge = require('webpack-merge');
var prodEnv = require('./prod.env');

module.exports = merge(prodEnv, {
    RESISTOPIA_BACKEND_URL: '"http://localhost:8081"', // TODO Get backend server IP
});
