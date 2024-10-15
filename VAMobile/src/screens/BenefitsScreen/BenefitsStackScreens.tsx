import React, { ReactNode } from 'react'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { createStackNavigator } from '@react-navigation/stack'

import { ClaimData, ClaimEventData, LetterTypes } from 'api/types'
import { ClaimType } from 'constants/claims'
import { LARGE_PANEL_OPTIONS } from 'constants/screens'
import AskForClaimDecision from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import UploadFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import ConsolidatedClaimsNote from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import WhatDoIDoIfDisagreement from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'
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
  }
  Claims: undefined
  ClaimDetailsScreen: {
    claimID: string
    claimType: ClaimType
  }
  ClaimsHistoryScreen: undefined
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
  FileRequestSubtask: {
    claimID: string
    claim: ClaimData | undefined
  }
  AskForClaimDecision: {
    claimID: string
  }
  SubmitEvidenceSubtask: {
    claimID: string
  }
  UploadFile: {
    claimID: string
    fileUploaded: DocumentPickerResponse
    imageUploaded: ImagePickerResponse
    request?: ClaimEventData
  }
}

const BenefitsStack = createStackNavigator<BenefitsStackParamList>()

export const getBenefitsScreens = (): Array<ReactNode> => {
  return [
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
    <BenefitsStack.Screen
      key={'AskForClaimDecision'}
      name="AskForClaimDecision"
      component={AskForClaimDecision}
      options={{ headerShown: false }}
    />,
    <BenefitsStack.Screen
      key={'UploadFile'}
      name="UploadFile"
      component={UploadFile}
      options={{ headerShown: false }}
    />,
  ]
}
