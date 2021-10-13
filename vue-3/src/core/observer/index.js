import Dep from "./dep"

export default class Observer {
  constructor(data) {
    this.data = data

    // 数据劫持
    this.walk(this.data)
  }

  // 遍历对象完成数据劫持
  walk(data) {
    if (!data || typeof data !== 'object') return 

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  /**
   * 设置响应式数据
   * @param {*} data 
   * @param {*} key 
   * @param {*} value 
   */
  defineReactive(data, key, value) {
    let dep = new Dep()
    Object.defineProperty(data, key, {
      enumerale: true,
      configurable: false,
      set: (newVal) => {
        console.log('data set: ', key)
        value = newVal
        dep.notify()
      },
      get: () => {
        console.log('data get: ', key)
        if (Dep.target) dep.addSub(Dep.target)
        return value
      }
    })
    this.walk(value)
  }
}