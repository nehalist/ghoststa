const path = require('path');
const devMode = process.env.NODE_ENV !== 'production';

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
  entry: [
    './src/scripts/index.ts',
    './src/stylesheets/main.scss',

    './src/stylesheets/bootstrap.scss',
    './src/stylesheets/primer.scss',
    './src/stylesheets/font-awesome.scss'
  ],
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: devMode
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: devMode
            }
          }
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss', '.css']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'assets/dist')
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    }),
    new OptimizeCSSAssetsPlugin({
      cssProcessorOptions: { safe: true, discardComments: { removeAll: true }}
    }),
    new BrowserSyncPlugin({
      proxy: 'localhost:2368',
      open: false
    })
  ],
  mode: process.env.NODE_ENV || 'production'
};
