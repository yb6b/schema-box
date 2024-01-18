import type { InjectionKey, ShallowRef } from 'vue'
import type { Mabiao } from 'libs/schema'
import type { FullAnalysisResult } from 'libs/evaluate/simulator/analysisResult'

export interface ArticleInfo {
  name: string
  txt: string
}

export interface MbInfo {
  mb: Mabiao
  analysis: FullAnalysisResult
}

export interface AllSimulatorInfo {
  art: ArticleInfo
  mb: MbInfo
  mb2: MbInfo
}

export const jAllInfo = Symbol('everything about simulator result') as InjectionKey<ShallowRef<AllSimulatorInfo>>

export const jMabiao = Symbol('main Mabiao') as InjectionKey<Mabiao>
export const jMabiao2 = Symbol('secondary Mabiao') as InjectionKey<Mabiao>
export const jArticle = Symbol('article') as InjectionKey<ArticleInfo>

export const jResult = Symbol('main mabiao analysis result') as InjectionKey<FullAnalysisResult>
export const jResult2 = Symbol('secondary mabiao analysis result') as InjectionKey<FullAnalysisResult>
