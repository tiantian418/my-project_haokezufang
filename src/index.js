/** 
 * 项目入口文件
 */

import React from 'react'
import ReactDOM from 'react-dom'

// 导入全局初始化样式
import './index.css'

// 导入antd-mobile样式
import 'antd-mobile/dist/antd-mobile.css'

// 导入字体图标样式
import './assets/fonts/iconfont.css'

// 导入组件
import App from './App'

// 渲染到页面
ReactDOM.render(<App/>, document.getElementById('root'))
