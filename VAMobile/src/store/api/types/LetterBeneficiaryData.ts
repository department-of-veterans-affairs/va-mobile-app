export const CharactersOfServiceConstants: {
  HONORABLE: charactersOfService
  OTHER_THAN_HONORABLE: charactersOfService
  UNDER_HONORABLE_CONDITIONS: charactersOfService
  GENERAL: charactersOfService
  UNCHARACTERIZED: charactersOfService
  UNCHARACTERIZED_ENTRY_LEVEL: charactersOfService
  DISHONORABLE: charactersOfService
} = {
  HONORABLE: 'HONORABLE',
  OTHER_THAN_HONORABLE: 'OTHER_THAN_HONORABLE',
  UNDER_HONORABLE_CONDITIONS: 'UNDER_HONORABLE_CONDITIONS',
  GENERAL: 'GENERAL',
  UNCHARACTERIZED: 'UNCHARACTERIZED',
  UNCHARACTERIZED_ENTRY_LEVEL: 'UNCHARACTERIZED_ENTRY_LEVEL',
  DISHONORABLE: 'DISHONORABLE',
}

export type charactersOfService =
  | 'HONORABLE'
  | 'OTHER_THAN_HONORABLE'
  | 'UNDER_HONORABLE_CONDITIONS'
  | 'GENERAL'
  | 'UNCHARACTERIZED'
  | 'UNCHARACTERIZED_ENTRY_LEVEL'
  | 'DISHONORABLE'

export type LetterMilitaryService = {
  branch: string
  characterOfService: charactersOfService
  enteredDate: string
  releasedDate: string
}

export type LetterBenefitInformation = {
  awardEffectiveDate: string
  hasChapter35Eligibility: boolean
  monthlyAwardAmount: number
  serviceConnectedPercentage: number
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
  militaryService: LetterMilitaryService
}

export type LetterBeneficiaryDataPayload = {
  data: {
    type: string
    id: string
    attributes: LetterBeneficiaryData
  }
}
