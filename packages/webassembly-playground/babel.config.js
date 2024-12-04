import ReactRefreshPlugin from "react-refresh/babel";

const { BABEL_ENV } = process.env;
const isDevelopment = BABEL_ENV === "development";

const config = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-typescript",
    [
      "@babel/preset-react",
      {
        runtime: "automatic",
      },
    ],
  ],
  plugins: [isDevelopment && ReactRefreshPlugin].filter(Boolean),
};

export default config;
