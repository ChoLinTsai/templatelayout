const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const myEnv = require('dotenv').config();
const path = require('path');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const bootstrapEntryPoints = require('./webpack.bootstrap.config');

const isProd = process.env.NODE_ENV === 'production'; //true | false

const cssDev = [
  'style-loader',
  'css-loader',
  'sass-loader', {
    loader: 'sass-resources-loader',
    options: {
      resources: './src/css/resources/*.scss'
    }
  },
  'postcss-loader'
];

const cssProd = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    'css-loader',
    'sass-loader', {
      loader: 'sass-resources-loader',
      options: {
        resources: './src/css/resources/*.scss'
      }
    },
    'postcss-loader'
  ]
});

const cssConfig = isProd
  ? cssProd
  : cssDev;

const bootstrapConfig = isProd
  ? bootstrapEntryPoints.prod
  : bootstrapEntryPoints.dev;

module.exports = {
  entry: {
    app: './src/js/app.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: './js/[name].bundle.js'
  },
  stats: { //optional settings
    children: false,
    assets: false,
    chunks: false,
    timings: true
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: cssConfig
      }, {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }, {
        test: /\.(jpe?g|png|gif)$/i,
        use: [
          // 'file-loader?name=img/[name].[ext]',
          // 'image-webpack-loader'
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../',
              outputPath: 'img/'
            }
          }, {
            loader: "image-webpack-loader"
          }
        ]
      },
      // {
      // 	test: /\.(woff2?|svg)$/,
      // 	loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
      // },
      // {
      // 	test: /\.(ttf|eot)$/,
      // 	use: [
      // 		{
      // 			loader: 'file-loader',
      // 			options: {
      // 				name: '[name].[ext]',
      // 				publicPath: '../',
      // 				outputPath: 'fonts/'
      // 			}
      // 		}
      // 	]
      //   loader: 'file-loader?name=./fonts/[name].[ext]'
      // },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]',
              publicPath: './',
              outputPath: 'fonts/'
            }
          }
        ]
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '../',
              outputPath: 'fonts/'
            }
          }
        ]
      },
      // {	  for bootstrap 3
      // 	test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
      // 	loader: 'imports-loader?jQuery=jquery'
      // },
      { // for bootstrap 4
        test: /bootstrap\/dist\/js\/umd\//,
        loader: 'imports-loader?jQuery=jquery'
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "./src"),
    compress: true,
    hot: true,
    stats: "errors-only",
		watchContentBase: true,
    // open: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new HtmlWebpackPlugin({
      title: 'Template Layout',
      template: './src/index.html',
      hash: false,
      minify: {
        collapseWhitespace: false
      }
    }),
    new ExtractTextPlugin({
      filename: './css/[name].css',
      disable: !isProd,
      allChunks: true
    }),
    // new webpack.DefinePlugin({
    //   myAPI: JSON.stringify(myEnv.parsed.myAPI)
    // }),
    // new PurifyCSSPlugin({
    //   paths: glob.sync(path.join(__dirname, 'src/*.html')),
    // }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery",
      Tether: "tether",
      "window.Tether": "tether",
      Alert: "exports-loader?Alert!bootstrap/js/dist/alert",
      Button: "exports-loader?Button!bootstrap/js/dist/button",
      Carousel: "exports-loader?Carousel!bootstrap/js/dist/carousel",
      Collapse: "exports-loader?Collapse!bootstrap/js/dist/collapse",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
      Modal: "exports-loader?Modal!bootstrap/js/dist/modal",
      Popover: "exports-loader?Popover!bootstrap/js/dist/popover",
      Scrollspy: "exports-loader?Scrollspy!bootstrap/js/dist/scrollspy",
      Tab: "exports-loader?Tab!bootstrap/js/dist/tab",
      Tooltip: "exports-loader?Tooltip!bootstrap/js/dist/tooltip",
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Popper: ['popper.js', 'default']
    })
  ]
}
