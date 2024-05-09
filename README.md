# 形码盒子

分析和制作汉字形码输入方案的网页工具合集。访问 [yb6b 的网站](https://yb6b.github.io/)，既可使用。也可下载压缩包，解压后双击 `index.html` 文件。

## 主要功能
### 测评
- [x] 科学形码测评系统
- [ ] 组词能力测评系统
- [ ] 码表基础数据
- [ ] 赛码器

### 编辑
- [ ] 常用平台的格式转换
- [ ] 造词工具

## 编译
1. clone 本仓库
2. 进入仓库后， `pnpm i` 安装依赖
3. 用 `pnpm dev` 可 HRM 预览网页
4. `pnpm build` 编译网站。`./dist/spa/`目录下就是编译产物，可以在 `file://` 协议下运行

## 参与贡献
请阅读 `./docs` 目录下的文档。

## 依赖
本项目使用了 [Quasar](https://quasar.dev/) 框架、[Rspack](https://rspack.org/zh/) 打包器以及其他开源的 npm 项目。

## License
Under [GPL 2.0](LICENSE).
