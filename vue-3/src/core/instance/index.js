/**
 * 仿 Vue1.x MVVM
 */

import Compiler from "../../compiler"
import Observer from "../observer"


export default class Vue {
  constructor(options) {
    console.log('options: ', options)
    // 获取 DOM 节点
    this.$el = document.querySelector(options.el)
    // 转存数据
    this.$data = options.data || {}
    // 数据和方法代理
    this._proxyData(this.$data)
    this._proxyMethods(options.methods)
    // 数据劫持
    new Observer(this.$data)
    // 模板编译
    new Compiler(this)

  }

  /**
   * 数据代理
   * @param {*} data 
   */
  _proxyData(data) {
    Object.keys(data).forEach((key) => {
      Object.defineProperty(this, key, {
        set: (newVal) => {
          data[key] = newVal
        },
        get: () => {
          return data[key]
        }
      })
    })
  }

  /**
   * 方法代理
   * @param {*} methods 
   */
  _proxyMethods(methods) {
    if (methods && typeof methods === 'object') {
      Object.keys(methods).forEach(method => {
        this[method] = methods[method]
      })
    }
  }
}

window.Vue = Vue