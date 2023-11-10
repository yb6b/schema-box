// 编码只用到主键盘区里用不到shift的字母，数字，符号。还包括 空格键_ 和 shift 引导键, Backspace, Tab, Return
export const ALL_KEYS = '1qaz2wsx3edc4rfv5tgb6yhn7ujm8ik,9ol.0p;/-[\'=]\\_`↑←→↩'

interface PunctuationsData {
  uni: Record<string, string>
  cn: Record<string, string>
  en: Record<string, string>
}
export const PUNCTUATIONS: PunctuationsData = {
  // 中英文都能打出的字符
  uni: {
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
    '=': '=',
    '+': '↑=',
    '-': '-',
    '~': '↑`',
    '@': '↑2',
    '%': '↑5',
    '#': '↑3',
    '&': '↑7',
    '*': '↑8',
    ' ': '_', // 空格
    '\n': '↩', // 换行
    '\r\n': '↩', // 换行
    '\r': '↩', // 换行
    '\t': '→', // Tab符
  },
  // 常见的中文标点
  cn: {
    '·': '`',
    '——': '↑-',
    '—': '↑-←',
    '‘': '\'',
    '’': '\'',
    '“': '↑\'',
    '”': '↑\'',
    '……': '↑6',
    '…': '↑6←',
    '、': '/',
    '。': '.',
    '《': '↑,',
    '》': '↑.',
    '【': '[',
    '】': ']',
    '！': '↑1',
    '（': '↑9',
    '）': '↑0',
    '，': ',',
    '：': '↑;',
    '；': ';',
    '？': '↑/',
    '￥': '↑4',
  },
  // 需要切换成英文模式后才能打出的英文符号
  en: {
    '\'': '\'',
    ',': ',',
    '.': '.',
    '/': '/',
    '\\': '\\',
    '[': '[',
    ']': ']',
    '`': '`',
    'a': 'a',
    'b': 'b',
    'c': 'c',
    'd': 'd',
    'e': 'e',
    'f': 'f',
    'g': 'g',
    'h': 'h',
    'i': 'i',
    'j': 'j',
    'k': 'k',
    'l': 'l',
    'm': 'm',
    'n': 'n',
    'o': 'o',
    'p': 'p',
    'q': 'q',
    'r': 'r',
    's': 's',
    't': 't',
    'u': 'u',
    'v': 'v',
    'w': 'w',
    'x': 'x',
    'y': 'y',
    'z': 'z',
    '{': '↑[',
    '}': '↑]',
    '^': '↑6',
    '_': '↑-',
    ':': '↑;',
    ';': ';',
    '<': '↑,',
    '>': '↑.',
    '?': '↑/',
    'A': '↑a',
    'B': '↑b',
    'C': '↑c',
    'D': '↑d',
    'E': '↑e',
    'F': '↑f',
    'G': '↑g',
    'H': '↑h',
    'I': '↑i',
    'J': '↑j',
    'K': '↑k',
    'L': '↑l',
    'M': '↑m',
    'N': '↑n',
    'O': '↑o',
    'P': '↑p',
    'Q': '↑q',
    'R': '↑r',
    'S': '↑s',
    'T': '↑t',
    'U': '↑u',
    'V': '↑v',
    'W': '↑w',
    'X': '↑x',
    'Y': '↑y',
    'Z': '↑z',
    '!': '↑1',
    '"': '↑\'',
    '$': '↑4',
    '(': '↑9',
    ')': '↑0',
  },
}

/**
 * 验证编码是否合规
 * @param code 待验证的编码
 * @returns 能否成功
 */
export function validateCodes(code: string) {
  const ALL_KEYS_SET = new Set(ALL_KEYS)
  for (let i = 0; i < code.length; i++) {
    if (!ALL_KEYS_SET.has(code[i]))
      return false

    // 不能连续两个shift
    if (code[i] === '↑' && code[i + 1] === '↑')
      return false
  }
  return true
}

/**
 * 读取并返回一个方案编码字符串
 * @throws 不合规的编码报错
 */
export function checkCodes(code: string) {
  const ALL_KEYS_SET = new Set(ALL_KEYS)
  for (let i = 0; i < code.length; i++) {
    if (!ALL_KEYS_SET.has(code[i]))
      throw new TypeError(`${code} 中的第 ${i + 1} 个字母不是合规的编码。`)

    // 不能连续两个shift
    if (code[i] === '↑' && code[i + 1] === '↑')
      throw new TypeError(`${code} 中的第 ${i + 1} 处不能含有两个shift键。`)
  }
  return code
}
