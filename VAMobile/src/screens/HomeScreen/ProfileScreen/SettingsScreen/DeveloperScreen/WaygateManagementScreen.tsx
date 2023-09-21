import {
  AccordionCollapsible,
  Box,
  ButtonDecoratorType,
  ButtonTypesConstants,
  FeatureLandingTemplate,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
  VAButton,
} from 'components'
import { logout } from 'store/slices/authSlice'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import React, { FC, ReactFragment, ReactNode, useState } from 'react'
import remoteConfig from '@react-native-firebase/remote-config'

import { FeatureToggleType, featureEnabled, getWaygateToggles, setDebugConfig } from 'utils/remoteConfig'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { forEach } from 'underscore'
import { useTranslation } from 'react-i18next'

type WaygateManagementScreenProps = StackScreenProps<HomeStackParamList, 'WaygateManagement'>

const WaygateManagementScreen: FC<WaygateManagementScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const currentWaygateConfig = getWaygateToggles()
  const [toggles, setToggles] = useState({ ...currentWaygateConfig })

  const toggleList = (): ReactNode => {
    const toggleItems: Array<ReactNode> = []
    forEach(toggles, (WG, index) => {
      const { enabled, errorMsgTitle, errorMsgBody, appUpdateButton, allowFunction, denyAccess } = WG
      toggleItems.push(
        <AccordionCollapsible
          header={<TextView variant="MobileBodyBold">{index + ' ' + enabled}</TextView>}
          expandedInitialValue={!enabled}
          expandedContent={
            <Box>
              <TextView>{'errorMsgTitle ' + errorMsgTitle}</TextView>
              <TextView>{'errorMsgBody ' + errorMsgBody}</TextView>
              <TextView>{'appUpdateButton ' + appUpdateButton}</TextView>
              <TextView>{'allowFunction ' + allowFunction}</TextView>
              <TextView>{'denyAccess ' + denyAccess}</TextView>
            </Box>
          }
        />,
      )
    })
    return <Box mt={condensedMarginBetween}>{toggleItems}</Box>
  }

  return (
    <FeatureLandingTemplate backLabel={t('remoteConfig.title')} backLabelOnPress={navigation.goBack} title={t('waygateManagement.title')}>
      <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter} mt={standardMarginBetween}>
        Waygate Toggles
      </TextView>
      {toggleList()}
    </FeatureLandingTemplate>
  )
}

export default WaygateManagementScreen
