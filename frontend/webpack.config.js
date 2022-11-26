const HtmlWebpackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv');
const webpack = require('webpack');

dotenv.config();

module.exports = {
    // 생략
    plugins: [
        new webpack.DefinePlugin({
            "REACT_APP_KAKAO_MAP_API_KEY": JSON.stringify(process.env.REACT_APP_KAKAO_MAP_API_KEY),
        }),
    ],
    // 생략
};