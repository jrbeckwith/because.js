const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: "./src/browser.ts",
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "because.js",
        library: "because",
        libraryTarget: "umd",

        // as default
        sourceMapFilename: "[file].map",

        devtoolModuleFilenameTemplate: function(info) {
            return info.resourcePath;
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    configFileName: './config/tsconfig.webpack.json'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'] 
    },
    performance: {
    },
    plugins: [
        // See https://github.com/webpack/docs/wiki/optimization
        // new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.UglifyJsPlugin({
        //   sourceMap: true
        // }),

    ],
    devtool: "source-map",
    target: "web",
};
