# 形码盒子贡献指南
形码盒子是纯网页应用（SPA），用于字词型的输入方案。主要功能包括编辑码表、转换码表、测评码表。

本 github 仓库里没有一些码表文件，辅助脚本和单元测试会报错，这是因为担心仓库的体积过大以及侵犯到码表作者的权利。无碍，跳过即可。

## 依赖的包
几个重要的包：
- Vue.js -- 功能、性能、生态（特别是 **国内** 生态）俱佳的前端框架。此外还用了 vue3 官方的 vue-router、pinia。
- Quasar framework -- 谷歌风格的组件库，高性能、有响应式设计、体积较小，含有多种方便的小功能。
- Rspack -- 字节跳动推出的打包器，用 rust 语言重写的 webpack，性能强悍，编译产物支持 `file://` 协议。
- `@antfu/eslint-config` -- 这套规则由 Vue 团队的大佬 Anthony Fu 维护。规则较严格，有代码格式化功能，可替代 Prettier。
- `vitest` -- 作者也是 Anthony Fu，使用方便。
- `vueuse` -- vue3 的组合式函数工具库。作者仍旧是 Anthony Fu。
- `chart.js` -- 基于 canvas 的图表库，体积小，功能足够。

## 设计思路

输入法圈子人很少，而这个工具的用户更是百里挑一。设计程序时要优先考虑熟练用户：
- 功能全面（意味着允许编写自定义 JS 代码）
- 信息丰富，便于截图（杂乱些也无妨）
- 支持 file 协议，方便在所有操作系统上离线使用。
- 移动设备的响应式设计
- 操作反馈及时
- 导出配置

### 偷懒儿

开发精力有限，形码盒子不可能媲美大公司的成熟产品，只好放弃一些功能，例如：

- 因为用户几乎都用简体中文，所以可以不用考虑 i18n
- 无需严格遵守无障碍要求
- 不打算添加深色模式，不会有华丽的动画、艺术性的视觉设计等
- 不考虑兼容旧的浏览器
- 不添加算码功能，应该使用 chaifen.app 网站
- 不写 E2E 测试
- 没有服务器，不能登录账号、同步数据等联网功能

## 代码规范
本项目遵循 `@antfu/eslint-config` 的 eslint 规则。建议使用 vscode 编写，安装 eslint 扩展，这时候有 lint 提示，而且保存代码文件时，会自动格式化。

项目遵守 [Vue.js style guide](https://vuejs.org/style-guide/)。目录名、文件名用全小写的 kebab-case。

形码盒子要在 file 协议下运行，要留意：
- 不能用 fetch 或 XMLHttpRequest，而是用 JSONP 动态载入
- 数据放在 js 文件里，再 `await import('./foo.js')`
- 避免用网页的绝对路径，所以尽量交给打包器处理
- 不能用 web worker
- 只能用 vue-router 的 HashRouter 模式

### 目录结构
- `./docs` 开发者的文档
- `./src` 主要源码
- `./src/libs` 算法部分，有单元测试
- `./src/pages` vue-router 会导入其中的组件。相关页面强关联的子组件也会放在此处
- `./src/layouts` 可复用的布局组件
- `./src/components` 可复用的其他组件
- `./src/assets` 可复用的资源文件
- `./src/stores` pinia 仓库
- `./src/router` vue-router 配置

### 测试
`./src/libs` 下的算法是 TDD 开发的，先用 vitest 写单测。

而端到端测试不写了，改为手动尝试。

### 术语
代码中的标识符部分借鉴了 rime，也有部分使用了拼音。

`./docs` 目录下的其他文档会详细说明各模块的技术原理。源码的注释里有许多细节信息。