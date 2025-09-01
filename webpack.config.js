const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineJsCssPlugin = require('./inline-jscss-plugin.js');
const {execSync} = require('child_process');
const GIT_HASH = execSync('git rev-parse HEAD').toString().trim()

module.exports = async()=> {
  return{
    mode:'production',//development | production
    devtool:false,
    stats:{
      children: true,
    },
    // 入口文件
    entry: {
      main: './tool_plugin/ToolsSetFig/test/main.js', // 修改为main.js的实际路径
    },
    // 输出配置
    output: {
      path: path.resolve(__dirname, './tool_plugin/ToolsSetFig/builds'), // 输出目录，修改为希望输出的文件夹路径
      filename: 'bundle.js', // 打包后的JavaScript文件名
    },
    optimization:{
      minimize: false,
    },
    // 模块规则
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader/*'style-loader'*/, 'css-loader'], // 处理CSS文件
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        }
      ],
    },
    // 插件配置
    plugins: [
      new InlineJsCssPlugin({
        template: './tool_plugin/ToolsSetFig/test/index.html',
        hash:GIT_HASH,
      }),
    ],
  }
};
