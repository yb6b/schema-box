import type { InjectionKey } from 'vue'
import type { Mabiao } from 'libs/schema'
import type { AnalysisResult } from 'libs/evaluate/simulator/analysisResult'

export interface ArticleInfo {
  name: string
  txt: string
}

export const jMabiao = Symbol('main Mabiao') as InjectionKey<Mabiao>
export const jMabiao2 = Symbol('secondary Mabiao') as InjectionKey<Mabiao>
export const jArticle = Symbol('article') as InjectionKey<ArticleInfo>

export const jResult = Symbol('main mabiao analysis result') as InjectionKey<AnalysisResult>
export const jResult2 = Symbol('secondary mabiao analysis result') as InjectionKey<AnalysisResult>
