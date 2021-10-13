/**
 * 判断是否为单标签
 * @param {*} tagName 标签名
 */
export const isUnarytag = (tagName) => {
  const unaryTags =
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,link,meta,param,source,track,wbr'
  return unaryTags.split(',').includes(tagName)
}

/**
 * 转化属性数组为 Map
 * @param {*} attrs 标签属性
 */
export const createAttrsMap = (attrs) => {
  let map = {}
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i]
    map[attr.name] = attr.value
  }

  return map
}
