const path = require('path');

module.exports = {
  includePaths: [path.join(__dirname, 'node_modules')],
  quietDeps: true // Reduces noise from dependencies
};