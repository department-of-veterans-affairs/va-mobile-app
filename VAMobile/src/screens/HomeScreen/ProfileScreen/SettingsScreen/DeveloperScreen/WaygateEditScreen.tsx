import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'

import {
  Box,
  ButtonDecoratorType,
  FullScreenSubtask,
  SimpleList,
  SimpleListItemObj,
  TextView,
  VATextInput,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { HomeStackParamList } from 'screens/HomeScreen/HomeStackScreens'
import { useTheme } from 'utils/hooks'

type WaygateEditScreenProps = StackScreenProps<HomeStackParamList, 'WaygateEdit'>

function WaygateEditScreen({ navigation, route }: WaygateEditScreenProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const scrollViewRef = useRef<ScrollView>(null)
  const { waygateName, waygate } = route.params
  const title = `Edit: ${waygateName}`
  const wg = waygate
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const [enabledOverride, setEnabledOverride] = useState(wg.enabled)
  const [appUpdateButtonOverride, setAppUpdateButtonOverride] = useState(wg.appUpdateButton)
  const [typeOverride, setTypeOverride] = useState(wg.type)
  const [errorMsgTitleOverride, setErrorMsgTitleOverride] = useState(wg.errorMsgTitle)
  const [errorMsgBodyOverride, setErrorMsgBodyOverride] = useState(wg.errorMsgBody)
  const [errorMsgBodyV2Override, setErrorMsgBodyV2Override] = useState(wg.errorMsgBodyV2)
  const [errorPhoneNumberOverride, setErrorPhoneNumber] = useState(wg.errorPhoneNumber)

  useEffect(() => {
    if (onSaveClicked) {
      wg.enabled = enabledOverride
      wg.appUpdateButton = appUpdateButtonOverride
      wg.type = typeOverride
      wg.errorMsgTitle = errorMsgTitleOverride
      wg.errorMsgBody = errorMsgBodyOverride
      wg.errorMsgBodyV2 = errorMsgBodyV2Override
      wg.errorPhoneNumber = errorPhoneNumberOverride
      navigation.goBack()
    }
  }, [
    onSaveClicked,
    navigation,
    wg,
    enabledOverride,
    appUpdateButtonOverride,
    typeOverride,
    errorMsgTitleOverride,
    errorMsgBodyOverride,
    errorMsgBodyV2Override,
    errorPhoneNumberOverride,
  ])

  const toggleItems: SimpleListItemObj[] = [
    {
      text: 'Enabled',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: enabledOverride,
        testID: 'remoteConfigEnableTestID',
      },
      onPress: (): void => setEnabledOverride(!enabledOverride),
    },
    {
      text: 'appUpdateButton',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: appUpdateButtonOverride,
        testID: 'remoteConfigAppUpdateTestID',
      },
      onPress: (): void => setAppUpdateButtonOverride(!appUpdateButtonOverride),
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
        <TextView variant="MobileBodyBold">type (DenyAccess, AllowFunction, DenyContent)</TextView>
        <VATextInput
          inputType="none"
          value={typeOverride}
          testID="AFTypeTestID"
          onChange={(val) => {
            setTypeOverride(val)
          }}
        />
        <TextView variant="MobileBodyBold">errorMsgTitle</TextView>
        <VATextInput
          inputType="none"
          value={errorMsgTitleOverride}
          testID="AFErrorMsgTitleTestID"
          onChange={(val) => {
            setErrorMsgTitleOverride(val)
          }}
        />
        <TextView variant="MobileBodyBold">errorMsgBody</TextView>
        <VATextInput
          inputType="none"
          value={errorMsgBodyOverride}
          testID="AFErrorMsgBodyTestID"
          onChange={(val) => {
            setErrorMsgBodyOverride(val)
          }}
        />
        <TextView variant="MobileBodyBold">errorMsgBodyV2</TextView>
        <VATextInput
          inputType="none"
          value={errorMsgBodyV2Override}
          testID="AFErrorMsgBodyV2TestID"
          onChange={(val) => {
            setErrorMsgBodyV2Override(val)
          }}
        />
        <TextView variant="MobileBodyBold">errorPhoneNumber</TextView>
        <VATextInput
          inputType="none"
          value={errorPhoneNumberOverride}
          testID="AFErrorPhoneNumberTestID"
          onChange={(val) => {
            setErrorPhoneNumber(val)
          }}
        />
      </Box>
    </FullScreenSubtask>
  )
}

export default WaygateEditScreen
