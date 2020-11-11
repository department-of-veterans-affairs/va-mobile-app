export const letterTypeConstants: {
  commissary: letterTypes
  proofOfService: letterTypes
  medicarePartd: letterTypes
  minimumEssentialCoverage: letterTypes
  serviceVerification: letterTypes
  civilService: letterTypes
  benefitSummary: letterTypes
  benefitVerification: letterTypes
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

export type letterTypes =
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
  letterType: letterTypes
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
