export const LetterTypeConstants: {
  commissary: LetterTypes
  proofOfService: LetterTypes
  medicarePartd: LetterTypes
  minimumEssentialCoverage: LetterTypes
  serviceVerification: LetterTypes
  civilService: LetterTypes
  benefitSummary: LetterTypes
  benefitVerification: LetterTypes
} = {
  commissary: 'commissary',
  proofOfService: 'proof_of_service',
  medicarePartd: 'medicare_partd',
  minimumEssentialCoverage: 'minimum_essential_coverage',
  serviceVerification: 'service_verification',
  civilService: 'civil_service',
  benefitSummary: 'benefit_summary',
  benefitVerification: 'benefit_verification',
}

export type LetterTypes =
  | 'commissary'
  | 'proof_of_service'
  | 'medicare_partd'
  | 'minimum_essential_coverage'
  | 'service_verification'
  | 'civil_service'
  | 'benefit_summary'
  | 'benefit_verification'

export type LetterData = {
  name: string
  letterType: LetterTypes
}

export type LettersList = Array<LetterData>

export type LettersData = {
  data: {
    type: string
    id: string
    attributes: {
      letters: LettersList
    }
  }
}

// Options for the Benefit Summary and Service Verification Letter
export type BenefitSummaryAndServiceVerificationLetterOptions = {
  militaryService: boolean
  monthlyAward: boolean
  serviceConnectedEvaluation: boolean
  chapter35Eligibility: boolean
  serviceConnectedDisabilities: boolean
}

export type LettersDownloadParams = {
  militaryService: boolean
  serviceConnectedDisabilities: boolean
  serviceConnectedEvaluation: boolean
  nonServiceConnectedPension: boolean
  monthlyAward: boolean
  unemployable: boolean
  specialMonthlyCompensation: boolean
  adaptedHousing: boolean
  chapter35Eligibility: boolean
  deathResultOfDisability: boolean
  survivorsAward: boolean
}
