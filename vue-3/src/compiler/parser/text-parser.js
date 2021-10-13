/**
 *  处理表达式
 * @param {*} text
 */
export const parseText = (text) => {
  let textReg = /\{\{(.+?)\}\}/g

  let pieces = text.split(textReg)
  let matches = text.match(textReg)
  let tokens = []

  for (let i = 0; i < pieces.length; i++) {
    const piece = pieces[i]

    if (matches && matches.includes('{{' + piece + '}}')) {
      tokens.push('(' + piece + ')')
    } else {
      tokens.push('`' + piece + '`')
    }
  }

  return tokens.join('+')
}
