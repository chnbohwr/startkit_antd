/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const GitRevisionPlugin = require('git-revision-webpack-plugin')

module.exports = {
  output: {
    filename: '[name]-[git-revision-hash].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: "less-loader",
            options: {
                javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|mp4|ogg|svg|woff|woff2|ttf|eot)$/,
        loader: 'file-loader'
      },
    ]
  },
  resolve: {
    alias: {
      '~components': path.resolve(__dirname, 'src/components/'),
      '~containers': path.resolve(__dirname, 'src/containers/'),
      '~static': path.resolve(__dirname, 'src/static/'),
      '~theme': path.resolve(__dirname, 'src/theme/'),
      '~store': path.resolve(__dirname, 'src/store/'),
      '~hooks': path.resolve(__dirname, 'src/hooks/'),
      '~service': path.resolve(__dirname, 'src/service/'),
      "@ant-design/icons/lib/dist$": path.resolve(__dirname, "src/static/icons/index.js")
    },
    extensions: [
      '.js',
      '.jsx'
    ],
    modules: [
      path.resolve(__dirname, 'src/'),
      path.resolve(__dirname, 'node_modules/'),
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
      filename: "./index.html"
    }),
    new webpack.ContextReplacementPlugin(
      /moment[/\\]locale$/,
      /zh-tw|zh-cn/
    ),
    new GitRevisionPlugin({commithashCommand: 'rev-parse --short HEAD'})
    // new BundleAnalyzerPlugin()
  ],
  devServer: {
    compress: true,
  },
};
