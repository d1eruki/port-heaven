const path = require("path");
const { DefinePlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const tailwindDefaultTheme = require("tailwindcss/defaultTheme");

const mediaOptimizationLoader = path.resolve(__dirname, "scripts/optimize-media-loader.cjs");
const typographLocaleLoader = path.resolve(__dirname, "scripts/typograph-locale-loader.cjs");

module.exports = (_env, argv) => {
  const mode = argv.mode || process.env.NODE_ENV || "production";
  const isDev = mode === "development";

  return {
    entry: "./src/script.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isDev ? "script.js" : "script.[contenthash].js",
      chunkFilename: isDev ? "[name].js" : "[name].[contenthash].js",
      clean: true,
    },
    mode,
    devServer: {
      static: path.join(__dirname, "dist"),
      port: 8080,
      open: false,
      allowedHosts: "all",
      hot: true,
    },
    resolve: {
      extensions: [".js", ".vue", ".json"],
    },
    module: {
      rules: [
        {
          test: /src[\\/]locales[\\/].+\.json$/i,
          type: "json",
          use: [typographLocaleLoader],
        },
        {
          test: /\.(woff2?|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[name][ext]",
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: "asset/resource",
          use: isDev ? [] : [mediaOptimizationLoader],
          generator: {
            filename: isDev ? "assets/[name][ext]" : "assets/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.mp4$/i,
          type: "asset/resource",
          use: isDev ? [] : [mediaOptimizationLoader],
          generator: {
            filename: isDev ? "assets/[name][ext]" : "assets/[name].[contenthash][ext]",
          },
        },
        {
          test: /\.vue$/,
          loader: "vue-loader",
        },
        {
          test: /\.css$/i,
          use: [
            isDev ? "style-loader" : MiniCssExtractPlugin.loader,
            "css-loader",
            "postcss-loader",
          ],
        },
      ],
    },
    optimization: {
      minimize: !isDev,
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: "index.html",
        inject: true,
        favicon: "src/assets/favicon.png",
      }),
      ...(isDev ? [] : [new MiniCssExtractPlugin({ filename: "style.[contenthash].css" })]),
      new DefinePlugin({
        __TAILWIND_SCREENS__: JSON.stringify(tailwindDefaultTheme.screens),
        __VUE_OPTIONS_API__: JSON.stringify(false),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  };
};
