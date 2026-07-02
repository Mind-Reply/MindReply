import { describe, it, expect } from 'vitest'
import {
  validateCampaignInput,
  normalizeText,
  normalizeChannels,
  buildCampaignSystemPrompt,
  buildCampaignUserPrompt,
  parseCampaignResult,
  extractResponseText,
  CAMPAIGN_RESPONSE_SCHEMA,
} from '../campaign-studio'

describe('normalizeText', () => {
  it('trims whitespace', () => {
    expect(normalizeText('  hello  ')).toBe('hello')
  })

  it('returns empty string for non-string values', () => {
    expect(normalizeText(undefined)).toBe('')
    expect(normalizeText(null)).toBe('')
    expect(normalizeText(42)).toBe('')
    expect(normalizeText({})).toBe('')
  })

  it('truncates strings longer than 8000 characters', () => {
    const long = 'a'.repeat(9000)
    expect(normalizeText(long)).toHaveLength(8000)
  })

  it('returns the string as-is if within length', () => {
    expect(normalizeText('hello world')).toBe('hello world')
  })
})

describe('normalizeChannels', () => {
  it('returns empty array for non-array input', () => {
    expect(normalizeChannels(undefined)).toEqual([])
    expect(normalizeChannels(null)).toEqual([])
    expect(normalizeChannels('email')).toEqual([])
    expect(normalizeChannels(42)).toEqual([])
  })

  it('filters out non-string items', () => {
    expect(normalizeChannels(['email', 42, null, 'twitter'])).toEqual([
      'email',
      'twitter',
    ])
  })

  it('trims whitespace from channel names', () => {
    expect(normalizeChannels(['  email  ', ' twitter '])).toEqual([
      'email',
      'twitter',
    ])
  })

  it('removes empty strings after trimming', () => {
    expect(normalizeChannels(['email', '  ', '', 'twitter'])).toEqual([
      'email',
      'twitter',
    ])
  })

  it('deduplicates channels', () => {
    expect(normalizeChannels(['email', 'email', 'twitter'])).toEqual([
      'email',
      'twitter',
    ])
  })

  it('limits to 6 channels', () => {
    const channels = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    expect(normalizeChannels(channels)).toHaveLength(6)
  })
})

describe('validateCampaignInput', () => {
  const validInput = {
    brief: 'Launch our new product line',
    audience: 'Tech professionals 25-45',
    productDetails: 'SaaS analytics platform',
    tone: 'Professional yet approachable',
    channels: ['email', 'twitter', 'linkedin'],
  }

  it('accepts valid input', () => {
    const result = validateCampaignInput(validInput)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.brief).toBe('Launch our new product line')
      expect(result.data.channels).toEqual(['email', 'twitter', 'linkedin'])
    }
  })

  it('rejects null/undefined input', () => {
    expect(validateCampaignInput(null)).toEqual({
      ok: false,
      message: 'Request body is missing.',
    })
    expect(validateCampaignInput(undefined)).toEqual({
      ok: false,
      message: 'Request body is missing.',
    })
  })

  it('rejects non-object input', () => {
    expect(validateCampaignInput('string')).toEqual({
      ok: false,
      message: 'Request body is missing.',
    })
  })

  it('rejects when brief is too short', () => {
    const result = validateCampaignInput({ ...validInput, brief: 'ab' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Campaign brief is required.')
  })

  it('rejects when audience is too short', () => {
    const result = validateCampaignInput({ ...validInput, audience: 'ab' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Target audience is required.')
  })

  it('rejects when productDetails is too short', () => {
    const result = validateCampaignInput({ ...validInput, productDetails: 'ab' })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.message).toBe('Product details are required.')
  })

  it('rejects when tone is too short', () => {
    const result = validateCampaignInput({ ...validInput, tone: 'ab' })
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.message).toBe('Tone is required.')
  })

  it('rejects when channels is empty', () => {
    const result = validateCampaignInput({ ...validInput, channels: [] })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.message).toBe('Select at least one channel.')
  })

  it('rejects when channels is not an array', () => {
    const result = validateCampaignInput({
      ...validInput,
      channels: 'email',
    })
    expect(result.ok).toBe(false)
    if (!result.ok)
      expect(result.message).toBe('Select at least one channel.')
  })

  it('trims input fields', () => {
    const result = validateCampaignInput({
      brief: '  Launch campaign  ',
      audience: '  Developers  ',
      productDetails: '  Our tool  ',
      tone: '  Casual  ',
      channels: ['  email  '],
    })
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data.brief).toBe('Launch campaign')
      expect(result.data.audience).toBe('Developers')
      expect(result.data.channels).toEqual(['email'])
    }
  })
})

describe('buildCampaignSystemPrompt', () => {
  it('returns a non-empty string', () => {
    const prompt = buildCampaignSystemPrompt()
    expect(prompt.length).toBeGreaterThan(0)
  })

  it('mentions marketing strategist', () => {
    const prompt = buildCampaignSystemPrompt()
    expect(prompt).toContain('marketing strategist')
  })
})

describe('buildCampaignUserPrompt', () => {
  it('includes all input fields', () => {
    const input = {
      brief: 'Test brief',
      audience: 'Test audience',
      productDetails: 'Test product',
      tone: 'Casual',
      channels: ['email', 'twitter'],
    }
    const prompt = buildCampaignUserPrompt(input)
    expect(prompt).toContain('Test brief')
    expect(prompt).toContain('Test audience')
    expect(prompt).toContain('Test product')
    expect(prompt).toContain('Casual')
    expect(prompt).toContain('email, twitter')
  })
})

