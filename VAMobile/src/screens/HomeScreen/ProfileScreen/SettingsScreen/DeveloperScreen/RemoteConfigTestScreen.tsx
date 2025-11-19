import React from 'react'
import { useTranslation } from 'react-i18next'

import remoteConfig from '@react-native-firebase/remote-config'
import { StackScreenProps } from '@react-navigation/stack'

import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

type RemoteConfigTestScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'RemoteConfigTestScreen'>

function RemoteConfigTestScreen({ navigation }: RemoteConfigTestScreenSettingsScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions

  const configTest = () => {
    const testEnabled = featureEnabled('remoteConfigRefreshTest')

    if (testEnabled) {
      return (
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'}>
          My potentially scary feature is ENABLED
        </TextView>
      )
    } else {
      return (
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'}>
          Feature is DISABLED
        </TextView>
      )
    }
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('debug.title')}
      backLabelOnPress={navigation.goBack}
      title={t('Remote Config Refresh Test')}>
      <Box mb={contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>{configTest()}</TextArea>
        </Box>

        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">Last fetch status</TextView>
            <TextView>{remoteConfig().lastFetchStatus}</TextView>
          </TextArea>
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default RemoteConfigTestScreen
