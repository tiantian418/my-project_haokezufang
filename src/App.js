/**
 * 根组件
 */

// 1.导入react
import React from 'react'

import {BrowserRouter as Router,Route, Redirect} from 'react-router-dom'

// 导入组件
import Home from './pages/Home'
import Citylist from './pages/Citylist'

// 2.创建App组件
class App extends React.Component {
  render () {
    return <Router>
      <div className="app">
        {/* 默认 / 跳转到首页 */}
        <Route
          exact
          path='/'
          render={(props) => {
            return <Redirect to='/home/index'></Redirect>
          }}
        ></Route>
        <Route path='/home' component={Home}></Route>
        {/* 同级的兄弟 */}
        <Route exact path='/citylist' component={Citylist}></Route>
      </div>
    </Router>
  }
}

// 3.导出App组件
export default App