describe('parseCampaignResult', () => {
  const validResult = {
    concept: 'A bold campaign for launch',
    variants: [
      { channel: 'email', headline: 'H1', body: 'B1' },
      { channel: 'twitter', headline: 'H2', body: 'B2' },
      { channel: 'linkedin', headline: 'H3', body: 'B3' },
      { channel: 'facebook', headline: 'H4', body: 'B4' },
      { channel: 'instagram', headline: 'H5', body: 'B5' },
    ],
    launchChecklist: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
    imagePrompts: ['Prompt 1', 'Prompt 2', 'Prompt 3'],
  }

  it('parses valid campaign result', () => {
    const result = parseCampaignResult(validResult)
    expect(result.concept).toBe('A bold campaign for launch')
    expect(result.variants).toHaveLength(5)
    expect(result.launchChecklist).toHaveLength(5)
    expect(result.imagePrompts).toHaveLength(3)
  })

  it('throws on null/undefined input', () => {
    expect(() => parseCampaignResult(null)).toThrow(
      'Campaign model response was empty.'
    )
    expect(() => parseCampaignResult(undefined)).toThrow(
      'Campaign model response was empty.'
    )
  })

  it('throws on non-object input', () => {
    expect(() => parseCampaignResult('string')).toThrow(
      'Campaign model response was empty.'
    )
  })

  it('throws when variants count is not 5', () => {
    const result = {
      ...validResult,
      variants: validResult.variants.slice(0, 3),
    }
    expect(() => parseCampaignResult(result)).toThrow(
      'Campaign model response did not match the expected shape.'
    )
  })

  it('throws when checklist has fewer than 5 items', () => {
    const result = {
      ...validResult,
      launchChecklist: ['Step 1', 'Step 2'],
    }
    expect(() => parseCampaignResult(result)).toThrow(
      'Campaign model response did not match the expected shape.'
    )
  })

  it('throws when imagePrompts count is not 3', () => {
    const result = {
      ...validResult,
      imagePrompts: ['Prompt 1'],
    }
    expect(() => parseCampaignResult(result)).toThrow(
      'Campaign model response did not match the expected shape.'
    )
  })

  it('filters out invalid variants', () => {
    const result = {
      ...validResult,
      variants: [
        ...validResult.variants,
        null,
        { channel: '', headline: 'H', body: 'B' },
      ],
    }
    const parsed = parseCampaignResult(result)
    expect(parsed.variants).toHaveLength(5)
  })

  it('truncates checklist to 8 items', () => {
    const result = {
      ...validResult,
      launchChecklist: Array.from({ length: 12 }, (_, i) => `Step ${i + 1}`),
    }
    const parsed = parseCampaignResult(result)
    expect(parsed.launchChecklist).toHaveLength(8)
  })

  it('truncates imagePrompts to 3 items', () => {
    const result = {
      ...validResult,
      imagePrompts: ['P1', 'P2', 'P3', 'P4', 'P5'],
    }
    const parsed = parseCampaignResult(result)
    expect(parsed.imagePrompts).toHaveLength(3)
  })
})

describe('extractResponseText', () => {
  it('returns empty string for null/undefined', () => {
    expect(extractResponseText(null)).toBe('')
    expect(extractResponseText(undefined)).toBe('')
  })

  it('returns empty string for non-object', () => {
    expect(extractResponseText('string')).toBe('')
    expect(extractResponseText(42)).toBe('')
  })

  it('extracts output_text if present', () => {
    expect(extractResponseText({ output_text: 'Hello world' })).toBe(
      'Hello world'
    )
  })

  it('trims output_text', () => {
    expect(extractResponseText({ output_text: '  hello  ' })).toBe('hello')
  })

  it('ignores empty output_text and falls through to output array', () => {
    const response = {
      output_text: '   ',
      output: [
        {
          content: [{ text: 'fallback' }],
        },
      ],
    }
    expect(extractResponseText(response)).toBe('fallback')
  })

  it('concatenates text from output content array', () => {
    const response = {
      output: [
        {
          content: [{ text: 'part1' }, { text: 'part2' }],
        },
        {
          content: [{ text: 'part3' }],
        },
      ],
    }
    expect(extractResponseText(response)).toBe('part1part2part3')
  })

  it('skips non-object items in output', () => {
    const response = {
      output: [null, 'invalid', { content: [{ text: 'valid' }] }],
    }
    expect(extractResponseText(response)).toBe('valid')
  })

  it('skips non-object items in content', () => {
    const response = {
      output: [
        {
          content: [null, 42, { text: 'ok' }],
        },
      ],
    }
    expect(extractResponseText(response)).toBe('ok')
  })

  it('returns empty string when output has no text', () => {
    const response = {
      output: [
        {
          content: [{ type: 'image' }],
        },
      ],
    }
    expect(extractResponseText(response)).toBe('')
  })
})

describe('CAMPAIGN_RESPONSE_SCHEMA', () => {
  it('has the expected top-level required fields', () => {
    expect(CAMPAIGN_RESPONSE_SCHEMA.required).toEqual([
      'concept',
      'variants',
      'launchChecklist',
      'imagePrompts',
    ])
  })

  it('expects exactly 5 variants', () => {
    const variants = CAMPAIGN_RESPONSE_SCHEMA.properties.variants
    expect(variants.minItems).toBe(5)
    expect(variants.maxItems).toBe(5)
  })

  it('expects exactly 3 imagePrompts', () => {
    const prompts = CAMPAIGN_RESPONSE_SCHEMA.properties.imagePrompts
    expect(prompts.minItems).toBe(3)
    expect(prompts.maxItems).toBe(3)
  })
})
