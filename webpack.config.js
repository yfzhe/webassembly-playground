import path from "node:path";
import { merge } from "webpack-merge";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";
import NodePolyfillWebpackPlugin from "node-polyfill-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import ExamplesPlugin from "./webpack/examples-plugin.js";

/** @type {import("webpack").Configuration} */
const baseConfig = {
  entry: {
    main: "./src/index.tsx",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", "..."],
    fallback: {
      fs: false,
    },
  },
  plugins: [
    new NodePolyfillWebpackPlugin({
      onlyAliases: ["path"],
    }),
    new MonacoWebpackPlugin({
      languages: [],
      features: ["html", "javascript"],
    }),
    new ExamplesPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html",
      chunks: ["main"],
    }),
    new HtmlWebpackPlugin({
      filename: "preview/index.html",
      template: "src/preview.html",
      chunks: [],
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(import.meta.dirname, "dist"),
    clean: true,
  },
  optimization: {
    moduleIds: "deterministic",
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        wabt: {
          test: /[\\/]node_modules[\\/]wabt/,
          name: "wabt",
          chunks: "all",
        },
      },
    },
  },
};

export default function (env, argv) {
  const { mode } = argv;

  process.env.BABEL_ENV = mode;

  switch (mode) {
    case "production": {
      return merge(baseConfig, {
        mode: "production",
        output: {
          filename: "[name].[contenthash:8].js",
          chunkFilename: (pathData) => {
            if (pathData.chunk.name === "service-worker") {
              return "service-worker.js";
            } else {
              return "[name].[contenthash:8].js";
            }
          },
        },
      });
    }

    case "development": {
      return merge(baseConfig, {
        mode: "development",
        plugins: [new ReactRefreshWebpackPlugin()],
        devtool: "inline-source-map",
        devServer: {
          static: "./dist",
          hot: true,
          server: "https",
          port: "3000",
        },
      });
    }
  }
}
