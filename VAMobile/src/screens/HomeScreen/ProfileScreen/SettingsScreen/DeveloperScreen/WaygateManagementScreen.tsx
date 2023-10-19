import { AccordionCollapsible, Box, ButtonTypesConstants, FeatureLandingTemplate, TextView, VAButton } from 'components'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { forEach } from 'underscore'
import { getWaygateToggles } from 'utils/remoteConfig'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

type WaygateManagementScreenProps = StackScreenProps<HomeStackParamList, 'WaygateManagement'>

const WaygateManagementScreen: FC<WaygateManagementScreenProps> = ({ navigation }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { gutter, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const currentWaygateConfig = getWaygateToggles()
  const [toggles, setToggles] = useState({ ...currentWaygateConfig })
  const isFocused = useIsFocused()

  useEffect(() => {
    isFocused && setToggles(getWaygateToggles())
  }, [isFocused, setToggles])

  const toggleList = (): ReactNode => {
    const toggleItems: Array<ReactNode> = []
    // Object.keys(toggles).forEach((wg, key) => {
    // _.forEach(toggles, (wg, key) => {
    forEach(toggles, (wg, index) => {
      const { enabled, errorMsgTitle, errorMsgBody, appUpdateButton, allowFunction, denyAccess } = wg
      toggleItems.push(
        <AccordionCollapsible
          header={
            <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap" mr={5}>
              <VAButton onPress={navigateTo('WaygateEditScreen', { waygateName: index, waygate: wg })} label={index} buttonType={ButtonTypesConstants.buttonPrimary} />
              <TextView variant="MobileBodyBold">{`${enabled}`}</TextView>
            </Box>
          }
          expandedInitialValue={!enabled}
          expandedContent={
            <Box mr={20}>
              <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap">
                <TextView variant="MobileBodyBold">{'appUpdateButton: '}</TextView>
                <TextView>{`${appUpdateButton}`}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap">
                <TextView variant="MobileBodyBold">{'allowFunction: '}</TextView>
                <TextView>{`${allowFunction}`}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap">
                <TextView variant="MobileBodyBold">{'denyAccess: '}</TextView>
                <TextView>{`${denyAccess}`}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column" flexWrap="wrap">
                <TextView variant="MobileBodyBold">{'errorMsgTitle: '}</TextView>
                <TextView>{errorMsgTitle}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column">
                <TextView variant="MobileBodyBold">{'errorMsgBody: '}</TextView>
                <TextView>{errorMsgBody}</TextView>
              </Box>
            </Box>
          }
        />,
      )
    })
    return <Box mt={condensedMarginBetween}>{toggleItems}</Box>
  }

  return (
    <FeatureLandingTemplate backLabel={t('remoteConfig.title')} backLabelOnPress={navigation.goBack} title={t('waygateManagement.title')}>
      <Box mx={gutter}>
        <TextView>
          <TextView variant="MobileBodyBold">Enabled:</TextView> 'false' = waygate.
        </TextView>
        <TextView>
          <TextView variant="MobileBodyBold">appUpdateButton:</TextView> 'true' = button.
        </TextView>
        <TextView>
          <TextView variant="MobileBodyBold">allowFunction:</TextView> 'false' = hinder access.
        </TextView>
        <TextView>
          <TextView variant="MobileBodyBold">denyAccess:</TextView> 'true' = native Alert.
        </TextView>
      </Box>
      <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter} mt={standardMarginBetween}>
        Waygate Toggles
      </TextView>
      {toggleList()}
    </FeatureLandingTemplate>
  )
}

export default WaygateManagementScreen
