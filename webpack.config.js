const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");

// Define the root directory containing the HTML files
const rootDirectory = path.resolve(__dirname, "src");

function generateHtmlPlugins(rootDir) {
  const plugins = [];
  const files = fs.readdirSync(rootDir);
  const htmlPageFiles = files.filter((file) => path.extname(file) === ".html");

  htmlPageFiles.forEach((file) => {
    plugins.push(
      new HtmlWebpackPlugin({
        filename: file,
        template: path.join(rootDir, file),
        inject: "body",
      })
    );
  });

  return plugins;
}

const htmlFiles = generateHtmlPlugins(rootDirectory);

module.exports = {
  entry: {
    main: "./src/assets/js/index.js",
  },
  mode: "development",
  devServer: {
    watchFiles: ["src/**/*"],
    hot: true,
    port: "auto",
    static: path.resolve(__dirname, "public"), // Serve from 'public'
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        include: path.resolve(__dirname, "src"),
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [autoprefixer],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff2|woff|ttf|eot)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]", // Organized output
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/style.css", // CSS in subfolder
    }),
    ...htmlFiles,
  ],
  output: {
    filename: "assets/js/index.js", // JS in subfolder
    path: path.resolve(__dirname, "public"),
    publicPath: "/", // Fixes asset paths
    clean: true,
  },
};