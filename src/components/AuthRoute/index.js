/**
 * 封装AuthRoute 鉴权路由
 */

import React, { Component } from 'react'

import { Route, Redirect } from 'react-router-dom'

import { isAuth } from '../../utils/token'

export default class AuthRoute extends Component {
  render() {
    let { path, Yemian, exact } = this.props
    return <Route
      exact={exact}// true精确false模糊
      path={path} //path不要写死
      render={(props) => {
        // console.log('render里的props',props)
        //有token 就是登录  /rent   房屋管理Rent页面  
        if (isAuth()) { // true登录了
          return <Yemian {...props}></Yemian>
        } else {// 没有登录
          // 跳转到登录login页面
          return <Redirect to="/login"></Redirect>
        }
      }}></Route>
  }
}
