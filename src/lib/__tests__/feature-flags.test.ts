import { describe, it, expect, beforeEach, vi } from 'vitest'
import { readFlag, writeFlag, FLAG_DEFINITIONS } from '../feature-flags'

describe('feature-flags', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('readFlag', () => {
    it('returns default value when nothing stored', () => {
      const aiFlag = FLAG_DEFINITIONS.find((f) => f.key === 'AI_INSIGHTS_ENABLED')!
      expect(readFlag('AI_INSIGHTS_ENABLED')).toBe(aiFlag.defaultValue)
    })

    it('returns stored value when set to true', () => {
      localStorage.setItem('ff_AI_INSIGHTS_ENABLED', 'true')
      expect(readFlag('AI_INSIGHTS_ENABLED')).toBe(true)
    })

    it('returns stored value when set to false', () => {
      localStorage.setItem('ff_AI_INSIGHTS_ENABLED', 'false')
      expect(readFlag('AI_INSIGHTS_ENABLED')).toBe(false)
    })

    it('returns false for unknown flags', () => {
      expect(readFlag('UNKNOWN_FLAG')).toBe(false)
    })

    it('handles localStorage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      // Should return default, not throw
      expect(readFlag('AI_INSIGHTS_ENABLED')).toBe(true)
      vi.restoreAllMocks()
    })
  })

  describe('writeFlag', () => {
    it('persists flag value to localStorage', () => {
      writeFlag('AI_INSIGHTS_ENABLED', false)
      expect(localStorage.getItem('ff_AI_INSIGHTS_ENABLED')).toBe('false')
    })

    it('overwrites existing value', () => {
      writeFlag('AI_INSIGHTS_ENABLED', false)
      writeFlag('AI_INSIGHTS_ENABLED', true)
      expect(localStorage.getItem('ff_AI_INSIGHTS_ENABLED')).toBe('true')
    })

    it('handles localStorage errors gracefully', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota exceeded')
      })
      // Should not throw
      expect(() => writeFlag('AI_INSIGHTS_ENABLED', false)).not.toThrow()
      vi.restoreAllMocks()
    })
  })

  describe('FLAG_DEFINITIONS', () => {
    it('includes AI_INSIGHTS_ENABLED flag', () => {
      const flag = FLAG_DEFINITIONS.find((f) => f.key === 'AI_INSIGHTS_ENABLED')
      expect(flag).toBeDefined()
      expect(flag!.defaultValue).toBe(true)
      expect(flag!.description).toBeTruthy()
    })
  })
})
