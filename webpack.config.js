const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let settings = {
  optionsEntry: "src/options.js",
  popupEntry: "src/popup.js",
  serviceWorkerEntry: "src/serviceWorker.js",

  optionsHtml: "public/options.html",
  popupHtml: "public/popup.html",

  distDirName: "dist",
}

settings = {
  ...settings,

  optionsEntryAbs: path.resolve(__dirname, settings.optionsEntry),
  popupEntryAbs: path.resolve(__dirname, settings.popupEntry),
  serviceWorkerAbs: path.resolve(__dirname, settings.serviceWorkerEntry),

  optionsHtmlAbs: path.resolve(__dirname, settings.optionsHtml),
  popupHtmlAbs: path.resolve(__dirname, settings.popupHtml),

  distDirAbs: path.resolve(__dirname, settings.distDirName),
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
      popup: settings.popupEntryAbs,
      options: settings.optionsEntryAbs,
      serviceWorker: settings.serviceWorkerAbs,
    },
    output: {
      path: settings.distDirAbs,
      filename: "assets/js/[name].[contenthash:8].js",
      publicPath: "/",
    },
    module: {
      rules: [
        {
          enforce: "pre",
          exclude: /@babel(?:\/|\\{1,2})runtime/,
          test: /\.(js|mjs|jsx|ts|tsx|css)$/,
          loader: require.resolve('source-map-loader'),
        },
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
                settings.optionsHtmlAbs,
                settings.popupHtmlAbs,
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
        template: settings.optionsHtmlAbs,
        filename: "options.html",
        inject: "body",
        chunks: ["options"],
      }),
      new HtmlWebpackPlugin({
        template: settings.popupHtmlAbs,
        filename: "popup.html",
        inject: "body",
        chunks: ["popup"],
      })
    ].filter(Boolean),
  }
}

module.exports = _exports;
