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
  hasDeathResultOfDisability: boolean
  hasSurvivorsIndemnityCompensationAward: boolean
  hasSurvivorsPensionAward: boolean
  hasAdaptedHousing: boolean
  hasIndividualUnemployabilityGranted: boolean
  hasNonServiceConnectedPension: boolean
  hasServiceConnectedDisabilities: boolean
  hasSpecialMonthlyCompensation: boolean
}

export type LetterBeneficiaryData = {
  benefitInformation: LetterBenefitInformation
  militaryService: Array<LetterMilitaryService>
}

export type LetterBeneficiaryDataPayload = {
  data: {
    type: string
    id: string
    attributes: LetterBeneficiaryData
  }
}
