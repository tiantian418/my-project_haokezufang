import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    // 每次打开都传来默认值
    moreValues: this.props.defaultValues // 选择的条件
  }
  // 渲染标签
  renderFilters(arr) {
    // 高亮类名： styles.tagActive
    return arr.map(item => {
      let isSelected = this.state.moreValues.indexOf(item.value) !== -1
      return <span
        className={[styles.tag, isSelected ? styles.tagActive : '' ].join(' ')}
        key={item.value}
        onClick={() => {
          // 点击谁就把谁的value追加到moreValues数组里面
          // console.log('点了', item.label)
          // 先赋值新的 操作完成之后 在赋值回去
          let newValues = [...this.state.moreValues]
          // 数组.indexOf(值): 返回下标索引 没有就返回 -1
          let index = newValues.indexOf(item.value)
          if (index === -1) {
            newValues.push(item.value)
          } else {
            // 数组.splice(2,1): 从2索引开始删除1个 即就是删除当前
            newValues.splice(index, 1)
          }
          // console.log('新加的数组', newValues)
          this.setState({
            moreValues: newValues
          })
        }}
      >
        { item.label }
      </span>
    })
  }

  render() {
    console.log('FilterMore的props', this.props)
    let { data } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(data.roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(data.oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(data.floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(data.characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          // cancelText: 取消默认
          cancelText= '清除'
          // 取消不用接受传来 就是清除而已
          onCancel={() => {
            // 去电刚刚所有选择的 即重置为空数组
            this.setState({
              moreValues: []
            })
          }}
          onSave={() => {
            this.props.onSave(this.state.moreValues)
          }}
        />
      </div>
    )
  }
}
