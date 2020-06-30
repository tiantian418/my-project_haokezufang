/**
 * 根组件
 */

// 1.导入react
import React from 'react'

import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'

// 导入组件
import Home from './pages/Home'
import Citylist from './pages/Citylist'
import Map from './pages/Map'
import HouseDetail from './pages/HouseDetail'
import Login from './pages/Login'
import Rent from './pages/Rent'
import RentAdd from './pages/Rent/Add'
import RentSearch from './pages/Rent/Search'
import AuthRoute from './components/AuthRoute'

// 2.创建App组件
class App extends React.Component {
  render() {
    return <Router>
      <div className="app">
        {/* 默认 / 跳转到首页 */}
        <Route
          exact
          path='/'
          render={() => {
            return <Redirect to='/home/index'></Redirect>
          }}
        ></Route>
        <Route path='/home' component={Home}></Route>
        {/* 同级的兄弟 */}
        <Route exact path='/citylist' component={Citylist}></Route>
        <Route exact path='/map' component={Map}></Route>
        <Route exact path="/detail/:id" component={HouseDetail}></Route>
        <Route exact path='/login' component={Login}></Route>

        {/* react的两种写法 */}
        {/* 第一种写法 */}
        {/* <Route exact path='/rent' component={Rent}></Route> */}

        {/* 第二种写法 很多页面都需要 所以封装 AuthRoute 鉴权路由 */}
        <AuthRoute exact={true} path='/rent' Yemian={Rent}></AuthRoute>
        <AuthRoute exact={true} path='/rent/add' Yemian={RentAdd}></AuthRoute>
        <AuthRoute exact={true} path='/rent/search' Yemian={RentSearch}></AuthRoute>
        {/* <Route
          exact
          path='/rent'
          render={(props) => {
            // 有token就是登录 跳转到rent
            if (isAuth()) {
              return <Rent></Rent>
            } else {
              // 没有登录 跳转到login页面
              return < Redirect to='/login'></Redirect>
            }
          }}
        ></Route> */}
      </div>
    </Router>
  }
}

// 3.导出App组件
export default App
