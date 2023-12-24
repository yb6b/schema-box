import type { InjectionKey, Ref } from 'vue'
import type { Mabiao } from 'libs/schema'

export const jDictMode = Symbol('dictMode') as InjectionKey<boolean>

export const jResultRef = Symbol('shared result mabiao') as InjectionKey<Ref<Mabiao>>
