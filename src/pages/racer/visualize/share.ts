import type { Schema } from 'libs/schema/schemaTypes'
import type { AnalysisResult } from 'libs/evaluate/simulator/analysisResult'

export interface SchemaAndResult {
  schema: Schema
  result: AnalysisResult
}
