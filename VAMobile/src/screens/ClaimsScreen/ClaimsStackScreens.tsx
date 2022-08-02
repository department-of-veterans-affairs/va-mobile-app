import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { TFunction } from 'i18next'
import { createStackNavigator } from '@react-navigation/stack'
import React, { ReactNode } from 'react'

import { ClaimEventData } from 'store/api/types'
import { ClaimType } from './ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import { stringToTitleCase } from 'utils/formattingUtils'
import AppealDetailsScreen from './AppealDetailsScreen/AppealDetailsScreen'
import AskForClaimDecision from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import ClaimDetailsScreen from './ClaimDetailsScreen/ClaimDetailsScreen'
import ConsolidatedClaimsNote from './ClaimDetailsScreen/ClaimStatus/ConsolidatedClaimsNote/ConsolidatedClaimsNote'
import FileRequest from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import SelectFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import TakePhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadFile from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import UploadOrAddPhotos from './ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'
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

const ClaimsStack = createStackNavigator<ClaimsStackParamList>()

export const getClaimsScreens = (t: TFunction): Array<ReactNode> => {
  return [
    <ClaimsStack.Screen key={'ClaimDetailsScreen'} name="ClaimDetailsScreen" component={ClaimDetailsScreen} options={{ title: t('statusDetails.title') }} />,
    <ClaimsStack.Screen key={'ConsolidatedClaimsNote'} name="ConsolidatedClaimsNote" component={ConsolidatedClaimsNote} />,
    <ClaimsStack.Screen key={'WhatDoIDoIfDisagreement'} name="WhatDoIDoIfDisagreement" component={WhatDoIDoIfDisagreement} />,
    <ClaimsStack.Screen key={'AppealDetailsScreen'} name="AppealDetailsScreen" component={AppealDetailsScreen} options={{ title: t('statusDetails.title') }} />,
    <ClaimsStack.Screen key={'FileRequest'} name="FileRequest" component={FileRequest} options={{ title: t('fileRequest.title') }} />,
    <ClaimsStack.Screen key={'AskForClaimDecision'} name="AskForClaimDecision" component={AskForClaimDecision} options={{ title: t('askForClaimDecision.pageTitle') }} />,
    <ClaimsStack.Screen key={'TakePhotos'} name="TakePhotos" component={TakePhotos} options={{ title: stringToTitleCase(t('fileUpload.takeOrSelectPhotos')) }} />,
    <ClaimsStack.Screen key={'SelectFile'} name="SelectFile" component={SelectFile} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadOrAddPhotos'} name="UploadOrAddPhotos" component={UploadOrAddPhotos} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'UploadFile'} name="UploadFile" component={UploadFile} options={{ title: t('fileUpload.title') }} />,
    <ClaimsStack.Screen key={'FileRequestDetails'} name="FileRequestDetails" component={FileRequestDetails} options={{ title: t('fileRequest.title') }} />,
  ]
}
