const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ChromeExtManifesto = require("./wp/plugins/chromeExtManifesto");
const utils = require("./wp/utils");
const extension = require("./extenstion.config");


const pathsSettings = {
  optionsEntryAbs: path.resolve(__dirname, extension.paths.optionsEntry),
  popupEntryAbs: path.resolve(__dirname, extension.paths.popupEntry),
  serviceWorkerAbs: path.resolve(__dirname, extension.paths.serviceWorkerEntry),

  optionsHtmlAbs: path.resolve(__dirname, extension.paths.optionsHtml),
  popupHtmlAbs: path.resolve(__dirname, extension.paths.popupHtml),

  distDirAbs: path.resolve(__dirname, extension.paths.distDirName),
}

const _exports = function (_env, argv) {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");
  const HtmlWebpackPlugin = require("html-webpack-plugin");
  const CopyWebpackPlugin = require("copy-webpack-plugin");

  return {
    devtool: isDevelopment && "cheap-module-source-map",
    entry: {
      popup: pathsSettings.popupEntryAbs,
      options: pathsSettings.optionsEntryAbs,
      serviceWorker: pathsSettings.serviceWorkerAbs,

      // Content scripts
      ...utils.entriesFromContentScripts(extension.contentScripts),
    },
    output: {
      path: pathsSettings.distDirAbs,
      filename: (pathData) => {
        if (utils.isContentScript(pathData.runtime, extension.contentScripts)) {
          return `assets/contentScripts/[name].[contenthash:8].js`
        }
        return `assets/js/[name].[contenthash:8].js`
      },
      publicPath: "/",
    },
    module: {
      rules: [
        // {
        //   enforce: "pre",
        //   exclude: /@babel(?:\/|\\{1,2})runtime/,
        //   test: /\.(js|mjs|jsx|ts|tsx|css)$/,
        //   loader: require.resolve('source-map-loader'),
        // },
        {
          oneOf: [
            {
              test: /\.(js|jsx)?$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  cacheDirectory: true,
                  cacheCompression: false,
                  envName: isProduction ? "production" : "development",
                },
              },
            },
            {
              test: /\.module\.css$/,
              use: [
                isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                {
                  loader: "css-loader",
                  options: {
                    importLoaders: 1,
                    modules: true,
                  },
                },
              ]
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: [
                isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                "css-loader",
              ],
            },
            {
              exclude: [/^$/, /\.(js|mjs|ts|tsx)$/, /\.html$/, /\.json$/],
              type: "asset/resource",
            }
          ].filter(Boolean),
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx"]
    },
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, "public"),
            globOptions: {
              ignore: [
                pathsSettings.optionsHtmlAbs,
                pathsSettings.popupHtmlAbs,
              ],
            }
          }
        ]
      }),
      isProduction &&
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[contenthash:8].css",
        chunkFilename: "assets/css/[name].[contenthash:8].chunk.css",
      }),
      new HtmlWebpackPlugin({
        template: pathsSettings.optionsHtmlAbs,
        filename: "options.html",
        inject: "body",
        chunks: ["options"],
      }),
      new HtmlWebpackPlugin({
        template: pathsSettings.popupHtmlAbs,
        filename: "popup.html",
        inject: "body",
        chunks: ["popup"],
      }),
      new ChromeExtManifesto({
        extensionInfo: extension,
        minify: false,
      }),
    ].filter(Boolean),
  }
}

module.exports = _exports;
