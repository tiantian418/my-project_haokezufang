/** 
 * 项目入口文件
 */

import React from 'react'

import ReactDOM from 'react-dom'

// 导入全局初始化样式
import './index.css'

// 引入 antd-mobile的样式
// import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标的css
import './assets/fonts/iconfont.css'

import App from './App'

// 3 渲染到页面位置
ReactDOM.render(<App />, document.getElementById("root"))
