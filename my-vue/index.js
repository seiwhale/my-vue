/**
 * MyVue
 * @version     v1.0.0
 * @author      ShiJieLi
 * @overview    手动实现一个简单的vue
 */
class Vue {
  // 构造函数-数据的初始化
  constructor(options = {}) {
    this.$el = document.querySelector(options.el);
    let data = this.data = options.data;
    // 代理data使用能直接使用this.xxx访问
    Object.keys(data).forEach(key => {
      this.proxyData(key);
    })
    // 事件方法
    this.methods = options.methods;
    // 需要监听的任务列表
    this.watcherTask = {}; 
    // 初始化劫持监听所有数据
    this.observer(data); 
    // 解析dom
    this.compile(this.$el); 
  }
  // 数据代理
  proxyData(key) {
    let _ = this;
    Object.defineProperty(_, key, {
      enumerable: true,     // 可枚举--可被for-in和Object.keys()枚举。
      configurable: false,  // 目标属性不能被删除和不能修再被改特性
      get () {
        return _.data[key];
      },
      set (newVal) {
        _.data[key] = newVal
      }
    })
  }
  // 劫持监听所有数据
  observer(data) {
    let _ = this;
    Object.keys(data).forEach(key => {
      let value = data[key];
      this.watcherTask[key] = [];
      Object.defineProperty(data, key, {
        enumerable: true,
        configurable: false,
        get () {
          return value
        },
        set (newVal) {
          if (newVal !== value) {
            value = newVal
            _.watcherTask[key].forEach(task => {
                task.update()
            })
          }
        }
      })
    })
  }
  // 解析DOM
  compile(el) {
    var nodes = el.childNodes;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.nodeType === 3) {  // 文本节点
        var text = node.textContent.trim();
        if (!text) continue;
        this.compileText(node, 'textContent')   
      } else if (node.nodeType === 1) { // 元素节点
        if (node.childNodes.length > 0) {
          this.compile(node)
        }
        // v-model
        if (node.hasAttribute('v-model') && (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA')) {
          node.addEventListener('input', (() => {
            let attrVal = node.getAttribute('v-model');
            this.watcherTask[attrVal].push(new Watcher(node, this, attrVal, 'value'))
            node.removeAttribute('v-model')
            return () => {
              this.data[attrVal] = node.value
            }
          })())
        }
        // v-html
        if (node.hasAttribute('v-html')) {
          let attrVal = node.getAttribute('v-html');
          this.watcherTask[attrVal].push(new Watcher(node, this, attrVal, 'innerHTML'))
          node.removeAttribute('v-html')
        }
        this.compileText(node, 'innerHTML')
        // 点击事件 
        if (node.hasAttribute('@click')) {
          let attrVal = node.getAttribute('@click')
          node.removeAttribute('@click')
          node.addEventListener('click', e => {
            this.methods[attrVal] && this.methods[attrVal].bind(this)()
          })
        }
      }
    }
  }
  // 解析DOM双花括号的操作
  compileText(node, type) {
    let reg = /\{\{(.*?)\}\}/g, txt = node.textContent;
    if (reg.test(txt)) {
      node.textContent = txt.replace(reg, (matched, value) => {
        let tpl = this.watcherTask[value] || []
        tpl.push(new Watcher(node, this, value, type, txt))
        if (value.split('.').length > 1) {
          let v = null
          value.split('.').forEach((val, i) => {
            v = !v ? this[val] : v[val]
          })
          return v
        } else {
          return this[value]
        }
      })
    }
  }
}

// 更新视图操作
class Watcher{
  constructor(el, vm, value, type, text) {
    this.el = el;
    this.vm = vm;
    this.value = value;
    this.type = type;
    this.text = text;
    this.update()
  }
  update() {       
    let reg = /\{\{(.*?)\}\}/g, txt = this.vm.data[this.value];
    this.el[this.type] = this.text ? this.text.replace(reg, () => txt) : txt
  }
}