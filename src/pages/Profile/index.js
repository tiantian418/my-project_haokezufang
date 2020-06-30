import React, { Component } from 'react'

import { Link } from 'react-router-dom'

import { Grid, Button, Modal } from 'antd-mobile'

import { baseURL } from '../../utils/baseURL'

import styles from './index.module.css'

import { isAuth, getToken, removeToken } from '../../utils/token'

import { API } from '../../utils/api'

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
    isLogin: isAuth(), // 未登录
    userInfo: {
      avatar: '',
      nickname: ''
    }
  }

  componentDidMount() {
    this.getUserInfo()
  }

  // 获取用户信息
  async getUserInfo() {
    // 如果没有登录 不做请求
    if (!this.state.isLogin) {
      return
    }
    let token = getToken()
    let res = await API.get('/user', {
      headers: {
        authorization: token
      }
    })
    // console.log('用户信息', res)
    if (res.data.body === 200) {
      // 赋值
      this.setState({
        userInfo: {
          avatar: res.data.body.avatar,
          nickname: res.data.body.nickname
        }
      })
    }
  }

  // 退出
  logout = () => {
    // 点击退出 弹窗提示
    Modal.alert('退出', '您确定退出吗?', [
      { text: '取消' },
      {
        text: '退出',
        onPress: async () => {
          let token = getToken()
          // 调用退出接口
          let res = await API.post('/user/logout', null, {
            headers: {
              authorization: token
            }
          })
          console.log('退出结果', res)

          if (res.data.status === 200) {
            // 移除本地token
            removeToken()

            // 处理状态
            this.setState({
              isLogin: false,
              userInfo: {
                avatar: '',
                nickname: ''
              }
            })
          }
        }
      }
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
              <img className={styles.avatar} src={userInfo.avatar || DEFAULT_AVATAR} alt="icon" />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>
                {userInfo.nickname || '游客'}
              </div>
              {/* 登录后展示： */}
              {/* 判断: 登录: 显示退出+编辑个人资料  未登录: 显示去登录 */}
              {/* <> </>: 包裹起来 但是页面不会显示这个标签 */}
              {this.state.isLogin ? (
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
              ) : (
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
                )}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
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
