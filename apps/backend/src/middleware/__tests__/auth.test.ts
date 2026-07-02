import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../utils/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

describe('extractToken', () => {
  let extractToken: typeof import('../auth').extractToken

  beforeEach(async () => {
    const mod = await import('../auth')
    extractToken = mod.extractToken
  })

  it('returns null for undefined header', () => {
    expect(extractToken(undefined)).toBeNull()
  })

  it('returns null for empty string', () => {
    expect(extractToken('')).toBeNull()
  })

  it('returns null for non-Bearer scheme', () => {
    expect(extractToken('Basic abc123')).toBeNull()
  })

  it('returns null for malformed header with too many parts', () => {
    expect(extractToken('Bearer abc 123')).toBeNull()
  })

  it('returns null for Bearer without token', () => {
    expect(extractToken('Bearer')).toBeNull()
  })

  it('extracts token from valid Bearer header', () => {
    expect(extractToken('Bearer my-token-123')).toBe('my-token-123')
  })

  it('extracts JWT-like token', () => {
    const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig'
    expect(extractToken(`Bearer ${jwt}`)).toBe(jwt)
  })
})

describe('generateToken and verifyToken', () => {
  let generateToken: typeof import('../auth').generateToken
  let verifyToken: typeof import('../auth').verifyToken

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-for-unit-tests'
    vi.resetModules()
    const mod = await import('../auth')
    generateToken = mod.generateToken
    verifyToken = mod.verifyToken
  })

  it('generates a non-empty string token', () => {
    const token = generateToken({
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'user',
    })
    expect(typeof token).toBe('string')
    expect(token.length).toBeGreaterThan(0)
  })

  it('generates a token with three JWT segments', () => {
    const token = generateToken({
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'user',
    })
    expect(token.split('.')).toHaveLength(3)
  })

  it('round-trips through verifyToken', () => {
    const payload = {
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'admin',
    }
    const token = generateToken(payload)
    const decoded = verifyToken(token)
    expect(decoded.id).toBe(payload.id)
    expect(decoded.email).toBe(payload.email)
    expect(decoded.agencyId).toBe(payload.agencyId)
    expect(decoded.role).toBe(payload.role)
  })

  it('verified token includes iat and exp', () => {
    const token = generateToken({
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'user',
    })
    const decoded = verifyToken(token)
    expect(decoded.iat).toBeDefined()
    expect(decoded.exp).toBeDefined()
  })

  it('throws on invalid token', () => {
    expect(() => verifyToken('invalid.token.here')).toThrow(
      'Invalid or expired token'
    )
  })

  it('throws on tampered token', () => {
    const token = generateToken({
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'user',
    })
    const tampered = token.slice(0, -5) + 'XXXXX'
    expect(() => verifyToken(tampered)).toThrow('Invalid or expired token')
  })
})

describe('authMiddleware', () => {
  let authMiddleware: typeof import('../auth').authMiddleware

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-for-unit-tests'
    vi.resetModules()
    const mod = await import('../auth')
    authMiddleware = mod.authMiddleware
  })

  it('returns 401 when no authorization header', () => {
    const req = { headers: {} } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      error: 'Missing authorization token',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid token', () => {
    const req = { headers: { authorization: 'Bearer invalid' } } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next and sets req.user for valid token', async () => {
    const { generateToken } = await import('../auth')
    const token = generateToken({
      id: 'user-1',
      email: 'test@example.com',
      agencyId: 'agency-1',
      role: 'user',
    })

    const req = { headers: { authorization: `Bearer ${token}` } } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(req.user.id).toBe('user-1')
    expect(req.user.email).toBe('test@example.com')
  })
})

describe('requireRole', () => {
  let requireRole: typeof import('../auth').requireRole

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret-for-unit-tests'
    vi.resetModules()
    const mod = await import('../auth')
    requireRole = mod.requireRole
  })

  it('returns 401 when no user on request', () => {
    const middleware = requireRole(['admin'])
    const req = {} as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 403 when user role is not in allowed roles', () => {
    const middleware = requireRole(['admin'])
    const req = { user: { id: '1', role: 'user' } } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next when user role is allowed', () => {
    const middleware = requireRole(['admin', 'superadmin'])
    const req = { user: { id: '1', role: 'admin' } } as any
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    } as any
    const next = vi.fn()

    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
