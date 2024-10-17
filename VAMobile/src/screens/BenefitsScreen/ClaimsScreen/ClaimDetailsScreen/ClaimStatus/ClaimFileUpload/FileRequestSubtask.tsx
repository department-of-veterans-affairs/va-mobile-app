import React from 'react'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'

import { ClaimData, ClaimEventData } from 'api/types'
import MultiStepSubtask from 'components/Templates/MultiStepSubtask'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'

import AskForClaimDecision from './AskForClaimDecision/AskForClaimDecision'
import FileRequest from './FileRequest'
import FileRequestDetails from './FileRequestDetails/FileRequestDetails'
import SelectFile from './SelectFile/SelectFile'
import TakePhotos from './TakePhotos/TakePhotos'
import UploadOrAddPhotos from './TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'

export type FileRequestStackParams = {
  AskForClaimDecision: {
    claimID: string
  }
  FileRequest: {
    claimID: string
    claim: ClaimData | undefined
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
  UploadOrAddPhotos: {
    claimID: string
    firstImageResponse: ImagePickerResponse
    request?: ClaimEventData
  }
}
const FileRequestStack = createStackNavigator<FileRequestStackParams>()

export const fileRequestSharedScreens = [
  <FileRequestStack.Screen name="AskForClaimDecision" component={AskForClaimDecision} key="AskForClaimDecision" />,
  <FileRequestStack.Screen name="FileRequestDetails" component={FileRequestDetails} key="FileRequestDetails" />,
  <FileRequestStack.Screen name="SelectFile" component={SelectFile} key="SelectFile" />,
  <FileRequestStack.Screen name="TakePhotos" component={TakePhotos} key="TakePhotos" />,
  <FileRequestStack.Screen name="UploadOrAddPhotos" component={UploadOrAddPhotos} key="UploadOrAddPhotos" />,
]

type FileRequestSubtaskProps = StackScreenProps<BenefitsStackParamList, 'FileRequestSubtask'>

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
