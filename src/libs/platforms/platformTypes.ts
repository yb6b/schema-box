import DetectFileEncoding from 'detect-file-encoding-and-language'
import type { Schema } from '../schema'

export * from '../schema'

export type Platforms = 'duoduo' | 'yong' | 'rime'

export interface LoadSchema {
  (src: RawFileData): Promise<Schema>
}

// 默认码表数据 转回 字符串
export interface DumpSchema {
  (src: Schema): Blob
}

// 推测码表的类型
export interface ValidateSchema {
  (src: RawFileData): Promise<boolean>
}

export class FormatError extends Error {}

/** 每个原始文件的数据 */
export class RawFileData {
  constructor(
    public blob: Blob,
    public name = '',
    public encoding = '',
  ) {}

  private __textCache?: string
  async getText() {
    if (!this.__textCache) {
      let encoding: string

      if (!this.encoding) { encoding = this.encoding }
      else {
        encoding = (await DetectFileEncoding(this.blob)).encoding as string
        if (!encoding)
          throw new TypeError('无法识别文件的编码。')
      }

      this.__textCache = (await readBlobByEncoding(this.blob, encoding)).trim()
    }
    return this.__textCache
  }

  async reGetText() {
    this.__textCache = ''
    return this.getText()
  }

  private __bytesCache?: Uint8Array
  async getBytes() {
    if (!this.__bytesCache) {
      const blobbuffer = await this.blob.arrayBuffer()
      this.__bytesCache = new Uint8Array(blobbuffer)
    }
    return this.__bytesCache
  }
}

async function readBlobByEncoding(src: Blob, encoding = 'UTF-8') {
  if (encoding === 'UTF-8')
    return await src.text()
  return new Promise<string>((res, rej) => {
    const reader = new FileReader()
    reader.readAsText(src, encoding)
    reader.onload = () => {
      res(reader.result as string)
    }
    reader.onerror = () => {
      rej(reader.error)
    }
  })
}
