/**
 * 公认的基础数据
 */

/** 不需要按shift键的键位 */
export const KEYS_NO_SHIFT = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-[\'=]\`'

/** 要按shift才能打出的，与 KEYS_NO_SHIFT 一一对应 */
export const KEYS_SHIFT = `!QAZ@WSX#EDC$RFV%TGB^YHN&UJM*IK<(OL>)P:?_{"+}|~`

/** 特殊功能的按键：空格、shift、BackSpace、Tab、Enter */
export const KEYS_UNO = ' ↑←→↩'

/** 所有能用的按键 */
export const KEYS = KEYS_NO_SHIFT + KEYS_UNO

export const KEYS_ALL = KEYS + KEYS_SHIFT
