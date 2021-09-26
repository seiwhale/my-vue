import { observer } from './Observer'
import Compile from './compile'

export default class vueImitate {
  constructor (options) {
    this.options = options || {};
    this.el = document.querySelector(options.el || 'body');
    this.data = typeof options.data === 'function' ? options.data() : options.data;
    this.methods = options.methods;
    // 指令
    this._directives = [];
    // 初始化数据-数据代理
    this.initData();
    // 初始化劫持监听所有数据
    observer(this.data); 
    // 解析 DOM
    this.compile();
  }

  initData() {
    let data = this.data, _ = this;

    Object.keys(data).forEach((key) => {
      Object.defineProperty(_, key, {
        enumerable: true,
        configurable: false,
        set (newVal) {
          data[key] = newVal;
        },
        get () {
          return data[key]
        }
      })
    })
  }
}

Compile(vueImitate);
