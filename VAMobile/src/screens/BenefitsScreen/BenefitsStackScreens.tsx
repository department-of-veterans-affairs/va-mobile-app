import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { ClaimEventData } from 'store/api/types'
import { LetterTypes, ScreenIDTypes } from 'store/api/types'

import { ClaimType } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { FULLSCREEN_SUBTASK_OPTIONS } from 'constants/screens'
import AskForClaimDecision from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import ConsolidatedClaimsNote from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import FileRequest from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import SelectFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import TakePhotos from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import UploadOrAddPhotos from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
import WhatDoIDoIfDisagreement from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'

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
    focusOnSnackbar?: boolean
  }
  ConsolidatedClaimsNote: undefined
  WhatDoIDoIfDisagreement: undefined
  AppealDetailsScreen: {
    appealID: string
  }
  FileRequest: {
    claimID: string
  }
  FileRequestDetails: {
    request: ClaimEventData
  }
  AskForClaimDecision: {
    claimID: string
  }
  TakePhotos: {
    request: ClaimEventData
    focusOnSnackbar?: boolean
  }
  SelectFile: {
    request: ClaimEventData
    focusOnSnackbar?: boolean
  }
  UploadOrAddPhotos: {
    request: ClaimEventData
    firstImageResponse: ImagePickerResponse
  }
  UploadFile: {
    request: ClaimEventData
    fileUploaded: DocumentPickerResponse
    imageUploaded: ImagePickerResponse
  }
}

const BenefitsStack = createStackNavigator<BenefitsStackParamList>()

export const getBenefitsScreens = (): Array<ReactNode> => {
  return [
    <BenefitsStack.Screen
      key={'ConsolidatedClaimsNote'}
      name="ConsolidatedClaimsNote"
      component={ConsolidatedClaimsNote}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <BenefitsStack.Screen
      key={'WhatDoIDoIfDisagreement'}
      name="WhatDoIDoIfDisagreement"
      component={WhatDoIDoIfDisagreement}
      options={{ presentation: 'modal', ...TransitionPresets.ModalTransition, headerShown: false }}
    />,
    <BenefitsStack.Screen key={'FileRequest'} name="FileRequest" component={FileRequest} options={{ headerShown: false }} />,
    <BenefitsStack.Screen key={'AskForClaimDecision'} name="AskForClaimDecision" component={AskForClaimDecision} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <BenefitsStack.Screen key={'TakePhotos'} name="TakePhotos" component={TakePhotos} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <BenefitsStack.Screen key={'SelectFile'} name="SelectFile" component={SelectFile} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <BenefitsStack.Screen key={'UploadOrAddPhotos'} name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <BenefitsStack.Screen key={'UploadFile'} name="UploadFile" component={UploadFile} options={FULLSCREEN_SUBTASK_OPTIONS} />,
    <BenefitsStack.Screen key={'FileRequestDetails'} name="FileRequestDetails" component={FileRequestDetails} options={{ headerShown: false }} />,
  ]
}
