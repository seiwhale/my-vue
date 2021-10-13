import { parseHTML } from "./html-parser";
import { createAttrsMap } from "../../utils/helper";
import { parseText } from "./text-parser";

/**
 * 解析模版字符串
 * @param {*} template 模版字符串
 * @returns AST 抽象语法树
 */
export function parse(template) {
  // 返回的 ast
  let root;
  // 当前元素的父元素
  let currentParent;
  // 用于辅助生成 AST 的临时堆栈
  let stack = [];

  parseHTML(template, {
    // 开始标签
    start: (tag, attrs, unary) => {
      // 创建 AST 元素
      // type 为 1 时为元素节点
      let element = {
        tag,
        type: 1,
        attrsList: attrs,
        attrsMap: createAttrsMap(attrs),
        parent: currentParent,
        children: []
      }

      // TODO 属性处理

      // 第一次进入则为根节点
      if (!root) root = element

      if (currentParent) {
        // 如果有父节点，则把当前元素添加至父级元素的 children 中
        currentParent.children.push(element)
      }

      // 不是单标签
      if (!unary) {
        currentParent = element;
        stack.push(element)
      }
    },
    // 结束标签
    end: () => {
      // stack 删除栈顶元素
      stack.pop()
      // 设置 currentParent
      currentParent = stack[stack.length - 1]
    },
    // 文本
    chars: (text) => {
      if (!currentParent) return 

      const children = currentParent.children;

      // 将 text 转为可执行的表达式
      let expression = parseText(text)

      if (text.trim()) children.push({
        // type 为 2 时为文本节点
        type: 2,
        text: text,
        expression: expression
      })

    }
  })

  return root;
}
