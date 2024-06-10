import { merge } from "webpack-merge";
import baseConfig from "./webpack.config.base.js";

export default merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    hot: true,
    server: "https",
    port: "3000",
  },
})
