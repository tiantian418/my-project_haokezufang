import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { baseURL } from '../../utils/baseURL'

import styles from './index.module.css'

import { isAuth, removeToken } from '../../utils/token'

import { API } from '../../utils/api'

import { Grid, Button, Modal } from 'antd-mobile'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  { id: 4, name: '成为房主', iconfont: 'icon-identity' },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' }
]

// 默认头像
const DEFAULT_AVATAR = baseURL + '/img/profile/avatar.png'

export default class Profile extends Component {
  state = {
    islogin: isAuth(),  // false未登录 true登录
    userInfo: {
      avatar: '', //头像
      nickname: ''// 昵称
    }
  }

  componentDidMount() {
    //  当页面打开 发送请求 获取用户信息
    this.getUserinfo()
  }

  // 发送请求 获取用户信息
  async getUserinfo() {
    // 如果没有登录  不做请求
    if (!this.state.islogin) {//没有登录
      return
    }
    // let token = getToken()
    let res = await API.get("/user", {
      // headers:{
      //   // 名字 : token值
      //   authorization : token
      // }
    })
    console.log('用户信息', res)
    // 判断赋值
    if (res.data.status === 200) {
      // 赋值
      this.setState({
        userInfo: {
          avatar: res.data.body.avatar, // 头像
          nickname: res.data.body.nickname // 昵称
        }
      })
    } else {
      console.log('用户信息获取错误')
    }
  }

  // 退出
  logout = () => {
    // 点击退出 弹窗提示
    Modal.alert('退出', '您确定退出吗 ???', [
      {
        text: '取消',  // 按钮文字
        onPress: () => { // 点击事件
          console.log('取消')
        }
      },
      {
        text: '确定退出',
        onPress: async () => {
          console.log('确定退出')
          // 发送请求去退出
          // API.post("地址",数据,{配置头等})
          // let token = getToken()
          let res = await API.post("/user/logout", null, {
            // headers:{
            //   // 名字：token值
            //   authorization : token
            // }
          })
          console.log('退出结果', res)
          if (res.data.status === 200) {
            // 退出成功 有些会跳转去登录页面  我们不跳转 
            // 前端 要删除掉token
            removeToken()
            // 重置  数据为 未登录
            this.setState({
              islogin: false,  // false未登录
              userInfo: {
                avatar: '', //头像
                nickname: ''// 昵称
              }
            })
          } else {
            console.log('退出失败')
          }
        }
      },
    ])

  }


  render() {
    const { history } = this.props
    let { userInfo } = this.state
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={baseURL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              {/* 头像 有头像显示头像 否则显示默认头像 DEFAULT_AVATAR */}
              <img
                className={styles.avatar}
                src={userInfo.avatar || DEFAULT_AVATAR}
                alt="icon" />
            </div>
            <div className={styles.user}>
              {/* 昵称 */}
              <div className={styles.name}>
                {userInfo.nickname || '游客'}
              </div>
              {/* 登录后展示： */}
              {/* islogin判断  登录 显示 退出+编辑个人资料   没有登录  显示 去登录 */}
              {/* <>  </> 包裹起来 但是页面不会显示这个标签  */}
              {
                this.state.islogin
                  ?
                  // 登录了 显示 退出+编辑个人资料 
                  <>
                    <div className={styles.auth}>
                      <span onClick={this.logout}>退出</span>
                    </div>
                    <div className={styles.edit}>
                      编辑个人资料
                    <span className={styles.arrow}>
                        <i className="iconfont icon-arrow" />
                      </span>
                    </div>
                  </>
                  :
                  // 未登录 显示 去登录
                  <div className={styles.edit}>
                    <Button
                      type="primary"
                      size="small"
                      inline
                      onClick={() => history.push('/login')}
                    >
                      去登录
                  </Button>
                  </div>
              }

            </div>
          </div>
        </div>

        {/* 九宫格菜单 也可以用Flex*/}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={item =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={baseURL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
