// config-overrides.js 固定写法 是 webpack 重写覆盖的配置
const { override, fixBabelImports } = require('customize-cra')

// 按需加载
module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css',
  })
)
