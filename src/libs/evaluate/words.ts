/** 组词能力测评 */
import { hanziMapFromMb, parseFreqTsv } from './hanzi'

const WordsSections = [[0, 2000], [2000, 5000], [5000, 10000], [10000, 20000], [20000, 40000], [40000, 60000]] as const
export const presetHanziFreq = (await import('./wordsFreq')).default
