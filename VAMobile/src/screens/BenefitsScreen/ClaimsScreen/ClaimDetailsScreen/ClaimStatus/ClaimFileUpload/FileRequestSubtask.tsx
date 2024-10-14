import React, { createContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'

import { ClaimData, ClaimEventData } from 'api/types'
import { Box, FullScreenSubtask } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'

import FileRequest from './FileRequest'
import FileRequestDetails from './FileRequestDetails/FileRequestDetails'

export type FileRequestStackParams = {
  FileRequest: undefined
  FileRequestDetails: {
    request: ClaimEventData
  }
}
const FileRequestStack = createStackNavigator<FileRequestStackParams>()

type SubtaskContextValue = {
  claimID: string
  claim: ClaimData | undefined
  setLeftButtonText: React.Dispatch<React.SetStateAction<string>>
  setOnLeftButtonPress: React.Dispatch<React.SetStateAction<() => void>>
}
export const SubtaskContext = createContext<SubtaskContextValue>({} as SubtaskContextValue)

type FileRequestSubtaskProps = StackScreenProps<BenefitsStackParamList, 'FileRequestSubtask'>

function FileRequestSubtask({ navigation, route }: FileRequestSubtaskProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { claimID, claim } = route.params

  const [leftButtonText, setLeftButtonText] = useState(t('cancel'))
  const [onLeftButtonPress, setOnLeftButtonPress] = useState(() => navigation.goBack)

  const navigationState = navigation.getState()
  const nestedRouteIsFocused = !!navigationState.routes[navigationState.index]?.state?.index

  useEffect(() => {
    if (!nestedRouteIsFocused) {
      setLeftButtonText(t('cancel'))
      setOnLeftButtonPress(() => navigation.goBack)
    }
  }, [navigation.goBack, nestedRouteIsFocused, t])

  return (
    <FullScreenSubtask
      leftButtonText={leftButtonText}
      onLeftButtonPress={onLeftButtonPress}
      title={t('fileRequest.title')}
      testID="fileRequestPageTestID"
      leftButtonTestID="fileRequestPageBackID">
      <Box flex={1} backgroundColor="main">
        <SubtaskContext.Provider value={{ claimID, claim, setLeftButtonText, setOnLeftButtonPress }}>
          <FileRequestStack.Navigator
            initialRouteName="FileRequest"
            screenOptions={{
              headerShown: false,
              detachPreviousScreen: true,
              ...TransitionPresets.SlideFromRightIOS,
            }}>
            <FileRequestStack.Screen name="FileRequest" component={FileRequest} />
            <FileRequestStack.Screen name="FileRequestDetails" component={FileRequestDetails} />
          </FileRequestStack.Navigator>
        </SubtaskContext.Provider>
      </Box>
    </FullScreenSubtask>
  )
}

export default FileRequestSubtask
