/**
 * 原始文件数据
 */

import DetectFileEncoding from 'detect-file-encoding-and-language'
import { createTextBlob } from './utils'

export default class RawFile {
  constructor(src: Blob | File | string, name = '') {
    this.name = name
    if (typeof src === 'string') {
      // this.blob = createTextBlob(src)
      this.blob = new Blob()
      this._encoding = 'UTF-8'
      this._textCache = src
      return this
    }
    if (src instanceof File)
      this.name = src.name
    this.blob = src
  }

  readonly blob: Blob
  name = ''

  private _encoding?: string
  get encoding() {
    if (!this._encoding)
      this._encoding = ''

    return this._encoding
  }

  set encoding(newEncoding: string) {
    this._encoding = newEncoding
    this._textCache = undefined
  }

  /** 根据blob数据，推测文件编码 */
  async detectEncoding() {
    const enc = (await DetectFileEncoding(this.blob)).encoding as string
    if (!enc)
      throw new TypeError(`无法识别文件${this.name}的编码。`)
    this.encoding = enc
    return enc
  }

  /** 把blob数据读取成字符串 */
  async readBlob(): Promise<string> {
    const encoding = this.encoding
    if (encoding === 'UTF-8') {
      this._textCache = await this.blob.text()
      return this._textCache
    }
    return new Promise<string>((res, rej) => {
      const reader = new FileReader()

      reader.readAsText(this.blob, encoding)
      reader.onload = () => {
        const resultText = reader.result as string
        this._textCache = resultText
        res(resultText)
      }
      reader.onerror = () => {
        rej(reader.error)
      }
    })
  }

  /** 获取缓存的文本 */
  async getText() {
    // 没有缓存则生成一个新的
    if (!this._textCache) {
      // 没有编码则重新检测
      if (!this._encoding)
        await this.detectEncoding()
      await this.readBlob()
    }
    return this._textCache!
  }

  private _textCache?: string

  async getBytes() {
    if (!this._bytesCache) {
      const blobbuffer = await this.blob.arrayBuffer()
      this._bytesCache = new Uint8Array(blobbuffer)
    }
    return this._bytesCache
  }

  // 二进制不在乎文件编码
  private _bytesCache?: Uint8Array
}
