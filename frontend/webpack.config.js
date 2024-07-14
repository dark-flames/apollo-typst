const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { watch } = require('fs');

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, '../static/js'),
    library: {
      type: 'module',
    },
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.wasm$/,
        type: 'javascript/auto',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: '../wasm',
              publicPath: '/static/wasm',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/[name].bundle.css',
    }),
  ],
  target: 'web',
  experiments: {
    outputModule: true,
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: /node_modules/,
  },
};