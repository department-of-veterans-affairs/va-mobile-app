import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { ClaimEventData } from 'store/api/types'
import { ClaimType } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import AppealDetailsScreen from './AppealDetailsScreen/AppealDetailsScreen'
import AskForClaimDecision from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import ClaimDetailsScreen from './ClaimDetailsScreen/ClaimDetailsScreen'
import ClaimFileUpload from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/ClaimFileUpload'
import ConsolidatedClaimsNote from './ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import SelectFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import TakePhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadConfirmation from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/UploadConfirmation/UploadConfirmation'
import UploadFailure from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/UploadFailure/UploadFailure'
import UploadFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import UploadOrAddPhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
import UploadSuccess from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/UploadSucesss/UploadSuccess'
import WhatDoIDoIfDisagreement from './ClaimDetailsScreen/ClaimStatus/WhatDoIDoIfDisagreement/WhatDoIDoIfDisagreement'

export type DocumentPickerResponse = {
  uri: string
  fileCopyUri: string
  copyError?: string
  type: string
  name: string
  size: number
  base64?: string
}

export type ClaimsStackParamList = {
  Claims: undefined
  ClaimDetailsScreen: {
    claimID: string
    claimType: ClaimType
  }
  ConsolidatedClaimsNote: undefined
  WhatDoIDoIfDisagreement: undefined
  AppealDetailsScreen: {
    appealID: string
  }
  ClaimFileUpload: {
    claimID: string
  }
  AskForClaimDecision: {
    claimID: string
  }
  TakePhotos: {
    request: ClaimEventData
  }
  SelectFile: {
    request: ClaimEventData
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
  UploadConfirmation: {
    request: ClaimEventData
    filesList: Array<ImagePickerResponse> | Array<DocumentPickerResponse>
  }
  UploadSuccess: undefined
  UploadFailure: undefined
}

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

export const getClaimsScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <ClaimsStack.Screen key={'ClaimDetailsScreen'} name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('claimDetails.title') }} />,
    <ClaimsStack.Screen key={'ConsolidatedClaimsNote'} name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />,
    <ClaimsStack.Screen key={'WhatDoIDoIfDisagreement'} name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />,
    <ClaimsStack.Screen key={'AppealDetailsScreen'} name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('statusDetails.title') }} />,
    <ClaimsStack.Screen key={'ClaimFileUpload'} name="ClaimFileUpload" component={ClaimFileUpload} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'AskForClaimDecision'} name="AskForClaimDecision" component={AskForClaimDecision} />,
    <ClaimsStack.Screen key={'TakePhotos'} name="TakePhotos" component={TakePhotos} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'SelectFile'} name="SelectFile" component={SelectFile} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadOrAddPhotos'} name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadFile'} name="UploadFile" component={UploadFile} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadSuccess'} name="UploadSuccess" component={UploadSuccess} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadConfirmation'} name="UploadConfirmation" component={UploadConfirmation} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadFailure'} name="UploadFailure" component={UploadFailure} options={{ title: t('fileUpload.title') }} />,
  ]
}
