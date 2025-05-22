import { describe, it, expect } from 'vitest'
import { calculateHealthInsurancePremium } from '../utils/healthInsuranceCalculator'

describe('calculateHealthInsurancePremium for employees', () => {
    it('calculates employees health insurance premium for people under 40', () => {
      expect(calculateHealthInsurancePremium(5_000_000, false)).toBe(243_792)
    })

    it('calculates employees health insurance premium for people under 40 with cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000, false)).toBe(826_500)
    })
  
    it('calculates employees health insurance premium with nursing care for people over 40', () => {
      expect(calculateHealthInsurancePremium(5_000_000, true)).toBe(282_900)
    })
  
    it('calculates employees health insurance premium with nursing care for people over 40 with cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000, true)).toBe(959_100)
    })
  
    it('handles zero income correctly', () => {
      expect(calculateHealthInsurancePremium(0, false)).toBe(34_488)
      expect(calculateHealthInsurancePremium(0, true)).toBe(40_020)
    })
  
    it('handles negative income correctly', () => {
      expect(() => calculateHealthInsurancePremium(-1_000_000, false)).toThrowError('Income cannot be negative.')
      expect(() => calculateHealthInsurancePremium(-1_000_000, true)).toThrowError('Income cannot be negative.')
    })
  })

  describe('calculateHealthInsurancePremium for non-employees', () => {
    it('calculates NHI premium', () => {
      expect(calculateHealthInsurancePremium(5_000_000, false, false)).toBe(539_380)
    })

    it('calculates NHI premium with cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000, false, false)).toBe(920_000)
    })

    it('calculates NHI premium with nursing care', () => {
      expect(calculateHealthInsurancePremium(5_000_000, true, false)).toBe(658_805)
    })

    it('calculates NHI premium with nursing care and cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000, true, false)).toBe(1_090_000)
    })

    it('handles zero income correctly', () => {
      expect(calculateHealthInsurancePremium(0, false, false)).toBe(64_100)
      expect(calculateHealthInsurancePremium(0, true, false)).toBe(80_700)
    })

    it('handles negative income correctly', () => {
      expect(() => calculateHealthInsurancePremium(-1_000_000, false, false)).toThrowError('Income cannot be negative.')
      expect(() => calculateHealthInsurancePremium(-1_000_000, true, false)).toThrowError('Income cannot be negative.')
    })
  })
