import React from 'react'

import { Carousel, Flex, Grid } from 'antd-mobile'

// 导入axios
import axios from 'axios'

// {/* react里面不能直接使用本地图片 需要先导入 */}
import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'

// 导入样式
import './index.css'

// 导入scss
import './index.scss'

// 找房子
const navs = [
  {
    id: 0,
    img: nav1,
    title: '整租',
    path: '/home/houselist'
  },
  {
    id: 1,
    img: nav2,
    title: '合租',
    path: '/home/houselist'
  },
  {
    id: 2,
    img: nav3,
    title: '地图找房',
    path: '/map'
  },
  {
    id: 3,
    img: nav4,
    title: '去出租',
    path: '/rent/add'
  }
]

class Index extends React.Component {
  state = {
    data: [], // 轮播图数据
    imgHeight: 176,
    isplay:false, // 是否自动轮播
    groups: [] // 租房小组数据
  }

  // 页面初次渲染
  componentDidMount () {
    // 当页面打开 发送请求 获取轮播图 渲染数据
    this.getSwiperdata()
    // 发送请求 获取租房小组数据
    this.getGroups()
  }

  // 发送请求 获取轮播图
  async getSwiperdata () {
    let res = await axios.get('http://api-haoke-dev.itheima.net/home/swiper')
    // console.log("轮播图数据", res)
    // 赋值轮播图数组
    if (res.data.status !== 200) {
      // 请求失败
      return
    }

    this.setState({
      data: res.data.body
    }, () => {
      this.setState({
        // 确认赋值之后,让轮播图自动轮播
        isplay: true
      })
    })
  }

  // 发送请求 获取租房小组数据
  async getGroups () {
    // AREA%7C88cff55c-aaa4-e2e0: 参数id
    let res = await axios.get('http://api-haoke-dev.itheima.net/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log("租房小组数据", res)
    // 赋值数据给groups
    this.setState({
      groups: res.data.body
    })
  }

  // 循环渲染轮播图图片
  renderSwiper () {
    return this.state.data.map(item => (
      <a
        key={item.id}
        href="http://www.itcast.cn"
        style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
      >
        <img
          src={`http://api-haoke-dev.itheima.net${item.imgSrc}`}
          alt=''
          style={{ width: '100%', verticalAlign: 'top' }}
          onLoad={() => {
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }

  // 循环渲染找房子
  renderNavs () {
    return navs.map (item => {
      return <Flex.Item
        key={item.id}
        onClick={() => {
          this.props.history.push(item.path)
        }}
      >
        <img alt='' src={item.img}></img>
      <p>{item.title}</p>
      </Flex.Item>
    })
  }
  
  render () {
    return <div className="index">
      {/* 1.轮播图 */}
        <Carousel
          autoplay={this.state.isplay} // 自动轮播
          infinite // 无限循环轮播
        >
          {/* 循环data数据 生成三张图片 */}
          { this.renderSwiper() }
        </Carousel>

        {/* 2.租房子 */}
        <Flex className="navs">
          { this.renderNavs() }
      </Flex>

      {/* 3.租房小组 */}
      <div className="groups">
        {/* 标题 */}
        <div className="groups-title">
          <h2>租房小组</h2>
          <span>更多</span>
        </div>
        {/* 每一项 */}
        <Grid
          data={this.state.groups} // 传入数组数据
          columnNum={2} // 列数
          activeStyle={true} // 点击的时候是否有灰色 true: 有
          hasLine={false} // 是否有边框 true: 有
          square={false} // 是否是正方形 true: 正方形 false: 矩形
          renderItem={ item => { // 函数 渲染每个格子的html样式
            return (
              <Flex className="grid-item" justify="between">
                <div className="desc">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                </div>
                <img alt="" src={`http://api-haoke-dev.itheima.net${item.imgSrc} `}/>
              </Flex>
            )
          }}
        ></Grid>
      </div>
    </div>
  }
}

export default Index
