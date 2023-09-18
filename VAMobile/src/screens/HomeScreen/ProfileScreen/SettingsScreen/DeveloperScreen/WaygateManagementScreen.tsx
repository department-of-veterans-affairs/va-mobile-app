import { Box, ButtonDecoratorType, ButtonTypesConstants, FeatureLandingTemplate, SimpleList, SimpleListItemObj, TextArea, TextView, VAButton } from 'components'
import { logout } from 'store/slices/authSlice'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import React, { FC, ReactNode, useState } from 'react'
import remoteConfig from '@react-native-firebase/remote-config'

import { FeatureToggleType, featureEnabled, getFeatureToggles, overrideRemote, setDebugConfig } from 'utils/remoteConfig'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'

type WaygateManagementScreenProps = StackScreenProps<HomeStackParamList, 'WaygateManagement'>

const WaygateManagementScreen: FC<WaygateManagementScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  return <FeatureLandingTemplate backLabel={t('remoteConfig.title')} backLabelOnPress={navigation.goBack} title={t('waygateManagement.title')} />
}

export default WaygateManagementScreen
