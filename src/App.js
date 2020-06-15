/**
 * 根组件
 */

// 1.导入react
import React from 'react'

import {BrowserRouter as Router,Route} from 'react-router-dom'

// 导入组件
import Home from './pages/Home'
import Citylist from './pages/Citylist'

// 2.创建App组件
class App extends React.Component {
  render () {
    return <Router>
      <div className="app">
        <Route path='/home' component={Home}></Route>
        {/* 同级的兄弟 */}
        <Route exact path='/citylist' component={Citylist}></Route>
      </div>
    </Router>
  }
}

// 3.导出App组件
export default App
