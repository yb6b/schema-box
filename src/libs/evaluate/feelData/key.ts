/** 每个按键的手感数据 */
import { KEYS } from '../../constants'
import Data from './keyFeelData'

const dataArray = JSON.parse(Data)
/**
每个手指的索引号，分别是：
|索引号|左右手|手指|
|---|---|---|
|0 | |拇指  |
|1 |左 |小指  |
|2 |左 |无名指|
|3 |左 |中指  |
|4 |左 |食指  |
|5 |左 |拇指  |
|6 |右 |拇指  |
|7 |右 |食指  |
|8 |右 |中指  |
|9 |右 |无名指|
|10|右 |小指  |
 */
export type Fingers = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

interface KeyFeelValue {
  /** 普通键盘上的第几行 */
  row: number
  /**  这个按键是哪根手指. 手指编号见 Fingers 类型 */
  fin: number
}

/** 每个按键的数据，主键盘上51个键。是个对象 */
const keyFeelData: Record<string, KeyFeelValue> = {};

[...KEYS].forEach((v, i) => {
  const magic = dataArray[i]
  keyFeelData[v] = {
    row: magic & 3,
    fin: magic >>> 2,
  }
})

export { keyFeelData }
