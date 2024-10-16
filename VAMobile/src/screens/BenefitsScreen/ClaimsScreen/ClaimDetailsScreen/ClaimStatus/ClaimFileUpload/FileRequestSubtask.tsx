import React, { createContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { ClaimData, ClaimEventData } from 'api/types'
import { Box, FullScreenSubtask } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'

import FileRequest from './FileRequest'
import FileRequestDetails from './FileRequestDetails/FileRequestDetails'
import SelectFile from './SelectFile/SelectFile'
import TakePhotos from './TakePhotos/TakePhotos'
import UploadOrAddPhotos from './TakePhotos/UploadOrAddPhotos/UploadOrAddPhotos'

export type FileRequestStackParams = {
  FileRequest: undefined
  FileRequestDetails: {
    request: ClaimEventData
  }
  SelectFile: {
    request: ClaimEventData
  }
  TakePhotos: {
    request: ClaimEventData
  }
  UploadOrAddPhotos: {
    firstImageResponse: ImagePickerResponse
    request?: ClaimEventData
  }
}
const FileRequestStack = createStackNavigator<FileRequestStackParams>()

// Shared with SubmitEvidenceSubtask
export const fileRequestSharedScreens = [
  <FileRequestStack.Screen name="FileRequestDetails" component={FileRequestDetails} key="FileRequestDetails" />,
  <FileRequestStack.Screen name="SelectFile" component={SelectFile} key="SelectFile" />,
  <FileRequestStack.Screen name="TakePhotos" component={TakePhotos} key="TakePhotos" />,
  <FileRequestStack.Screen name="UploadOrAddPhotos" component={UploadOrAddPhotos} key="UploadOrAddPhotos" />,
]

export const fileRequestScreenOptions = {
  headerShown: false,
  detachPreviousScreen: true,
  ...TransitionPresets.SlideFromRightIOS,
}

type FileRequestContextValue = {
  claimID: string
  claim: ClaimData | undefined
  setTitle: React.Dispatch<React.SetStateAction<string>>
  setLeftButtonText: React.Dispatch<React.SetStateAction<string>>
  setOnLeftButtonPress: React.Dispatch<React.SetStateAction<() => void>>
}
export const FileRequestContext = createContext<FileRequestContextValue>({} as FileRequestContextValue)

type FileRequestSubtaskProps = StackScreenProps<BenefitsStackParamList, 'FileRequestSubtask'>

function FileRequestSubtask({ navigation, route }: FileRequestSubtaskProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { claimID, claim } = route.params

  const [title, setTitle] = useState(t('fileRequest.title'))
  const [leftButtonText, setLeftButtonText] = useState(t('cancel'))
  const [onLeftButtonPress, setOnLeftButtonPress] = useState(() => navigation.goBack)

  return (
    <FullScreenSubtask
      leftButtonText={leftButtonText}
      onLeftButtonPress={onLeftButtonPress}
      title={title}
      testID="fileRequestPageTestID"
      leftButtonTestID="fileRequestPageBackID">
      <Box flex={1} backgroundColor="main">
        <FileRequestContext.Provider value={{ claimID, claim, setTitle, setLeftButtonText, setOnLeftButtonPress }}>
          <FileRequestStack.Navigator initialRouteName="FileRequest" screenOptions={fileRequestScreenOptions}>
            <FileRequestStack.Screen name="FileRequest" component={FileRequest} />
            {fileRequestSharedScreens}
          </FileRequestStack.Navigator>
        </FileRequestContext.Provider>
      </Box>
    </FullScreenSubtask>
  )
}

export default FileRequestSubtask
