import { ScrollView, ViewStyle } from 'react-native'
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactElement, useEffect, useState } from 'react'

import { prefetchInboxMessages } from 'store/actions'

import { AlertBox, Box, ErrorComponent, SegmentedControl } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { SecureMessagingStackParamList } from './SecureMessagingStackScreens'
import { testIdProps } from 'utils/accessibility'
import { useError, useHeaderStyles, useTheme, useTranslation } from 'utils/hooks'
import Folders from './Folders/Folders'
import Inbox from './Inbox/Inbox'

type SecureMessagingScreenProps = StackScreenProps<SecureMessagingStackParamList, 'SecureMessaging'>

const SecureMessagingScreen: FC<SecureMessagingScreenProps> = ({}) => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const theme = useTheme()
  const dispatch = useDispatch()
  const controlValues = [t('secureMessagingTab.inbox'), t('secureMessagingTab.folders')]
  const a11yHints = [t('secureMessagingTab.inbox.a11yHint'), t('secureMessagingTab.folders.a11yHint')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  useEffect(() => {
    // fetch inbox message list
    dispatch(prefetchInboxMessages(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID))
  }, [dispatch])

  if (useError(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID)) {
    return <ErrorComponent />
  }

  const serviceErrorAlert = (): ReactElement => {
    // TODO error alert from state
    return <></>
  }

  const scrollStyles: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <ScrollView {...testIdProps('SecureMessaging-page')} contentContainerStyle={scrollStyles}>
      <Box flex={1} justifyContent="flex-start">
        <Box mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <SegmentedControl values={controlValues} titles={controlValues} onChange={setSelectedTab} selected={controlValues.indexOf(selectedTab)} accessibilityHints={a11yHints} />
        </Box>
        {serviceErrorAlert()}
        <Box flex={1} mb={theme.dimensions.contentMarginBottom}>
          {selectedTab === t('secureMessagingTab.inbox') && <Inbox />}
          {selectedTab === t('secureMessagingTab.folders') && <Folders />}
        </Box>
      </Box>
    </ScrollView>
  )
}

type SecureMessagingStackScreenProps = Record<string, unknown>

const SecureMessagingScreenStack = createStackNavigator()

/**
 * Stack screen for the Secure messaging tab. Screens placed within this stack will appear in the context of the app level tab navigator
 */
const SecureMessagingStackScreen: FC<SecureMessagingStackScreenProps> = () => {
  const t = useTranslation(NAMESPACE.SECURE_MESSAGING)
  const headerStyles = useHeaderStyles()

  return (
    <SecureMessagingScreenStack.Navigator screenOptions={{ ...headerStyles, headerShown: false }}>
      <SecureMessagingScreenStack.Screen name="Messages" component={SecureMessagingScreen} options={{ title: t('title') }} />
    </SecureMessagingScreenStack.Navigator>
  )
}

export default SecureMessagingStackScreen
