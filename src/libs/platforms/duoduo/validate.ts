import { genEachLine } from '../utils'
import type { ValidateSchema } from '../platformTypes'
import { parseDuoduoCodes } from './utils'

export const validateDuoduo: ValidateSchema = async (src) => {
  const text = await src.getText()

  // Match table file header.
  if (text.startsWith('---config@'))
    return true

  let lineNo = 0
  // Match code table
  for (let line of genEachLine(text)) {
    // No need to check whole file. 200 lines are enough.
    if (++lineNo > 200)
      return true

    line = line.trim()

    // jump empty line
    if (!line)
      continue

    const lineSplit = line.split('\t')

    // There must be 2 columns.
    if (lineSplit.length !== 2)
      return false

    // the second column must be codes.
    try {
      parseDuoduoCodes(lineSplit[1])
    }
    catch (err) {
      return false
    }
  }
  return true
}
