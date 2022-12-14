import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { ClaimEventData } from 'store/api/types'
import { ClaimType } from './ClaimsScreen/ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { stringToTitleCase } from 'utils/formattingUtils'
import AppealDetailsScreen from './ClaimsScreen/AppealDetailsScreen/AppealDetailsScreen'
import AskForClaimDecision from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import ClaimDetailsScreen from './ClaimsScreen/ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimsScreen from './ClaimsScreen/ClaimsScreen'
import ConsolidatedClaimsNote from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import FileRequest from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import SelectFile from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import TakePhotos from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadFile from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import UploadOrAddPhotos from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
import WhatDoIDoIfDisagreement from './ClaimsScreen/ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'

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
    <BenefitsStack.Screen key={'Claims'} name="Claims" component={ClaimsScreen} options={{ title: t('claims.title') }} />,
    <BenefitsStack.Screen key={'ClaimDetailsScreen'} name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('statusDetails.title') }} />,
    <BenefitsStack.Screen key={'ConsolidatedClaimsNote'} name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />,
    <BenefitsStack.Screen key={'WhatDoIDoIfDisagreement'} name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />,
    <BenefitsStack.Screen key={'AppealDetailsScreen'} name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('statusDetails.title') }} />,
    <BenefitsStack.Screen key={'FileRequest'} name="FileRequest" component={FileRequest} options={{ title: t('fileRequest.title') }} />,
    <BenefitsStack.Screen key={'AskForClaimDecision'} name="AskForClaimDecision" component={AskForClaimDecision} options={{ title: t('askForClaimDecision.pageTitle') }} />,
    <BenefitsStack.Screen key={'TakePhotos'} name="TakePhotos" component={TakePhotos} options={{ title: stringToTitleCase(t('fileUpload.takeOrSelectPhotos')) }} />,
    <BenefitsStack.Screen key={'SelectFile'} name="SelectFile" component={SelectFile} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'UploadOrAddPhotos'} name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'UploadFile'} name="UploadFile" component={UploadFile} options={{ title: t('fileUpload.title') }} />,
    <BenefitsStack.Screen key={'FileRequestDetails'} name="FileRequestDetails" component={FileRequestDetails} options={{ title: t('fileRequest.title') }} />,
  ]
}
