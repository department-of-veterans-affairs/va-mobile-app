import { LetterBeneficiaryDataPayload, LettersData } from '../types'

/**
 * Type denoting the demo data store
 */
export type LettersDemoStore = {
  '/v0/letters': LettersData
  '/v0/letters/beneficiary': LetterBeneficiaryDataPayload
}

/**
 * Type to define the mock returns to keep type safety
 */
export type LettersDemoApiReturnTypes = LettersData | LetterBeneficiaryDataPayload

/**
 * Consts to use for demo letter pdf
 */
export const DEMO_MODE_LETTER_ENDPOINT = 'https://department-of-veterans-affairs.github.io/va-mobile-app/demo_mode_benefit_summary.pdf'
export const DEMO_MODE_LETTER_NAME = 'demo_mode_benefit_summary.pdf'
