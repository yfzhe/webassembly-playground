import { merge } from "webpack-merge";
import baseConfig from "./webpack.config.base.js";

export default merge(baseConfig, {
  mode: "production",
  output: {
    filename: "[name].[contenthash:8].js",
  }
})
