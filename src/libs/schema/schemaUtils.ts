import type { Schema, SchemaDictItem } from './schemaTypes'

export function createEmptySchema(): Schema {
  return { dicts: [{ items: [] }], cfg: {} }
}

export function countDictItems(aSchema: Schema) {
  let r = 0
  for (const i of aSchema.dicts)
    r += i.items.length
  return r
}

export function pushFirstDict(aSchema: Schema, item: SchemaDictItem) {
  return aSchema.dicts[0].items.push(item)
}
