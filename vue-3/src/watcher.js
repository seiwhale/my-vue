import Dep from "./dep"

let $uid = 0

export default class Watcher {
  constructor(exp, ctx, cb) {
    this.exp = exp
    this.ctx = ctx
    this.cb = cb
    this.uid = $uid++

    this.update()
  }

  /**
   * 计算表达式
   */
  get() {
    Dep.target = this
    let value = Watcher.computeExpression(this.exp, this.ctx)
    Dep.target = null
    return value
  }

  /**
   * 完成回调函数的调用
   */
  update() {
    let newVal = this.get()
    this.cb && this.cb(newVal)
  }

  /**
   * 静态函数 计算表式
   * @param {*} exp 
   * @param {*} ctx 
   */
  static computeExpression(exp, ctx) {
    // with 指定作用域
    let fn = new Function("scope", "with(scope){return " + exp + "}")
    return fn(ctx)
  }
}