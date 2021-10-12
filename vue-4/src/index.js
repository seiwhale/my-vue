import parse from './parse'

var template = `
  <div>
    <h3 class="hello">你好</h3>
    哈哈哈
    <ul>
      <li key="tiyu">体育</li>
      <li key="yuwen">语文</li>
      <li key="shuxue">数学</li>
      <li key="yingyu">英语</li>
    </ul>
  </div>
  <p>牛逼</p>
`

const ast = parse(template);

// console.log(ast)