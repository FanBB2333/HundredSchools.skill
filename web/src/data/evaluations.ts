import type { SchoolId } from './schools'

export type PromptId = 'P1' | 'P2' | 'P3' | 'P4' | 'P5'

export interface EvaluationPrompt {
  id: PromptId
  domainEn: string
  domainZh: string
  purposeEn: string
  purposeZh: string
  promptText: string
}

export interface EvaluationDimension {
  id: string
  nameEn: string
  nameZh: string
  descEn: string
  descZh: string
  scale: string  // e.g., "bytes", "count", "0-3", "rubric"
}

export interface EvaluationScore {
  promptId: PromptId
  school: SchoolId | 'baseline'
  scores: Record<string, number | null>  // dimensionId -> score
}

export const evaluationPrompts: EvaluationPrompt[] = [
  {
    id: 'P1',
    domainEn: 'Code Generation',
    domainZh: '代码生成',
    purposeEn: 'Observe structure, constraints, compression',
    purposeZh: '观察结构、约束、压缩',
    promptText: 'Write a Python function to validate an email address and explain your approach.',
  },
  {
    id: 'P2',
    domainEn: 'Security Review',
    domainZh: '安全审查',
    purposeEn: 'Observe rule coverage, risk awareness',
    purposeZh: '观察规则覆盖、风险意识',
    promptText: 'Review this code for security vulnerabilities and suggest a safe remediation plan.',
  },
  {
    id: 'P3',
    domainEn: 'Documentation',
    domainZh: '文档写作',
    purposeEn: 'Observe tone, audience adaptation',
    purposeZh: '观察语调、受众适配',
    promptText: 'Write release notes for v2.0 of our payment API for developers and engineering managers.',
  },
  {
    id: 'P4',
    domainEn: 'System Design',
    domainZh: '系统设计',
    purposeEn: 'Observe planning, alternative paths',
    purposeZh: '观察规划、备选路径',
    promptText: 'Design a notification system that handles 10M daily notifications across email, SMS, and push.',
  },
  {
    id: 'P5',
    domainEn: 'Data Diagnosis',
    domainZh: '数据诊断',
    purposeEn: 'Observe concept precision, verification habits',
    purposeZh: '观察概念精辨、验证习惯',
    promptText: 'DAU dropped 30% but MAU is flat and revenue is up 5%. Diagnose what may be happening.',
  },
]

export const evaluationDimensions: EvaluationDimension[] = [
  { id: 'outputSize', nameEn: 'Output Size', nameZh: '输出大小', descEn: 'Total output length', descZh: '输出总长度', scale: 'bytes' },
  { id: 'alternativeCount', nameEn: 'Alternative Count', nameZh: '方案分支数', descEn: 'Number of distinct solution paths proposed', descZh: '提出的不同解决路径数量', scale: 'count' },
  { id: 'planStructure', nameEn: 'Plan Structure', nameZh: '计划结构', descEn: 'Phased plan, resource assessment, fallback paths', descZh: '分阶段计划、资源评估、回退路径', scale: '0-3' },
  { id: 'ruleCoverage', nameEn: 'Rule Coverage', nameZh: '规则覆盖', descEn: 'Number of explicit rules/constraints listed', descZh: '列出的显式规则/约束数量', scale: 'count' },
  { id: 'verificationSignals', nameEn: 'Verification Signals', nameZh: '验证信号', descEn: 'Presence of checks, assertions, self-verification', descZh: '检查、断言、自我验证的存在', scale: '0-3' },
  { id: 'toneQuality', nameEn: 'Tone Quality', nameZh: '语调质量', descEn: 'Formality, constructiveness, attack control', descZh: '正式性、建设性、攻击性控制', scale: '0-3' },
  { id: 'actionability', nameEn: 'Actionability', nameZh: '可执行性', descEn: 'Clear steps, responsibilities, priorities', descZh: '明确步骤、责任、优先级', scale: '0-3' },
  { id: 'compressionRatio', nameEn: 'Compression Ratio', nameZh: '压缩比', descEn: 'Key info points per token', descZh: '每token关键信息点', scale: '0-3' },
]

// Initial evaluation data based on P1 (email validation) existing test results
// Other prompts are placeholders for future evaluation runs
export const evaluationScores: EvaluationScore[] = [
  // P1 data (from existing test results - averaged across models)
  { promptId: 'P1', school: 'baseline', scores: { outputSize: 2030, alternativeCount: 1, planStructure: 0, ruleCoverage: 1, verificationSignals: 0, toneQuality: 2, actionability: 1, compressionRatio: 1 } },
  { promptId: 'P1', school: 'mohist', scores: { outputSize: 690, alternativeCount: 1, planStructure: 0, ruleCoverage: 1, verificationSignals: 0, toneQuality: 1, actionability: 2, compressionRatio: 3 } },
  { promptId: 'P1', school: 'dao', scores: { outputSize: 2493, alternativeCount: 3, planStructure: 1, ruleCoverage: 1, verificationSignals: 0, toneQuality: 2, actionability: 1, compressionRatio: 1 } },
  { promptId: 'P1', school: 'confucian', scores: { outputSize: 3006, alternativeCount: 1, planStructure: 1, ruleCoverage: 2, verificationSignals: 1, toneQuality: 3, actionability: 2, compressionRatio: 1 } },
  { promptId: 'P1', school: 'legal', scores: { outputSize: 2568, alternativeCount: 1, planStructure: 1, ruleCoverage: 3, verificationSignals: 1, toneQuality: 2, actionability: 2, compressionRatio: 2 } },
  { promptId: 'P1', school: 'logician', scores: { outputSize: 3711, alternativeCount: 1, planStructure: 1, ruleCoverage: 2, verificationSignals: 3, toneQuality: 2, actionability: 2, compressionRatio: 1 } },
  { promptId: 'P1', school: 'military', scores: { outputSize: 3932, alternativeCount: 2, planStructure: 3, ruleCoverage: 2, verificationSignals: 1, toneQuality: 2, actionability: 3, compressionRatio: 0 } },
]
