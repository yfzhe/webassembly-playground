import path from "node:path";
import { merge } from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import NodePolyfillWebpackPlugin from "node-polyfill-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import ExamplesPlugin from "./webpack/examples-plugin.js";

/** @type {import("webpack").Configuration} */
const baseConfig = {
  entry: {
    main: "./src/index.ts",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
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
    new MonacoWebpackPlugin(),
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
