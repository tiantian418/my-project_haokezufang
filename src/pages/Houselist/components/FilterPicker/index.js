import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

// 测试数据
const province = [
  {
    label: '北京',
    value: '01',
    children: [
      {
        label: '东城区',
        value: '01-1'
      },
      {
        label: '西城区',
        value: '01-2'
      },
      {
        label: '崇文区',
        value: '01-3'
      },
      {
        label: '宣武区',
        value: '01-4'
      }
    ]
  },
  {
    label: '浙江',
    value: '02',
    children: [
      {
        label: '杭州',
        value: '02-1',
        children: [
          {
            label: '西湖区',
            value: '02-1-1'
          },
          {
            label: '上城区',
            value: '02-1-2'
          },
          {
            label: '江干区',
            value: '02-1-3'
          },
          {
            label: '下城区',
            value: '02-1-4'
          }
        ]
      },
      {
        label: '宁波',
        value: '02-2',
        children: [
          {
            label: 'xx区',
            value: '02-2-1'
          },
          {
            label: 'yy区',
            value: '02-2-2'
          }
        ]
      },
      {
        label: '温州',
        value: '02-3'
      },
      {
        label: '嘉兴',
        value: '02-4'
      },
      {
        label: '湖州',
        value: '02-5'
      },
      {
        label: '绍兴',
        value: '02-6'
      }
    ]
  }
]

export default class FilterPicker extends Component {
  state = {
    value: null // 选择值
  }

  render() {
    return (
      <>
        {/* 选择器组件： */}
        <PickerView
          data={this.props.data} // 数据 下拉的选项值
          value={null} // 默认选中值
          cols={this.props.cols} // 列数
          onChange={(val) => {
            // console.log('下拉的选中值', val)
            this.setState({
              value: val
            })
          }}
        />

        {/* 底部按钮 */}
        <FilterFooter onCancel={this.props.onCancel} onSave={this.props.onSave} />
      </>
    )
  }
}
