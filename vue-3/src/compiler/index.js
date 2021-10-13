import Watcher from "../core/observer/watcher"
import { parse } from './parser'

export default class Compiler {
  constructor(ctx) {
    this.ctx = ctx
    this.$el = ctx.$el

    if (this.$el) {
      let ast = parse(this.$el.outerHTML)
      console.log('ast:', ast)
      // 转化为文档片段
      this.$fragment = this.nodeToFragment(this.$el)
      // 模板编译
      this.compile(this.$fragment)
      // 追加到页面
      this.$el.appendChild(this.$fragment)
    }
  }

  /**
   * 把元素转为文档片段
   */
  nodeToFragment(node) {
    let childNodes = node.childNodes
    let fragment = document.createDocumentFragment()

    if (childNodes && childNodes.length) {
      childNodes.forEach(childNode => {
        if (!this.ignorable(childNode)) {
          fragment.appendChild(childNode)
        }
      })
    }

    return fragment
  }

  /**
   * 是否忽略当前节点
   * @param {*} node 
   */
  ignorable(node) {
    /**
     * nodeType
     *  - 3 文本节点
     *  - 8 注释
     */  
    const reg = /^[\t\n\r]+/;
    return node.nodeType === 8 || (node.nodeType === 3 && reg.test(node.textContent))
  }

  /**
   * 模板编译
   * @param {*} node 
   */
  compile(node) {
    let childNodes = node.childNodes
    
    childNodes.forEach(childNode => {
      if (!this.ignorable(childNode)) {
        if (childNode.nodeType === 1) {
          // 元素节点
          this.compileElementNode(childNode)
        } else if (childNode.nodeType === 3) {
          // 文本节点
          this.compileTextNode(childNode)
        }
      }
    })
  }

  /**
   * 编译元素节点
   * @param {*} node 
   */
  compileElementNode(node) {
    let atts = [...node.attributes]
    let self = this

    atts.forEach(attr => {
      let { name: attrName, value: attrValue } = attr;

      // 指令
      if (attrName.indexOf('v-') === 0) {
        let dirName = attrName.slice(2)

        switch(dirName) {
          case 'text':
            new Watcher(attrValue, this.ctx, (newVal) => {
              node.textContent = newVal
            })
            break
          case 'model':
            new Watcher(attrValue, this.ctx, (newVal) => {
              node.value = newVal
            })

            node.addEventListener('input', (e) => {
              self.ctx[attrValue] =  e.target.value
            })
            break
        }
      }

      // 事件
      if (attrName.indexOf('@') === 0) {
        this.compileMethod(node, attrName, attrValue)
      }
    })
    
    this.compile(node)
  }
  
  compileMethod(node, attr_name, attr_value) {
    let type = attr_name.slice(1)
    let fn = this.ctx[attr_value]

    node.addEventListener(type, fn.bind(this.ctx))
  }

  /**
   * 编译文本节点
   * @param {*} node 
   */
  compileTextNode(node) {
    let text = node.textContent;

    if (text) {
      // 将 text 转化为表达式
      let exp = this.parseTextExp(text)
      // 添加订阅者 计算表达式
      new Watcher(exp, this.ctx, (newVal) => {
        node.textContent = newVal
      })

    }
  }

  /**
   * 将文本转化为表达式
   * @param {*} text 
   */
  parseTextExp(text) {
    let reg = /\{\{(.+?)\}\}/g
    // 表达式的拼接内容
    let pieces = text.split(reg)
    // 匹配到的表达式
    let matches = text.match(reg)
    // 表达式数组
    let tokens = []

    pieces.forEach(piece => {
      if (matches && matches.indexOf("{{" + piece + "}}") > -1) {
        tokens.push("(" + piece + ")")
      } else {
        tokens.push("`" + piece + "`");
      }
    })

    return tokens.join("+")
  }
}