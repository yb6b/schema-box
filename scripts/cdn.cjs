const fs = require('node:fs')
const path = require('node:path')

const resolve = p => path.resolve(__dirname, p)
const htmlPath = resolve('../dist/spa/index.html')
const content = fs.readFileSync(htmlPath, { encoding: 'utf-8' })
const newContent = content.replace(/<base href=.+\/ >/, '')
fs.writeFileSync(htmlPath, newContent, { encoding: 'utf-8' })
