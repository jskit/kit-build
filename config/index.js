// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var ProgressBarPlugin = require('progress-bar-webpack-plugin')
var WebpackNotifierPlugin = require('webpack-build-notifier')
// import { argv } from 'yargs'

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const env = process.env.NODE_ENV || 'dev'
const constMaps = {
  __DEV__: ['dev', 'development'],
  __PROD__: ['prod', 'production'],
  __TEST__: ['test', 'testing'],
}
const injectConst = {}
for (const key in constMaps) {
  injectConst[key] = constMaps[key].indexOf(env) > -1
}
const envConst = {
  // http://vuejs.github.io/vue-loader/en/workflow/production.html
  'process.env': {
    NODE_ENV: JSON.stringify(env)
  },
  'NODE_ENV': env,
  '__DEBUG__': injectConst['__DEV__'], //&& !argv.no_debug,
  ...injectConst,
}

/**
 * 一些配置
 * 环境变量 env: dev,prod,testing
 * 运行模式 mode: client,server
 * 运行时类型 target: web,node,weex,hybrid
 */

module.exports = {
  template: 'src/index.tpl',
  env: envConst,
  plugins: [
    // 注入全局变量，用于条件判断
    new webpack.DefinePlugin({
      ...envConst,
    }),
    //进度条插件
    new ProgressBarPlugin({
      summary: false,
      format: chalk.green.bold('[:bar] :percent ') + chalk.yellow('(:elapsed seconds) :msg'),
      customSummary (buildTime) {
        process.stdout.write(chalk.green.bold(" ---------buildTime:" + buildTime + "---------"));
      },
    }),

    // https://github.com/RoccoC/webpack-build-notifier
    new WebpackNotifierPlugin({
      title: 'app',
      logo: resolve('/static/img/logo.png'),
      successSound: 'Submarine',
      failureSound: 'Glass',
      suppressSuccess: true
    }),
  ],
  build: {
    env: require('./prod.env'),
    index: resolve('/dist/index.html'),
    assetsRoot: resolve('/dist'),
    assetsSubDirectory: './static',
    assetsPublicPath: './',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
}
