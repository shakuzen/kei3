import { describe, it, expect } from 'vitest'
import { calculateHealthInsurancePremium } from '../utils/healthInsuranceCalculator'

describe('calculateHealthInsurance', () => {
    it('calculates base health insurance for people under 40', () => {
      expect(calculateHealthInsurancePremium(5_000_000 / 12, false)).toBe(243_792)
    })

    it('calculates base health insurance for people under 40 with cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000 / 12, false)).toBe(826_500)
    })
  
    it('calculates health insurance with nursing care for people over 40', () => {
      expect(calculateHealthInsurancePremium(5_000_000 / 12, true)).toBe(282_900)
    })
  
    it('calculates health insurance with nursing care for people over 40 with cap', () => {
      expect(calculateHealthInsurancePremium(20_000_000 / 12, true)).toBe(959_100)
    })
  
    it('handles zero income correctly', () => {
      expect(calculateHealthInsurancePremium(0, false)).toBe(34_488)
      expect(calculateHealthInsurancePremium(0, true)).toBe(40_020)
    })
  
    it('handles negative income correctly', () => {
      expect(() => calculateHealthInsurancePremium(-1_000_000 / 12, false)).toThrowError('Monthly income cannot be negative.')
      expect(() => calculateHealthInsurancePremium(-1_000_000 / 12, true)).toThrowError('Monthly income cannot be negative.')
    })
  })
