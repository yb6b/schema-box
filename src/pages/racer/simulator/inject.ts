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
