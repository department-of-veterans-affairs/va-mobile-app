import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, useRef, useState } from 'react'

import { Box, ButtonDecoratorType, FullScreenSubtask, SimpleList, SimpleListItemObj, TextView } from 'components'
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
  const { waygateName, waygate } = route.params
  const [onSaveClicked, setOnSaveClicked] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)
  const title = 'Edit: ' + waygateName
  const wg = waygate

  const toggleItems: SimpleListItemObj[] = [
    {
      text: 'Enabled',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: wg.enabled,
      },
      onPress: () => {
        wg.enabled = !wg.enabled
      },
    },
    {
      text: 'appUpdateButton',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: waygate.appUpdateButton,
      },
      onPress: () => {
        waygate.appUpdateButton = !waygate.appUpdateButton
      },
    },
    {
      text: 'allowFunction',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: waygate.allowFunction,
      },
      onPress: () => {
        waygate.allowFunction = !waygate.allowFunction
      },
    },
    {
      text: 'denyAccess',
      decorator: ButtonDecoratorType.Switch,
      decoratorProps: {
        on: waygate.denyAccess,
      },
      onPress: () => {
        waygate.denyAccess = !waygate.denyAccess
      },
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
        <TextView>{waygate.errorMsgTitle}</TextView>
        <TextView variant="MobileBodyBold">errorMsgBody</TextView>
        <TextView>{waygate.errorMsgBody}</TextView>
      </Box>
    </FullScreenSubtask>
  )
}

export default WaygateEditScreen
