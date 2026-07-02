import { describe, it, expect } from 'vitest'
import { PLANS, getPlan, formatPrice } from '../plans'

describe('PLANS', () => {
  it('contains exactly three plans', () => {
    expect(PLANS).toHaveLength(3)
  })

  it('each plan has required fields', () => {
    for (const plan of PLANS) {
      expect(plan.id).toBeTruthy()
      expect(plan.name).toBeTruthy()
      expect(typeof plan.priceInCents).toBe('number')
      expect(plan.priceInCents).toBeGreaterThanOrEqual(0)
      expect(typeof plan.emails).toBe('number')
      expect(plan.features.length).toBeGreaterThan(0)
      expect(plan.cta).toBeTruthy()
    }
  })

  it('has one popular plan', () => {
    const popular = PLANS.filter((p) => p.popular)
    expect(popular).toHaveLength(1)
    expect(popular[0].id).toBe('pro')
  })
})

describe('getPlan', () => {
  it('returns the starter plan', () => {
    const plan = getPlan('starter')
    expect(plan).toBeDefined()
    expect(plan!.name).toBe('Starter')
    expect(plan!.priceInCents).toBe(2900)
  })

  it('returns the pro plan', () => {
    const plan = getPlan('pro')
    expect(plan).toBeDefined()
    expect(plan!.name).toBe('Pro')
    expect(plan!.popular).toBe(true)
  })

  it('returns the enterprise plan', () => {
    const plan = getPlan('enterprise')
    expect(plan).toBeDefined()
    expect(plan!.name).toBe('Enterprise')
  })

  it('returns undefined for unknown plan id', () => {
    expect(getPlan('nonexistent')).toBeUndefined()
  })

  it('returns undefined for empty string', () => {
    expect(getPlan('')).toBeUndefined()
  })
})

describe('formatPrice', () => {
  it('formats cents to dollar string', () => {
    expect(formatPrice(2900)).toBe('$29')
  })

  it('formats zero cents', () => {
    expect(formatPrice(0)).toBe('$0')
  })

  it('formats cents with fractional dollars', () => {
    expect(formatPrice(9950)).toBe('$99.5')
  })

  it('formats large amounts', () => {
    expect(formatPrice(29900)).toBe('$299')
  })

  it('formats amounts that round to whole dollars', () => {
    expect(formatPrice(100)).toBe('$1')
  })
})
