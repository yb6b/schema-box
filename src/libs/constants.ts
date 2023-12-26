/**
 * 公认的基础数据
 */

/** 当量数据包含的键位, 不含包括空格 */
export const KEYS_MAIN = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-[\'=]'
/** 不需要按shift键的键位 */
export const KEYS_NO_SHIFT = `${KEYS_MAIN}\\\``

/** 要按shift才能打出的，与 KEYS_NO_SHIFT 一一对应 */
export const KEYS_SHIFT = `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK<(OL>)P:?_{"+}|~`

/** 特殊功能的按键：空格、shift、BackSpace、Tab、Enter */
export const KEYS_UNO = ' ↑←→↩'

/** 按shift键才能打出的字，映射回来 */
export const KEYS_TO_LOWER = /* #__PURE__ */makeKeyToLower()

/** 所有能用的按键 */
export const KEYS = KEYS_NO_SHIFT + KEYS_UNO

export const KEYS_ALL = KEYS + KEYS_SHIFT

function makeKeyToLower() {
  const result: Record<string, string> = {}
  for (let i = 0; i < KEYS_SHIFT.length; i++)
    result[KEYS_SHIFT[i]] = KEYS_NO_SHIFT[i]
  return result
}
