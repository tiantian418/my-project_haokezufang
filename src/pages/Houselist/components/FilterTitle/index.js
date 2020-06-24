import React from 'react'

import { Flex } from 'antd-mobile'

import styles from './index.module.css'

// 条件筛选栏标题数组：
const titleList = [
  { title: '区域', type: 'area' },
  { title: '方式', type: 'mode' },
  { title: '租金', type: 'price' },
  { title: '筛选', type: 'more' }
]

export default function FilterTitle(props) {
  let { titleStatus } = props
  return (
    <Flex align="center" className={styles.root}>
      {/* 一个Flex.item标题循环titleList生成四个标题 */}
      {
        titleList.map(item => {
          return <Flex.Item
            key={item.type}
            onClick={() => {
              // 调用父组件的onTitleClick函数
              props.onTitleClick(item.type)
            }}
          >
            <span className={[styles.dropdown, titleStatus[item.type] ? styles.selected : ''].join(' ')}>
              <span>{item.title}</span>
              <i className="iconfont icon-arrow" />
            </span>
          </Flex.Item>
        })
      }
    </Flex>
  )
}
