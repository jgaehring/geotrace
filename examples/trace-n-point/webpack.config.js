const CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
  entry: {
    index: `${__dirname}/src/index.js`,
  },
  output: {
    path: `${__dirname}/dist`,
    clean: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: `${__dirname}/static` },
        { from: `${__dirname}/../../dist/*.js`, context: `${__dirname}/../../dist` },
        { from: `${__dirname}/../../dist/*.css`, context: `${__dirname}/../../dist` },
        { from: `${__dirname}/../test/sentinel.html` },
      ],
    }),
  ],
};
