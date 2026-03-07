import React, { ReactNode } from 'react'

import { createStackNavigator } from '@react-navigation/stack'

import { LetterTypes } from 'api/types'
import { ClaimType } from 'constants/claims'
import { FEATURE_LANDING_TEMPLATE_OPTIONS, LARGE_PANEL_OPTIONS } from 'constants/screens'
import ConsolidatedClaimsNote from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import WhatDoIDoIfDisagreement from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'
import ClaimLettersScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimLettersScreen/ClaimLettersScreen'
import { ScreenIDTypes } from 'store/api/types'

export type DocumentPickerResponse = {
  uri: string
  fileCopyUri: string
  copyError?: string
  type: string
  name: string
  size: number
  base64?: string
}

export type BenefitsStackParamList = {
  Benefits: undefined
  DisabilityRatings: undefined
  LettersOverview: undefined
  LettersList: undefined
  BenefitSummaryServiceVerificationLetter: undefined
  GenericLetter: {
    header: string
    description: string
    letterType: LetterTypes
    screenID: ScreenIDTypes
    descriptionA11yLabel?: string
    displayAlert?: boolean
    coeStatus?: string
    referenceNum?: string
  }
  Claims: undefined
  ClaimDetailsScreen: {
    claimID: string
    claimType: ClaimType
    provider?: string
  }
  ClaimsHistoryScreen: undefined
  TravelPayClaims: undefined
  TravelPayClaimDetailsScreen: {
    claimId: string
  }
  ClaimLettersScreen: undefined
  ConsolidatedClaimsNote: undefined
  WhatDoIDoIfDisagreement: {
    claimID: string
    claimType: string
    claimStep: number
  }
  AppealDetailsScreen: {
    appealID: string
  }
}

const BenefitsStack = createStackNavigator<BenefitsStackParamList>()

export const getBenefitsScreens = (): Array<ReactNode> => {
  return [
    <BenefitsStack.Screen
      key={'ClaimLettersScreen'}
      name="ClaimLettersScreen"
      component={ClaimLettersScreen}
      options={FEATURE_LANDING_TEMPLATE_OPTIONS}
    />,
    <BenefitsStack.Screen
      key={'ConsolidatedClaimsNote'}
      name="ConsolidatedClaimsNote"
      component={ConsolidatedClaimsNote}
      options={LARGE_PANEL_OPTIONS}
    />,
    <BenefitsStack.Screen
      key={'WhatDoIDoIfDisagreement'}
      name="WhatDoIDoIfDisagreement"
      component={WhatDoIDoIfDisagreement}
      options={LARGE_PANEL_OPTIONS}
    />,
  ]
}
