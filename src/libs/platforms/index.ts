export * from './autoplat'
export * from './duoduo'
export * from './rime'
export * from './yong'
export * from './rawFile'

export class FormatError extends Error {}
export type PlatTypes = 'auto' | 'rime' | 'duoduo' | 'yong'
