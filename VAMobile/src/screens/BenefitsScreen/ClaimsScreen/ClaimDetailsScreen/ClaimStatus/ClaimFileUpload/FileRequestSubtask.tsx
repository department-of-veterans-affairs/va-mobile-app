import React, { createContext, useEffect, useState } from 'react'
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

type FileRequestContextValue = {
  claimID: string
  claim: ClaimData | undefined
  setLeftButtonText: React.Dispatch<React.SetStateAction<string>>
  setOnLeftButtonPress: React.Dispatch<React.SetStateAction<() => void>>
}
export const FileRequestContext = createContext<FileRequestContextValue>({} as FileRequestContextValue)

type FileRequestSubtaskProps = StackScreenProps<BenefitsStackParamList, 'FileRequestSubtask'>

function FileRequestSubtask({ navigation, route }: FileRequestSubtaskProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { claimID, claim } = route.params

  const [leftButtonText, setLeftButtonText] = useState(t('cancel'))
  const [onLeftButtonPress, setOnLeftButtonPress] = useState(() => navigation.goBack)

  const navigationState = navigation.getState()
  const initialRouteIsFocused = !navigationState.routes[navigationState.index]?.state?.index

  useEffect(() => {
    if (initialRouteIsFocused) {
      setLeftButtonText(t('cancel'))
      setOnLeftButtonPress(() => navigation.goBack)
    }
  }, [initialRouteIsFocused, navigation.goBack, t])

  return (
    <FullScreenSubtask
      leftButtonText={leftButtonText}
      onLeftButtonPress={onLeftButtonPress}
      title={t('fileRequest.title')}
      testID="fileRequestPageTestID"
      leftButtonTestID="fileRequestPageBackID">
      <Box flex={1} backgroundColor="main">
        <FileRequestContext.Provider value={{ claimID, claim, setLeftButtonText, setOnLeftButtonPress }}>
          <FileRequestStack.Navigator
            initialRouteName="FileRequest"
            screenOptions={{
              headerShown: false,
              detachPreviousScreen: true,
              ...TransitionPresets.SlideFromRightIOS,
            }}>
            <FileRequestStack.Screen name="FileRequest" component={FileRequest} />
            <FileRequestStack.Screen name="FileRequestDetails" component={FileRequestDetails} />
            <FileRequestStack.Screen name="SelectFile" component={SelectFile} />
            <FileRequestStack.Screen name="TakePhotos" component={TakePhotos} />
            <FileRequestStack.Screen name="UploadOrAddPhotos" component={UploadOrAddPhotos} />
          </FileRequestStack.Navigator>
        </FileRequestContext.Provider>
      </Box>
    </FullScreenSubtask>
  )
}

export default FileRequestSubtask
