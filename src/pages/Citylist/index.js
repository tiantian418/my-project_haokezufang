import React from 'react'

import { NavBar, Icon } from 'antd-mobile'

import './citylist.scss'

import axios from 'axios'

import { getCurrentCity } from '../../utils/index'

import { List } from 'react-virtualized'

class Citylist extends React.Component {
  state = {
    citylist: {}, // 左侧城市列表
    cityindex: [] // 右侧单词数组
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
    list.forEach((item, index) => {
      // substr: 截取字符串 从0开始截取一个
      let word = item.short.substr(0, 1)
      if (Citylist[word]) {
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
    let word = this.state.cityindex[index]
    return (
      <div className="city" key={key} style={style}>
        {/* 单词 */}
        <div className="title">{this.formatWord(word)}</div>
        {/* 城市 */}
        <div className="name">北京</div>
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

  render () {
    return <div className="citylist">
      <NavBar
        className="navbar"
        mode="light"
        icon={<Icon type="left" style={{ color: '#7b7b7b' }} />}
        onLeftClick={() =>{
          this.props.history.push('/home/index')
        }}
      >城市选择</NavBar>

      <List
        width={300}
        height={300}
        rowCount={this.state.cityindex.length} // 总条数
        rowHeight={120} // 每行盒子的高度
        rowRenderer={this.rowRenderer}
      />
    </div>
  }
}

export default Citylist
