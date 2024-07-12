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

export const CharacterOfServiceConstants: {
  HONORABLE: CharacterOfService
  OTHER_THAN_HONORABLE: CharacterOfService
  UNDER_HONORABLE_CONDITIONS: CharacterOfService
  GENERAL: CharacterOfService
  UNCHARACTERIZED: CharacterOfService
  UNCHARACTERIZED_ENTRY_LEVEL: CharacterOfService
  DISHONORABLE: CharacterOfService
} = {
  HONORABLE: 'HONORABLE',
  OTHER_THAN_HONORABLE: 'OTHER_THAN_HONORABLE',
  UNDER_HONORABLE_CONDITIONS: 'UNDER_HONORABLE_CONDITIONS',
  GENERAL: 'GENERAL',
  UNCHARACTERIZED: 'UNCHARACTERIZED',
  UNCHARACTERIZED_ENTRY_LEVEL: 'UNCHARACTERIZED_ENTRY_LEVEL',
  DISHONORABLE: 'DISHONORABLE',
}

export type CharacterOfService =
  | 'HONORABLE'
  | 'OTHER_THAN_HONORABLE'
  | 'UNDER_HONORABLE_CONDITIONS'
  | 'GENERAL'
  | 'UNCHARACTERIZED'
  | 'UNCHARACTERIZED_ENTRY_LEVEL'
  | 'DISHONORABLE'

export type LetterMilitaryService = {
  branch: string
  characterOfService: CharacterOfService
  enteredDate: string
  releasedDate: string
}

export type LetterBenefitInformation = {
  awardEffectiveDate: string | null
  hasChapter35Eligibility: boolean | null
  monthlyAwardAmount: number | null
  serviceConnectedPercentage: number | null
  hasDeathResultOfDisability?: boolean
  hasSurvivorsIndemnityCompensationAward?: boolean
  hasSurvivorsPensionAward?: boolean
  hasAdaptedHousing?: boolean
  hasIndividualUnemployabilityGranted?: boolean
  hasNonServiceConnectedPension?: boolean
  hasServiceConnectedDisabilities?: boolean
  hasSpecialMonthlyCompensation?: boolean
}

export type LetterBeneficiaryData = {
  benefitInformation: LetterBenefitInformation
  militaryService: Array<LetterMilitaryService>
  mostRecentServices?: Array<LetterMilitaryService>
}

export type LetterBeneficiaryDataPayload = {
  data: {
    type: string
    id: string
    attributes: LetterBeneficiaryData
  }
}
