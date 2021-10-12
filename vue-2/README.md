## VUE IMITATE

> 分析和了解Vue实现原理，实现简单的vue双向数据绑定及指令，通过该项目，开发者可以更好地了解Vue作用机理。项目包含两个例子，项目my-vue文件为例子1，其余文件为例子2。注意：该项目只用于学习，不可用作开发（未进行异常处理）。

### 项目截图

![vue-imitate](https://cdn.jsdelivr.net/gh/seiwhale/my-vue/assets/vue-imitate.gif)

![my-vue](https://cdn.jsdelivr.net/gh/seiwhale/my-vue/assets/my-vue.gif)

### 项目结构

``` bash
├── README.md                  
├── dist                       // 打包目录
├── assets             		// 静态资源-截图
├── build                      // 配置文件
├── config                     // 环境变量
├── my-vue                     // my-vue源代码
├── src            			// 源代码
│   ├── assets					// 静态资源
│   ├── components             // 组件
│   ├── local         			// 语言包
│   ├── models                	// 数据层
│   ├── router              	// 路由配置文件
│   ├── routes         		// 各级页面
│   ├── services         		// 接口请求
│   ├── style         			// 全局样式基础变量
│   ├── utils         			// 工具包
│   ├── index.js         		// 入口文件
│   └── index.less             // 全局样式
├── .gitignore					// git忽略文件
├── .babelrc					// babel配置文件
└── package.json				// 依赖包
```

### 实现功能

- [x] v-model
- [x] v-bind
- [x] v-text
- [x] v-show
<br>
......

### 项目运行

``` bash
# 克隆项目
git clone https://github.com/seiwhale/my-vue.git
# 安装依赖
npm i
# 启动项目
npm run dev
# 生产环境打包
npm run build
```

### 注意事项

XXX
