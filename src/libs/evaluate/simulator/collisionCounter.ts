/**
 * 统计重码
 */

// 计算出 非极速赛码表 的重码
export class CollisionCounter {
  private usedCodes = new Map<string, number>()

  /**
   * 获取某个编码的选重数
   * @param code 编码
   * @returns 选重数，没有数据返回 0
   */
  public get(code: string) {
    return this.usedCodes.get(code) ?? 0
  }

  /** 统计到的最大选重数 */
  public max = 0

  /**
   * 向数据库里添加一条编码
   * @param code 新的编码
   * @returns 当前编码的重码位
   */
  public add(code: string) {
    const oldCollision = this.usedCodes.get(code)
    const newCollision = oldCollision ? oldCollision + 1 : 1
    this.usedCodes.set(code, newCollision)
    if (newCollision > this.max)
      this.max = newCollision
    return newCollision
  }

  /**
   * 从数据库里去除一则编码数据
   * @param code 要删一条编码
   * @returns 当前编码还剩的重码数，无数据则返回0
   */
  public delete(code: string) {
    const oldCollision = this.usedCodes.get(code)

    if (!oldCollision)
      return 0

    if (oldCollision === 1)
      this.usedCodes.delete(code)
    else
      this.usedCodes.set(code, oldCollision - 1)
    this.remax()
    return oldCollision - 1
  }

  /** 重新计算max值 */
  private remax() {
    let m = 0
    for (const c of this.usedCodes.values()) {
      if (c > m)
        m = c
    }
    this.max = m
  }
}

/**
 * 从极速赛码表的编码中，计算出重码
 * @param code 赛码表的编码
 * @returns 去除选重后的编码，以及重码数
 */
export function getJisuCollision(code: string): { code: string; collision: number } {
  // 空格是一重
  if (code[code.length - 1] === '_')
    return { code, collision: 1 }
    // 数字结尾的，有选重结果
  const pattern = /\d+$/
  const regexResult = pattern.exec(code)
  if (regexResult) {
    return {
      code: code.slice(0, regexResult.index),
      collision: Number.parseInt(regexResult[0]),
    }
  }
  // 没有尾缀的，也是一重
  return { code, collision: 1 }
}
