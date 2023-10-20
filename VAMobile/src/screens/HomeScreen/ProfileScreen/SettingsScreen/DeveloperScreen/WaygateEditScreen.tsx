import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useRef, useState } from 'react'

import { Box, ButtonDecoratorType, FullScreenSubtask, SimpleList, SimpleListItemObj, TextView, VATextInput } from 'components'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type WaygateEditScreenProps = StackScreenProps<HomeStackParamList, 'WaygateEditScreen'>

/**
 * Screen for editing a users email in the personal info section
 */
const WaygateEditScreen: FC<WaygateEditScreenProps> = ({ navigation, route }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const scrollViewRef = useRef<ScrollView>(null)
  const { waygateName, waygate } = route.params
  const title = 'Edit: ' + waygateName
  const wg = waygate
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [enabledOverride, setEnabledOverride] = useState(wg.enabled)
  const [appUpdateButtonOverride, setAppUpdateButtonOverride] = useState(wg.appUpdateButton)
  const [allowFunctionOverride, setAllowFunctionOverride] = useState(wg.allowFunction)
  const [denyAccessOverride, setDenyAccessOverride] = useState(wg.denyAccess)
  const [errorMsgTitleOverride, setErrorMsgTitleOverride] = useState(wg.errorMsgTitle)
  const [errorMsgBodyOverride, setErrorMsgBodyOverride] = useState(wg.errorMsgBody)

  useEffect(() => {
    if (onSaveClicked) {
      wg.enabled = enabledOverride
      wg.appUpdateButton = appUpdateButtonOverride
      wg.allowFunction = allowFunctionOverride
      wg.denyAccess = denyAccessOverride
      wg.errorMsgTitle = errorMsgTitleOverride
      wg.errorMsgBody = errorMsgBodyOverride
      navigation.goBack()
    }
  }, [onSaveClicked, navigation, wg, enabledOverride, appUpdateButtonOverride, allowFunctionOverride, denyAccessOverride, errorMsgTitleOverride, errorMsgBodyOverride])

  const toggleItems: SimpleListItemObj[] = [
    {
      text: 'Enabled',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: enabledOverride,
      },
      onPress: (): void => setEnabledOverride(!enabledOverride),
    },
    {
      text: 'appUpdateButton',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: appUpdateButtonOverride,
      },
      onPress: (): void => setAppUpdateButtonOverride(!appUpdateButtonOverride),
    },
    {
      text: 'allowFunction',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: allowFunctionOverride,
      },
      onPress: (): void => setAllowFunctionOverride(!allowFunctionOverride),
    },
    {
      text: 'denyAccess',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: denyAccessOverride,
      },
      onPress: (): void => setDenyAccessOverride(!denyAccessOverride),
    },
  ]

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={title}
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      rightButtonText={t('save')}
      onRightButtonPress={() => setOnSaveClicked(true)}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <SimpleList items={toggleItems} />
        <TextView variant="MobileBodyBold">errorMsgTitle</TextView>
        <VATextInput
          inputType="none"
          value={errorMsgTitleOverride}
          onChange={(val) => {
            setErrorMsgTitleOverride(val)
          }}
        />
        <TextView variant="MobileBodyBold">errorMsgBody</TextView>
        <VATextInput
          inputType="none"
          value={errorMsgBodyOverride}
          onChange={(val) => {
            setErrorMsgBodyOverride(val)
          }}
        />
      </Box>
    </FullScreenSubtask>
  )
}

export default WaygateEditScreen
