import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('openai', () => {
  return {
    default: class MockOpenAI {
      chat = { completions: { create: vi.fn() } }
    },
  }
})

vi.mock('@anthropic-ai/sdk', () => {
  return {
    default: class MockAnthropic {
      messages = { create: vi.fn() }
    },
  }
})

describe('AnalysisService', () => {
  let AnalysisService: typeof import('../analysisService').AnalysisService

  beforeEach(async () => {
    process.env.OPENAI_API_KEY = 'test-key'
    process.env.ANTHROPIC_API_KEY = 'test-key'
    const mod = await import('../analysisService')
    AnalysisService = mod.AnalysisService
  })

  describe('detectEscalation', () => {
    it('escalates on negative sentiment', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('negative', 0.8, 1)
      expect(result.shouldEscalate).toBe(true)
      expect(result.reason).toContain('Negative sentiment')
    })

    it('escalates on low confidence score', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('positive', 0.4, 1)
      expect(result.shouldEscalate).toBe(true)
      expect(result.reason).toContain('Low confidence')
    })

    it('escalates when question count exceeds 3', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('positive', 0.8, 5)
      expect(result.shouldEscalate).toBe(true)
      expect(result.reason).toContain('Multiple questions')
    })

    it('does not escalate when all metrics are fine', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('positive', 0.9, 2)
      expect(result.shouldEscalate).toBe(false)
      expect(result.reason).toBeNull()
    })

    it('does not escalate for neutral sentiment with good metrics', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('neutral', 0.7, 3)
      expect(result.shouldEscalate).toBe(false)
    })

    it('combines multiple escalation reasons', () => {
      const service = new AnalysisService()
      const result = service.detectEscalation('negative', 0.3, 5)
      expect(result.shouldEscalate).toBe(true)
      expect(result.reason).toContain('Negative sentiment')
      expect(result.reason).toContain('Low confidence')
      expect(result.reason).toContain('Multiple questions')
    })

    it('escalates at exactly 0.6 confidence boundary', () => {
      const service = new AnalysisService()
      const atBoundary = service.detectEscalation('positive', 0.6, 1)
      expect(atBoundary.shouldEscalate).toBe(false)

      const belowBoundary = service.detectEscalation('positive', 0.59, 1)
      expect(belowBoundary.shouldEscalate).toBe(true)
    })

    it('escalates at exactly 3 question boundary', () => {
      const service = new AnalysisService()
      const atBoundary = service.detectEscalation('positive', 0.8, 3)
      expect(atBoundary.shouldEscalate).toBe(false)

      const aboveBoundary = service.detectEscalation('positive', 0.8, 4)
      expect(aboveBoundary.shouldEscalate).toBe(true)
    })
  })

  describe('calculateConfidence', () => {
    it('increases confidence for well-structured emails', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      const score = calc(
        'Important Meeting Tomorrow',
        'Hello team,\n\nPlease review the attached documents.\n\nBest regards'
      )
      // Base 0.5 + 0.1 (subject > 5) + 0.1 (body > 50) + 0.1 (body > 2 lines)
      expect(score).toBeCloseTo(0.8, 1)
    })

    it('decreases confidence for very short body', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      const score = calc('Help', 'Please help')
      expect(score).toBeLessThan(0.5)
    })

    it('decreases confidence for URGENT subject', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      const score = calc(
        'URGENT: Need response',
        'This is an urgent matter that needs your immediate attention and response by end of day.'
      )
      // Base 0.5 + 0.1 (subject > 5) + 0.1 (body > 50) - 0.1 (URGENT)
      expect(score).toBeCloseTo(0.6, 1)
    })

    it('decreases confidence for HELP subject', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      const score = calc(
        'HELP with deployment',
        'I need help with the production deployment, there are several issues to resolve.'
      )
      expect(score).toBeLessThanOrEqual(0.7)
    })

    it('clamps confidence between 0 and 1', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      const lowScore = calc('URGENT', 'Help')
      expect(lowScore).toBeGreaterThanOrEqual(0)
      expect(lowScore).toBeLessThanOrEqual(1)

      const highScore = calc(
        'Detailed quarterly report summary',
        'First paragraph\nSecond paragraph\nThird paragraph\n' + 'x'.repeat(100)
      )
      expect(highScore).toBeGreaterThanOrEqual(0)
      expect(highScore).toBeLessThanOrEqual(1)
    })

    it('starts at base score of 0.5 for minimal input', () => {
      const service = new AnalysisService()
      const calc = (service as any).calculateConfidence.bind(service)

      // Subject <= 5 chars, body between 20 and 50, single line
      const score = calc('Hi', 'This is exactly enough text.')
      expect(score).toBe(0.5)
    })
  })
})
