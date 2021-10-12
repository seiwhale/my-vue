function parseAttr(attr_str) {
  if (!attr_str) return []

  let isInQuote = false;
  let point = 0;
  let result = []

  for (let i = 0; i < attr_str.length; i++) {
    const char = attr_str[i];

    if (char === '"') {
      isInQuote = !isInQuote
    } 
    if ((char == ' ' || i === attr_str.length - 1) && !isInQuote) {
      const attr = attr_str.slice(point, i === attr_str.length - 1 ? i + 1 : i)
      if (attr) {
        result.push(attr.trim())
        point = i
      }
    }
    
  }

  return result.map(attr => {
    // const [name, value] = attr.split("=");
    // return { name, value: value.slice(1, value.length) }
    const [, name, value] = attr.match(/^(.+)="(.+)"$/);
    return { name, value }
  })
}


export default (template, options) => {

  let index = 0, rest = '', stack1 = [], stack2 = [{children: []}];
  const startTagExp = /^\<([a-zA-Z]+\d*)(\s[^\<]+)?\>/,
        endTagExp = /^\<\/([a-zA-Z]+\d*)\>/,
        wordRegExp = /^([^\<]+)\<\/([a-zA-Z]+\d*)\>/;

  while(index < template.length - 1) {
    // console.log(template[index])
    rest = template.slice(index)

    
    // 是否为开始标签
    if (startTagExp.test(rest)) {
      let tag = rest.match(startTagExp)[1]
      let attrs = rest.match(startTagExp)[2]
      const attrs_len = attrs ? attrs.length : 0
      
      stack1.push(tag)
      stack2.push({ tag, attrs: parseAttr(attrs), children: [], type: 1 })
      
      index += tag.length + 2 + attrs_len
      console.log('检测到开始标签', tag)
    } else if (endTagExp.test(rest)) {
      let tag = rest.match(endTagExp)[1]
      index += tag.length + 3

      if (tag == stack1[stack1.length - 1]) {
        stack1.pop()
        const pop_children = stack2.pop()
        stack2[stack2.length - 1].children.push(pop_children)
      } else {
        throw new Error(stack1[stack1.length - 1] + '标签未闭合')
      }

      console.log('检测到结束标签', tag)
    } else if (wordRegExp.test(rest)) {
      let word = rest.match(wordRegExp)[1]
      if (!/^[\s\n\t]+$/.test(word)) {
        console.log('检测到文本', word)
        stack2[stack2.length - 1].children = [{ text: word, type: 3 }]
      }
      index += word.length
    } else {
      index++;
    }
  }

  console.log(stack2[0].children)
  
  return template

}