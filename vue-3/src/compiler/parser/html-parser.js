import {
  startTagOpenRegExp,
  startTagCloseRegExp,
  endTagRegExp,
  commentRegExp,
  attributeRegExp,
} from '../../utils/constants'
import { isUnarytag } from '../../utils/helper'

/**
 * 解析 HTML 模板
 * @param {*} template 模版字符串
 * @param {*} options 回调函数
 */
export function parseHTML(template, options) {
  // 存放开始标签和属性
  // 当找到对应的结束标签时，则说明html格式正确
  // 当未找到对应的结束标签时， 则 报错 提示用户
  let stack = []
  let html = template,
    index = 0

  while (html) {
    const textStart = html.indexOf('<')

    if (textStart === 0) {
      // 注释
      if (html.match(commentRegExp)) {
        const commentEnd = html.indexOf('-->')
        if (commentEnd >= 0) {
          // 匹配到注释
        }
        // 截取掉注释字符串
        advance(commentEnd + 3)
      }

      // 开始标签
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
      }

      // 结束标签
      const endTagMatch = html.match(endTagRegExp)
      if (endTagMatch) {
        handleEndtag(endTagMatch)
      }
    }

    let text = ''
    if (textStart > 0) {
      text = html.slice(0, textStart)
      advance(textStart)
    }

    if (textStart < 0) {
      text = html
      html = ''
    }

    // 处理文本
    options.chars && options.chars(text)

    // break
  }

  /**
   * 匹配开始标签
   * @returns {*} 标签名 & 属性等自定义内容
   */
  function parseStartTag() {
    const start = html.match(startTagOpenRegExp)
    if (start) {
      let match = {
        tagName: start[1],
        attrs: [],
        start: index,
      }

      advance(start[0].length)

      // 匹配开始标签的结束符号
      // 匹配到则结束
      // 未匹配到则匹配属性
      let end, attr
      while (
        !(end = html.match(startTagCloseRegExp)) &&
        (attr = html.match(attributeRegExp))
      ) {
        match.attrs.push(attr)
        advance(attr[0].length)
      }

      if (end) {
        // 自闭和标签 end[1] 为 '/', 否则为 ''
        match.isUnary = end[1]
        match.end = index
        advance(end[0].length)
      }

      return match
    }
  }

  /**
   * 处理结束标签
   * @param {*} tagName 标签名称
   */
  function handleEndtag(match) {
    let tagName = match[1]

    let poi = 0,
      lowerCaseTag
    if (tagName) {
      lowerCaseTag = tagName.toLowerCase()
      // 从 stack 栈顶查找对应的标签
      for (poi = stack.length - 1; poi >= 0; poi--) {
        const element = stack[poi]
        if (element.lowerCaseTag === lowerCaseTag) {
          break
        }
      }
    }

    // 检查找到的标签是否为顶部标签，不是则警告
    if (poi >= 0) {
      for (let i = stack.length - 1; i >= poi; i--) {
        const element = stack[i]
        if (i > poi || !tagName) {
          console.warn(`Tag <${element.tagName}> has no matching tag.`)
        }
      }
      options.end && options.end()
      stack.length = poi
    }

    advance(match[0].length)
  }

  /**
   * 处理匹配到的开始标签
   * 把当前元素push到stack中
   * 调用回调函数
   * @param {*} match 匹配到的开始标签自定义结果
   */
  function handleStartTag(match) {
    let tagName = match.tagName
    let unaryTag = match.isUnary
    let attrs = []
    // 是否为单标签
    let isUnary = isUnarytag(tagName) || !!unaryTag
    attrs.length = match.attrs.length

    for (let i = 0; i < attrs.length; i++) {
      const attr = match.attrs[i]
      attrs[i] = {
        name: attr[1],
        value: attr[3] || attr[4] || attr[5],
      }
    }

    if (!isUnary) {
      stack.push({
        attrs,
        tag: tagName,
        lowerCaseTag: tagName.toLowerCase(),
      })
    }

    options.start && options.start(tagName, attrs, isUnary)
  }

  /**
   * 截取 html 字符串
   * @param {*} n 所要截取字符的长度
   */
  function advance(n) {
    index += n
    html = html.substring(n)
  }

  console.log(html)
}
