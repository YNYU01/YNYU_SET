const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const InlineJsCssPlugin = require('./inline-jscss-plugin.js');
const {execSync} = require('child_process');

// 获取项目根目录（向上两级到项目根目录）
const projectRoot = path.resolve(__dirname, '../../');
const GIT_HASH = execSync('git rev-parse HEAD', { cwd: projectRoot }).toString().trim()

module.exports = async()=> {
  return{
    mode:'production',//development | production
    devtool:false,
    stats:{
      children: true,
    },
    // 入口文件
    entry: {
      main: './test/main.js', // 相对于当前目录（tool_plugin/ToolsSetFig）
    },
    // 输出配置
    output: {
      path: path.resolve(__dirname, './builds'), // 输出目录，相对于当前目录
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
        template: './test/index.html', // 相对于当前目录
        hash:GIT_HASH,
      }),
    ],
  }
};

