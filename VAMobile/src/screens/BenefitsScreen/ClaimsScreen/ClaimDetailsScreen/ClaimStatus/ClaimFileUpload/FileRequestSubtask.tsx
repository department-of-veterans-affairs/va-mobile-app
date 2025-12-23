import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { RootNavStackParamList } from 'App'

import { ClaimData, ClaimEventData } from 'api/types'
import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import AskForClaimDecision from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/AskForClaimDecision/AskForClaimDecision'
import File5103RequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103RequestDetails/File5103RequestDetails'
import File5103ReviewWaiver from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103ReviewWaiver/File5103ReviewWaiver'
import File5103SubmitEvidence from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/File5103SubmitEvidence/File5103SubmitEvidence'
import FileRequest from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequest'
import FileRequestDetails from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/FileRequestDetails/FileRequestDetails'
import SelectFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/SelectFile'
import UploadFile from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/SelectFile/UploadFile/UploadFile'
import TakePhotos from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/TakePhotos'
import UploadOrAddPhotos from 'screens/BenefitsScreen/ClaimsScreen/ClaimDetailsScreen/ClaimStatus/ClaimFileUpload/TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'

export type FileRequestStackParams = {
  AskForClaimDecision: {
    claimID: string
  }
  FileRequest: {
    claimID: string
    claim: ClaimData | undefined
  }
  File5103RequestDetails: {
    claimID: string
    request: ClaimEventData
  }
  File5103ReviewWaiver: {
    claimID: string
    request: ClaimEventData
  }
  File5103SubmitEvidence: {
    claimID: string
    request: ClaimEventData
  }
  FileRequestDetails: {
    claimID: string
    request: ClaimEventData
  }
  SelectFile: {
    claimID: string
    request: ClaimEventData
  }
  TakePhotos: {
    claimID: string
    request: ClaimEventData
  }
  UploadFile: {
    claimID: string
    fileUploaded: DocumentPickerResponse
    imageUploaded: ImagePickerResponse
    request?: ClaimEventData
  }
  UploadOrAddPhotos: {
    claimID: string
    firstImageResponse: ImagePickerResponse
    request?: ClaimEventData
  }
}
const FileRequestStack = createStackNavigator<FileRequestStackParams>()

export const fileRequestSharedScreens = [
  <FileRequestStack.Screen name="AskForClaimDecision" component={AskForClaimDecision} key="AskForClaimDecision" />,
  <FileRequestStack.Screen name="File5103RequestDetails" component={File5103RequestDetails} key="FileRequestDetails" />,
  <FileRequestStack.Screen name="File5103ReviewWaiver" component={File5103ReviewWaiver} key="File5103ReviewWaiver" />,
  <FileRequestStack.Screen
    name="File5103SubmitEvidence"
    component={File5103SubmitEvidence}
    key="File5103SubmitEvidence"
  />,
  <FileRequestStack.Screen name="FileRequestDetails" component={FileRequestDetails} key="FileRequestDetails" />,
  <FileRequestStack.Screen name="SelectFile" component={SelectFile} key="SelectFile" />,
  <FileRequestStack.Screen name="TakePhotos" component={TakePhotos} key="TakePhotos" />,
  <FileRequestStack.Screen name="UploadFile" component={UploadFile} key="UploadFile" />,
  <FileRequestStack.Screen name="UploadOrAddPhotos" component={UploadOrAddPhotos} key="UploadOrAddPhotos" />,
]

type FileRequestSubtaskProps = StackScreenProps<RootNavStackParamList, 'FileRequestSubtask'>

function FileRequestSubtask({ route }: FileRequestSubtaskProps) {
  const { claimID, claim } = route.params

  return (
    <MultiStepSubtask<FileRequestStackParams> stackNavigator={FileRequestStack}>
      <FileRequestStack.Screen name="FileRequest" component={FileRequest} initialParams={{ claimID, claim }} />
      {fileRequestSharedScreens}
    </MultiStepSubtask>
  )
}

export default FileRequestSubtask
