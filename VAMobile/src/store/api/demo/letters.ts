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
