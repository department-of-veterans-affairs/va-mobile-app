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
import React, { FC, ReactNode, useEffect, useState } from 'react'
import remoteConfig from '@react-native-firebase/remote-config'

import { FeatureToggleType, getFeatureToggles, setDebugConfig } from 'utils/remoteConfig'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { StackScreenProps } from '@react-navigation/stack'
import { forEach } from 'underscore'
import { getWaygateToggles, setWaygateDebugConfig } from 'utils/waygateConfig'
import { useIsFocused } from '@react-navigation/native'
import { useTranslation } from 'react-i18next'

type RemoteConfigScreenSettingsScreenProps = StackScreenProps<HomeStackParamList, 'RemoteConfig'>

const RemoteConfigScreen: FC<RemoteConfigScreenSettingsScreenProps> = ({ navigation }) => {
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

  const toggleList = (): ReactNode => {
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

  const toggleWaygateList = (): ReactNode => {
    const toggleItems: Array<ReactNode> = []
    forEach(waygateToggles, (wg, index) => {
      const { enabled, type, errorMsgTitle, errorMsgBody, appUpdateButton } = wg
      toggleItems.push(
        <AccordionCollapsible
          header={
            <Box justifyContent="space-between" flexDirection="row" flexWrap="wrap" mr={5}>
              <VAButton onPress={navigateTo('WaygateEdit', { waygateName: index, waygate: wg })} label={index} buttonType={ButtonTypesConstants.buttonPrimary} />
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
            </Box>
          }
        />,
      )
    })
    return <Box mt={condensedMarginBetween}>{toggleItems}</Box>
  }

  return (
    <FeatureLandingTemplate backLabel={t('debug.title')} backLabelOnPress={navigation.goBack} title={t('remoteConfig.title')}>
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
            <VAButton
              onPress={() => {
                dispatch(logout())
                setDebugConfig(toggles)
              }}
              label={'Apply Overrides'}
              buttonType={ButtonTypesConstants.buttonPrimary}
              disabled={JSON.stringify(currentConfig) === JSON.stringify(toggles)}
            />
          </TextArea>
        </Box>
        {toggleWaygateList()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default RemoteConfigScreen
