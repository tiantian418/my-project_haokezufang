import React from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

import axios from 'axios'

import { getCurrentCity } from '../../utils/index'

import { List, AutoSizer } from 'react-virtualized'

class Citylist extends React.Component {
  state = {
    citylist: {}, // 左侧城市列表
    cityindex: [], // 右侧单词数组
    activeIndex: 0 // 默认0索引选中
  }

  componentDidMount () {
    // 获取城市列表数据
    this.getCityList()
  }

  // 发送请求,获取城市列表数据
  async getCityList () {
    let res = await axios.get('http://api-haoke-dev.itheima.net/area/city?level=1')
    // console.log('城市列表数据', res)

    // 1.格式化城市数据
    let { citylist, cityindex } = this.formatCity(res.data.body)

    // 2.获取热门城市
    let hotRes = await axios.get('http://api-haoke-dev.itheima.net/area/hot')
    // console.log('热门城市数据', hotRes)
    citylist['hot'] = hotRes.data.body
    cityindex.unshift('hot') // 在前面插入

    // 获取定位城市
    let dingwei = await getCurrentCity()
    citylist['#'] = [dingwei] // 和前面格式要一致
    cityindex.unshift('#')

    // 赋值
    this.setState({
      citylist,
      cityindex
    })
  }

  // 封装格式化城市数据
  formatCity (list) {
    let citylist = {}
    list.forEach(item => {
      // substr: 截取字符串 从0开始截取一个
      let word = item.short.substr(0, 1)

      if (citylist[word]) {
        // 对象里面有单词就继续追加城市
        citylist[word].push(item)
      } else {
        citylist[word] = [item]
      }
    })
    // Object.keys(对象) 把对象里面的 键 拿出来组成一个数组
    let cityindex = Object.keys(citylist).sort() // sort: 排序
    return {
      citylist,
      cityindex
    }
  }

  // rowRenderer函数
  rowRenderer = ({
    key, // 唯一的key
    index, // 每条数组的索引
    isScrolling, // 是否正在滚动
    isVisible, // 是否可见
    style, // 控制样式 必须写
  }) => {
    // 1.通过index索引 拿到单词
    let word = this.state.cityindex[index]
    // 2.通过单词 拿到城市数组
    let citys = this.state.citylist[word]
    return (
      <div className="city" key={key} style={style}>
        {/* 单词 */}
        <div className="title">{this.formatWord(word)}</div>
        {/* 城市 */}
        { // 有几个城市就渲染循环生成几个div
          citys.map(item => {
           return <div key={item.value} className="name">
              {item.label}
           </div>
          })
        }
      </div>
    )
  }

  // 格式化单词
  formatWord (word) {
    switch (word) {
      case '#':
        return '当前定位'
      case 'hot':
        return '热门城市'
      default:
        return word.toUpperCase()
    }
  }

  // getHight: 动态计算每行的高度
  getHight = ({index}) => {
    let word = this.state.cityindex[index]
    let citys = this.state.citylist[word]
    // 每行高度= (单词高度)36 + (所有城市高度)城市个数 * 50
    // 必须返回数字类型
    return 36 + citys.length * 50
  }

  // 渲染右侧单词列表
  renderIndex() {
    return this.state.cityindex.map((item, index) => {
      return <li
        key={index}
        className={index == this.state.activeIndex ? 'active': ''}
      >
        {/* 将hot变成热字,其它大写 */}
        {item === 'hot' ? '热' : item.toUpperCase()}
      </li>
    })
  }

  // 当list列表滚动渲染的时候执行
  // 文档地址: https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md
  // :void 不需要返回值
  onRowsRendered  = ({startIndex}) => {
    // console.log(startIndex)
    // 修改activeIndex索引 对应单词高亮
    if (startIndex != this.state.activeIndex) {
      this.setState({
        activeIndex: startIndex
      })
    }
  }

  render () {
    return <div className="citylist">
      <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" style={{ color: '#7b7b7b' }} />}
        onLeftClick={() =>{
          this.props.history.go(-1)
        }}
      >城市选择</NavBar>

      {/* AutoSizer: 包裹List占满剩余屏幕 帮我们计算出宽高 */}
      <AutoSizer>
        {({height, width}) => (
          <List
            width={ width } // 列表宽
            height={ height } // 列表高
            rowCount={ this.state.cityindex.length } // 总条数
            rowHeight={ this.getHight } // 每行盒子的高度
            rowRenderer={ this.rowRenderer }
            onRowsRendered={ this.onRowsRendered }
          />
        )}
      </AutoSizer>

      {/* 右侧单词列表 */}
      <ul className="city-index">
        { this.renderIndex() }
      </ul>
    </div>
  }
}

export default Citylist
