const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
__webpack_base_uri__ = 'https://example.com'

module.exports = {
  mode: process.env.NODE_ENV,
  context: path.resolve(__dirname, 'src'),
  entry: {
    index: './js/index.js',
    product: './js/product.js',
    information: './js/information.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: './js/[name].js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  devServer: {
    compress: true,
    port: 3000,
    stats: {
      assets: true,
      cached: false,
      chunkModules: false,
      chunkOrigins: false,
      chunks: false,
      colors: true,
      hash: false,
      modules: false,
      reasons: false,
      source: false,
      version: false,
      warnings: false,
    },
    proxy: {
      '/vsweb/api/': {
        target: 'https://www.vscinemas.com.tw',
        changeOrigin: true,
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]?[hash:8]',
              esModule: false,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              disable: process.env.NODE_ENV === 'production' ? false : true,
              mozjpeg: {
                progressive: true,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(js)$/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      title: '首頁',
      filename: 'index.html',
      template: 'html/index.html',
      chunksSortMode: 'manual',
      chunks: ['vendors', 'index'],
    }),
    new HtmlWebpackPlugin({
      title: '產品項目',
      filename: 'product.html',
      template: 'html/product.html',
      chunksSortMode: 'manual',
      chunks: ['vendors', 'product'],
    }),
    new HtmlWebpackPlugin({
      title: '訂單資訊',
      filename: 'information.html',
      template: 'html/information.html',
      chunksSortMode: 'manual',
      chunks: ['vendors', 'information'],
    }),
  ],
}
