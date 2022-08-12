import { Configuration } from "webpack";
import * as path from "path";

const config: Configuration = {
  mode: "production",
  entry: {
    d_comments: "./src/Content/index.ts",
    bg: "./src/Background/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            configFile: "tsconfig.content.json",
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
};

export default config;
