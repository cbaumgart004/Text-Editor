const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackPwaManifest = require('webpack-pwa-manifest')
const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')

// Add and configure workbox plugins for a service worker and manifest file.
//  Add CSS loaders and babel to webpack.

module.exports = () => {
  return {
    mode: 'development',
    entry: {
      main: './src/js/index.js',
      install: './src/js/install.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './client/index.html',
        title: 'PWA Text Editor',
      }),
      new WebpackPwaManifest({
        name: 'PWA Text Editor',
        short_name: 'TextEditor',
        description: 'A simple text editor Progressive Web Application',
        background_color: '#ffffff',
        theme_color: '#317EFB',
        start_url: './',
        publicPath: './',
        icons: [
          {
            src: path.resolve('client/src/images/logo.png'), // Path to your app icon
            sizes: [96, 128, 192, 256, 384, 512], // Multiple icon sizes
            destination: path.join('assets', 'icons'),
          },
        ],
      }),
      new InjectManifest({
        swSrc: './client/src-sw.js', // Path to your custom service worker file
        swDest: 'service-worker.js', // Output filename for the service worker
      }), // Injects precache manifest into service worker file.
    ],

    module: {
      rules: [
        // CSS loaders
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        // Babel to transpile JavaScript
        {
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'], // Babel configuration for JavaScript
            },
          },
        },
      ],
    },
  }
}
