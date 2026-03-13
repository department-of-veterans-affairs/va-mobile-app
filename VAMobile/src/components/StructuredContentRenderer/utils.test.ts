import { getLinkUrl } from 'components/StructuredContentRenderer/utils'

jest.mock('utils/env', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    ENVIRONMENT: 'staging',
    IS_TEST: true,
  })),
}))

describe('getLinkUrl', () => {
  it('returns https URLs unchanged', () => {
    expect(getLinkUrl('https://www.va.gov/page')).toBe('https://www.va.gov/page')
    expect(getLinkUrl('https://example.com/other')).toBe('https://example.com/other')
  })

  it('returns http URLs unchanged', () => {
    expect(getLinkUrl('http://www.va.gov/page')).toBe('http://www.va.gov/page')
  })

  it('resolves relative paths to VA.gov base URL by environment', () => {
    expect(getLinkUrl('profile/direct-deposit')).toBe('https://test.va.gov/profile/direct-deposit')
    expect(getLinkUrl('/profile/direct-deposit')).toBe('https://test.va.gov/profile/direct-deposit')
  })
})
