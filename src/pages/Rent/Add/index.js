import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  Toast
} from 'antd-mobile'

import NavHeader from '../../../components/NavHeader'

import HousePackge from '../../../components/HousePackage'

import styles from './index.module.css'

import { API } from '../../../utils/api'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' }
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' }
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' }
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)

    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: {
        name: '',
        id: ''
      },
      // 价格
      price: '',
      // 面积
      size: 0,
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: ''
    }
  }

  componentDidMount() {
    // 接收小区名称和小区id
    // console.log('add页面props', this.props)
    let { state } = this.props.location
    if (state) {
      this.setState({
        community: {
          name: state.name,
          id: state.id
        }
      })
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1)
      },
      {
        text: '继续编辑'
      }
    ])
  }

  // // 获取租金price
  // getPrice = (val) => {
  //   // console.log('值', val)
  //   this.setState({
  //     price: val // 租金
  //   })
  // }

  // // 获取建筑面积
  // getSize = (val) => {
  //   // console.log('值', val)
  //   this.setState({
  //     size: val // 建筑面积
  //   })
  // }

  // 封装重复函数
  getValue = (name, val) => {
    // console.log('值', val)
    this.setState({
      [name]: val // 属性变量 名字不一样
    })
  }

  // 选择图片后执行
  handleHouseImg = (files, operationype, index) => {
    // console.log('files', files) // 图片数组
    // console.log('operationype', operationype) // 添加/删除
    // console.log('index', index) // 删除的索引

    this.setState({
      tempSlides: files
    })
  }

  // 点击提交
  addHouse = async () => {
    // 获取填写的房子信息
    // console.log('房子信息', this.state)

    // 在提交之前 先上传图片 之后发布房源
    // ajax上传图片必须配合FormData
    let houseImg = ''
    if (this.state.tempSlides.length > 0) {
      let formdata = new FormData()
      this.state.tempSlides.forEach(item => {
        let file = item.file // 每一张真正的图片
        formdata.append('file', file)
      })
      let res = await API.post('/houses/image', formdata, {
        // 上传文件 必须是下面的请求头
        "Content-Type": "multipart/form-data"
      })
      console.log('上传结果', res.data.body)
      // 参数以 | 分割的字符串
      houseImg = res.data.body.join('|')
    }

    // 完整的房子信息
    let house = {
      title: this.state.title,
      description: this.state.description,
      houseImg: houseImg,
      oriented: this.state.oriented,
      supporting: this.state.supporting,
      price: this.state.price,
      roomType: this.state.roomType,
      size: this.state.size,
      floor: this.state.floor,
      community: this.state.community.id
    }
    console.log('房子信息house', house)

    let addRes = await API.post('/user/houses', house)
    if (addRes.data.status === 200) {
      // 发布成功
      Toast.success('发布成功', 1)
      this.props.history.push('/rent')
    } else {
      Toast.fail('服务器偷懒了，请稍后再试~', 1)
    }
  }


  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
      size
    } = this.state

    return (
      <div className={styles.root}>
        <NavHeader onLeftClick={this.onCancel}>发布房源</NavHeader>

        <List
          className={styles.header}
          renderHeader={() => '房源信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请输入小区名称'}
            arrow="horizontal"
            // history.replace相当于history.push 跳转
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>

          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            value={price}
            onChange={(val) => {
              this.getValue('price', val)
            }}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>

          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            value={size}
            onChange={(val) => {
              this.getValue('size', val)
            }}
          >
            建筑面积
          </InputItem>

          <Picker
            data={roomTypeData}
            value={[roomType]}
            onChange={(val) => {
              this.getValue('roomType', val[0])
            }}
            cols={1}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            onChange={(val) => {
              this.getValue('floor', val[0])
            }}
            cols={1}>
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>

          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={(val) => {
              this.getValue('oriented', val[0])
            }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            value={title}
            onChange={(val) => {
              this.getValue('title', val)
            }}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          {/* 房屋图像 */}
          <ImagePicker
            files={tempSlides} // 图片数组 临时显示地址
            multiple={true} // 是否支持同时选择多张图片
            className={styles.imgpicker}
            onChange={this.handleHouseImg} // 选择图片后执行
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          <HousePackge
            select
            onSelect={(arr) => {
              // console.log('洗衣机空调supporting', arr)
              this.setState({
                supporting: arr.join('|') //以 | 分割的字符串
              })
            }}
          />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          {/* 文本域 */}
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(val) => {
              this.getValue('description', val)
            }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
