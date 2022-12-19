import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { ClaimEventData } from 'store/api/types'
import { LetterTypes, ScreenIDTypes } from 'store/api/types'

import { ClaimType } from 'screens/BenefitsScreen/ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { stringToTitleCase } from 'utils/formattingUtils'
import AskForClaimDecision from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import BenefitSummaryServiceVerification from 'screens/BenefitsScreen/Letters/BenefitSummaryServiceVerification/BenefitSummaryServiceVerification'
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

export const getBenefitsScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <BenefitsStack.Screen
      key={'BenefitSummaryServiceVerificationLetter'}
      name="BenefitSummaryServiceVerificationLetter"
      component={BenefitSummaryServiceVerification}
      options={{ title: t('letters.overview.title') }}
    />,
    <BenefitsStack.Screen key={'ConsolidatedClaimsNote'} name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />,
    <BenefitsStack.Screen key={'WhatDoIDoIfDisagreement'} name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />,
    <BenefitsStack.Screen key={'FileRequest'} name="FileRequest" component={FileRequest} options={{ title: t('fileRequest.title') }} />,
    <BenefitsStack.Screen key={'AskForClaimDecision'} name="AskForClaimDecision" component={AskForClaimDecision} options={{ title: t('askForClaimDecision.pageTitle') }} />,
    <BenefitsStack.Screen key={'TakePhotos'} name="TakePhotos" component={TakePhotos} options={{ title: stringToTitleCase(t('fileUpload.takeOrSelectPhotos')) }} />,
    <BenefitsStack.Screen key={'SelectFile'} name="SelectFile" component={SelectFile} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'UploadOrAddPhotos'} name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'UploadFile'} name="UploadFile" component={UploadFile} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'FileRequestDetails'} name="FileRequestDetails" component={FileRequestDetails} options={{ title: t('fileRequest.title') }} />,
  ]
}
