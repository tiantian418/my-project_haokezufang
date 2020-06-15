/**
 * 根组件
 */

// 1.导入react
import React from 'react'

import {BrowserRouter as Router,Route} from 'react-router-dom'

// 测试antd-mobile
import { Button } from 'antd-mobile'

// 导入组件
import Home from './pages/Home'

// 2.创建App组件
class App extends React.Component {
  render () {
    return <Router>
      <div>
        <h1>App根组件</h1>
        <Button type="primary">按钮</Button>
        <Route path='/home' component={Home}></Route>
      </div>
    </Router>
  }
}

// 3.导出App组件
export default App