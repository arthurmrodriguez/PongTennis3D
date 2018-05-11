const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    devtool: 'source-map',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'www'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'PongTennis3D',
            filename: 'index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, 'src/js')
                ],
                loader: 'babel-loader',
                query: {
                    compact: true,
                    presets: [
                        ['es2015', { modules: false }]
                    ]
                }
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 8000,
                        name: 'src/img/[hash]-[name].[ext]'
                    }
                }]
            }
        ]
    }
};