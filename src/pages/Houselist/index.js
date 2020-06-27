import React from 'react'

import Filter from './components/Filter'

import SearchHeader from '../../components/SearchHeder'

import './houselist.scss'
import styles from './houselist.module.scss'

import { getCurrentCity } from '../../utils/index'

import { API } from '../../utils/api'

import { List, AutoSizer, WindowScroller, InfiniteLoader } from 'react-virtualized'

class Houselist extends React.Component {
  state= {
    cityname: '',
    count: 0, // 总条数
    list: [] // 房子数组
  }

  async componentDidMount () {
    let dingwei = await getCurrentCity()
    this.setState({
      cityname: dingwei.label
    })
    // 进入页面 获取房子列表
    // this.filters应该没有条件 默认获取所有
    this.filters = {} // 没有条件
    this.searchHouseList()
  }

  onFilter = (filters) => {
    // console.log('onFilter父接收的条件', filters)
    // 发送请求获取满足条件的房子列表
    // 两个函数 filters 1.传参数 2.写全局变量 3.this.filters
    this.filters = filters
    this.searchHouseList()
  }

  // 发送请求获取满足条件的房子列表
  async searchHouseList() {
    let dingwei = await getCurrentCity()
    let res = await API.get('/houses', {
      params: {
        cityId: dingwei.value,  // 城市id
        ...this.filters, // 条件
        start: 1, // 从1开始
        end: 20 // 取到20 结束
      }
    })
    // console.log('房子数据', res)
    this.setState({
      count: res.data.body.count, // 总条数
      list: res.data.body.list // 房子
    })
  }

  // 每条数据 渲染的函数  里面可以写 html内容
  rowRenderer=({
    key, // 唯一key
    index, // 索引
    // isScrolling, // 正在滚动
    // isVisible, // 是否可见
    style, // 每个大盒子div 必须写 控制样式
  })=> {
    // 渲染每一个房子
    let house = this.state.list[index] // 拿出每一条数据
    // console.log('房子数据', house)

    if (!house) {
      // 没有房子 渲染一个loading
      return <div key={key} style={style} className={styles.loading}>
        正在加载中...
      </div>
    }
    // 有房子才渲染
    return (
      <div key={key} style={style} className={styles.house}>
        {/* 左边图片 */}
        <div className={styles.imgWrap}>
          <img className={styles.img} src={`http://api-haoke-web.itheima.net${house.houseImg}`} alt="" />
        </div>
        {/* 右边文字 */}
        <div className={styles.content}>
          <h3 className={styles.title}>{house.title}</h3>
          <div className={styles.desc}>{house.desc}</div>
          <div>
            {/* ['近地铁', '随时看房'] */}
            {
              house.tags.map((item, index) => {
                return <span key={index} className={[styles.tag,styles.tag1 ].join(' ')} >
                  {item}
                </span>
              })
            }
          </div>
          <div className={styles.price}>
            <span className={styles.priceNum}>{house.price}</span> 元/月
          </div>
        </div>
      </div>
    )
  }

  // 当前数据是否加载完成
  isRowLoaded = ({ index }) => {
    // 返回true或者false
    return !!this.state.list[index]
  }

  // 加载更多
  loadMoreRows = ({ startIndex, stopIndex }) => {
    console.log('加载更多')
    return new Promise( async resolve => {
      // 发送请求 获取更多数据
      let dingwei = await getCurrentCity()
      let res = await API.get('/houses', {
        params: { // 参数
          cityId: dingwei.value,  // 城市id
          ...this.filters, // 条件
          start: startIndex, // 从1开始
          end: stopIndex // 取到20 结束
        }
      })
      // 追加合并数组
      let newList = [...this.state.list, ...res.data.body.list]
      this.setState({
        count: res.data.body.count, // 总条数
        list: newList // 房子
      })

      // 获取数据成功后 resolve
      resolve()
    })
  }


  render () {
    return <div className="houselist">
      {/* 顶部导航栏 */}
      <div className="header">
        {/* 左箭头 */}
        <i className="iconfont icon-back"></i>
        {/* 传入当前定位城市 */}
        <SearchHeader cityname={ this.state.cityname }></SearchHeader>
      </div>

      {/* Filter: 筛选条件组件 */}
      <Filter onFilter={this.onFilter}></Filter>

      {/* 房子列表 */}
      {/* 帮我们计算剩余屏幕宽高 */}
      {/* <AutoSizer>
        {({height, width}) => (
          <List
            width={width}
            height={height}
            rowCount={this.state.count}
            rowHeight={120}
            rowRenderer={this.rowRenderer}
          />
        )}
      </AutoSizer> */}
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        rowCount={this.state.count}
      >
        {({ onRowsRendered, registerChild }) => (
          <WindowScroller>
            {({ height, isScrolling,onChildScroll, scrollTop }) => (
              <AutoSizer>
                {({ width }) => (
                  <List
                    autoHeight // 设置高度为 WindowScroller 最终渲染的列表高度
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop} // 让list滚多少
                    onRowsRendered={onRowsRendered}
                    ref={registerChild}
                    width={width} // 视口宽度
                    height={height} // 视口高度
                    rowCount={this.state.count} // List列表项总条目数
                    rowHeight={120} // 每一行高度
                    rowRenderer={this.rowRenderer} //每条数据的渲染函数 
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        )}
      </InfiniteLoader>
    </div>
  }
}

export default Houselist
