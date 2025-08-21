import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import remoteConfig from '@react-native-firebase/remote-config'
import { useIsFocused } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button, useSnackbar } from '@department-of-veterans-affairs/mobile-component-library'
import { forEach } from 'underscore'

import {
  AccordionCollapsible,
  Box,
  ButtonDecoratorType,
  FeatureLandingTemplate,
  SimpleList,
  SimpleListItemObj,
  TextArea,
  TextView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { logout } from 'store/slices/authSlice'
import { useAppDispatch, useRouteNavigation, useTheme } from 'utils/hooks'
import { FeatureToggleType, getFeatureToggles, setDebugConfig } from 'utils/remoteConfig'
import { getWaygateToggles, setWaygateDebugConfig } from 'utils/waygateConfig'

type RemoteConfigScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'RemoteConfig'>

function RemoteConfigScreen({ navigation }: RemoteConfigScreenSettingsScreenProps) {
  const snackbar = useSnackbar()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const navigateTo = useRouteNavigation()
  const { gutter, contentMarginBottom, standardMarginBetween, condensedMarginBetween } = theme.dimensions
  const currentConfig = getFeatureToggles()
  const [toggles, setToggles] = useState({ ...currentConfig })
  const currentWaygateConfig = getWaygateToggles()
  const [waygateToggles] = useState({ ...currentWaygateConfig })
  const isFocused = useIsFocused()

  useEffect(() => {
    isFocused && setWaygateDebugConfig(waygateToggles)
  }, [isFocused, waygateToggles])

  function toggleList() {
    const toggleItems = Object.keys(toggles).map((key): SimpleListItemObj => {
      return {
        text: `${key}`,
        decorator: ButtonDecoratorType.Switch,
        decoratorProps: {
          on: toggles[key as FeatureToggleType],
        },
        onPress: () => {
          setToggles({
            ...toggles,
            [key]: !toggles[key as FeatureToggleType],
          })
        },
      }
    })

    return (
      <Box mt={condensedMarginBetween}>
        <SimpleList items={toggleItems} />
      </Box>
    )
  }

  function toggleWaygateList() {
    const toggleItems: Array<React.ReactNode> = []
    forEach(waygateToggles, (wg, index) => {
      const { enabled, type, errorMsgTitle, errorMsgBody, appUpdateButton, errorMsgBodyV2, errorPhoneNumber } = wg
      toggleItems.push(
        <AccordionCollapsible
          header={
            <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap" mr={5}>
              <Button onPress={() => navigateTo('WaygateEdit', { waygateName: index, waygate: wg })} label={index} />
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
                <TextView variant="MobileBodyBold">{'type: '}</TextView>
                <TextView>{type}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column" flexWrap="wrap">
                <TextView variant="MobileBodyBold">{'errorMsgTitle: '}</TextView>
                <TextView>{errorMsgTitle}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column">
                <TextView variant="MobileBodyBold">{'errorMsgBody: '}</TextView>
                <TextView>{errorMsgBody}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column">
                <TextView variant="MobileBodyBold">{'errorMsgBodyV2: '}</TextView>
                <TextView>{errorMsgBodyV2}</TextView>
              </Box>
              <Box justifyContent="space-between" flexDirection="column">
                <TextView variant="MobileBodyBold">{'errorPhoneNumber: '}</TextView>
                <TextView>{errorPhoneNumber}</TextView>
              </Box>
            </Box>
          }
        />,
      )
    })
    return <Box mt={condensedMarginBetween}>{toggleItems}</Box>
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('debug.title')}
      backLabelOnPress={navigation.goBack}
      title={t('remoteConfig.title')}
      testID="remoteConfigTestID">
      <Box mb={contentMarginBottom}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">Last fetch status</TextView>
            <TextView>{remoteConfig().lastFetchStatus}</TextView>
          </TextArea>
        </Box>
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mx={gutter} mt={standardMarginBetween}>
          Override Toggles
        </TextView>
        {toggleList()}
        <Box mt={theme.dimensions.contentMarginTop}>
          <TextArea>
            <Button
              onPress={() => {
                if (JSON.stringify(currentConfig) === JSON.stringify(toggles)) {
                  snackbar.show('No values changed', { isError: true })
                  return
                }
                dispatch(logout())
                setDebugConfig(toggles)
              }}
              label={'Apply Overrides'}
            />
          </TextArea>
        </Box>
        {toggleWaygateList()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default RemoteConfigScreen
