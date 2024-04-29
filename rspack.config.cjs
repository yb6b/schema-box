const path = require('node:path')
const process = require('node:process')
const { VueLoaderPlugin } = require('vue-loader')
const rspack = require('@rspack/core')
const version = require('quasar/package.json').version

const resolvePath = p => path.resolve(__dirname, p)

const swcLoader = {
  loader: 'builtin:swc-loader',
  options: {
    jsc: {
      parser: {
        syntax: 'typescript',
      },
    },
  },
}

/** @type {import('@rspack/cli').Configuration} */
const config = {
  builtins: {
    define: {
      'process.env.DEV': process.env.NODE_ENV !== 'production',
      '__VUE_OPTIONS_API__': false,
      '__VUE_PROD_DEVTOOLS__': false,
      '__VUE_PROD_HYDRATION_MISMATCH_DETAILS__': false,
    },
  },
  context: __dirname,
  entry: {
    main: './src/main.js',
  },
  output: {
    path: resolvePath('./dist/spa'),
    filename: 'chunk/[name].[contenthash:8].js',
    chunkFilename: 'js/[name].[contenthash:8].js',
    assetModuleFilename: 'asset/[name][ext]',
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: './src/index.html',
    }),
    new VueLoaderPlugin(),
    new rspack.DefinePlugin({
      __QUASAR_VERSION__: `'${version}'`,
      __QUASAR_SSR__: false,
      __QUASAR_SSR_SERVER__: false,
      __QUASAR_SSR_CLIENT__: false,
      __QUASAR_SSR_PWA__: false,
    }),
    new rspack.CopyRspackPlugin({
      patterns: [{
        from: './public',
      }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader:
              'vue-cli-plugin-quasar/lib/loader.vue.auto-import-quasar.js',
            options: {
              strategy: 'combined',
            },
          },
          swcLoader,
          {
            loader: 'vue-loader',
            options: {
              experimentalInlineMatchResource: true,
              transformAssetUrls: require('quasar/dist/transforms/loader-asset-urls.json'),
            },
          },

        ],
      },
      {
        test: /\.svg/,
        type: 'asset/resource',
      },
      {
        test: /\.(t|j)sx?$/,
        exclude: [/[\\/]node_modules[\\/]/],
        use: [
          {
            loader:
              'vue-cli-plugin-quasar/lib/loader.js.transform-quasar-imports.js',
          },
        ],
      },
      {
        test: /\.ts$/,
        resolve: {
          fullySpecified: false,
        },
        use: [swcLoader],
      },
    ],
  },
  resolve: {
    alias: {
      'app': resolvePath('./'),
      '@': resolvePath('./src'),
    },
    extensions: ['.ts', '.mjs', '.js', '.json'],
  },
  devtool: false,
}
module.exports = config
