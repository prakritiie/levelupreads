import { addXP, calculateLevel } from '@/utils/xp'

describe('XP utilities', () => {
  describe('addXP', () => {
    it('should add XP correctly', () => {
      expect(addXP(50, 30)).toBe(80)
    })

    it('should not go below 0', () => {
      expect(addXP(20, -50)).toBe(0)
    })
  })

  describe('calculateLevel', () => {
    it('should calculate level correctly', () => {
      expect(calculateLevel(150)).toBe(1)
      expect(calculateLevel(250)).toBe(2)
      expect(calculateLevel(50)).toBe(0)
    })
  })
})