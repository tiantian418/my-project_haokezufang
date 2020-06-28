import React, { Component } from 'react'

import { Flex, WingBlank, WhiteSpace, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'

import NavHeader from '../../components/NavHeader'

import styles from './index.module.css'

import { API } from '../../utils/api'

import { withFormik, Form, Field, ErrorMessage } from 'formik'

// 导入yup
import * as Yup from 'yup'
// * as Yup 全部导出 取名 Yup

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
  render () {
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavHeader className={styles.navHeader}>账号登录</NavHeader>
        {/* WhiteSpace 留出一个高度的空白 */}
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          {/* Form 替换form 不用写onSubmit */}
          <Form>
            <div className={styles.formItem}>
              {/* 用户名文本框 react没有 v-model 
              {/* Field 替换文本框 不用写 value onChange 了 */}
              <Field type="text" name="username" placeholder="请输入账号" className={styles.input} ></Field>
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            {/* 用户名错误 有错误就 显示 错误div */}
            {/*name匹配对应错误 component="div" 错误标签显示div
              ErrorMessage 判断有错误才显示
            */}
            <ErrorMessage name="username" className={styles.error} component="div" ></ErrorMessage>
            <div className={styles.formItem}>
              {/* 密码 */}
              <Field type="password" name="password" placeholder="请输入密码" className={styles.input} ></Field>
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            {/* 密码错误 有错误就 显示 错误div   */}
            <ErrorMessage name="password" className={styles.error} component="div" ></ErrorMessage>

            <div className={styles.formSubmit}>
              {/* 点击登录 获取用户名密码 发送请求 去登录 
                 注意：普通按钮 type="button" 配合绑定 onClick 
                      提交按钮 type="submit" 会提交表单 刷新页面
                              配合form 绑定onSubmit
              */}
              <button className={styles.submit} type="submit" >
                登 录
              </button>
            </div>
          </Form>

          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

//  withFormik({ 表单配置  })(组件)   withFormik就是一个高级组件函数
export default withFormik({
  // 1 替代state 2 会把数据写在组件props上values
  mapPropsToValues: () => {
    // 返回一个对象 
    return {
      username: '', //用户名
      password: '' //密码
    }
  },
  // 2 配置  validationSchema+yup 验证表单 
  //  Yup 是一个专门写好了很多验证的包
  //  不符合 错误在 props上的 errors对象
  validationSchema: Yup.object().shape({
    // 参数:验证  string字符串 required必填
    // 如果你yup写的验证不满足 你还可以自己写 正则表达式
    // 要求 用户名 5-10位  密码 5-12位 自己写 正则表达式
    // .matches(正则,错误提示)
    username: Yup.string().required('用户名必填！').matches(/^\w{5,10}$/, '用户名5-10位'),
    password: Yup.string().required('密码必填！！').matches(/^\w{5,12}$/, '密码5-12位')
  }),
  // 3 handleSubmit 提交的函数
  handleSubmit: async (values, { props }) => {
    // console.log('配置的提交函数', values)
    // values={username: "test2", password: "test2"}
    // 获取用户名密码 发送请求 去登录
    let res = await API.post("/user/login", {
      username: values.username,
      password: values.password
    })
    // console.log('登录结果', res)
    if (res.data.status === 200) { // 登录成功
      // 登录成功提示成功  存token
      Toast.success('登录成功~~', 2)
      localStorage.setItem('my-token', res.data.body.token)
    } else { // 登录失败
      Toast.fail('登录失败啦~~', 2)
    }
  }
})(Login)
