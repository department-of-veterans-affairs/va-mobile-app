import { OH_MIGRATION_PHASES_BLOCKING_REPLIES, isMigrationPhaseBlockingReplies } from 'constants/secureMessaging'

describe('isMigrationPhaseBlockingReplies', () => {
  it.each(OH_MIGRATION_PHASES_BLOCKING_REPLIES)('should return true for blocking phase %s', (phase) => {
    expect(isMigrationPhaseBlockingReplies(phase)).toBe(true)
  })

  it.each(['p0', 'p1', 'p2', 'p6', 'p7'])('should return false for non-blocking phase %s', (phase) => {
    expect(isMigrationPhaseBlockingReplies(phase)).toBe(false)
  })

  it('should return false for undefined', () => {
    expect(isMigrationPhaseBlockingReplies(undefined)).toBe(false)
  })

  it('should return false for null', () => {
    expect(isMigrationPhaseBlockingReplies(null)).toBe(false)
  })

  it('should return false for empty string', () => {
    expect(isMigrationPhaseBlockingReplies('')).toBe(false)
  })
})
