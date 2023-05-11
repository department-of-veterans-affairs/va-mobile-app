import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useLayoutEffect } from 'react'

import { Box, TextView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useRequestAppointmentModalHeaderStyles } from 'utils/requestAppointments'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { WEBVIEW_URL_FACILITY_LOCATOR } = getEnv()

type GeneralHelpScreenProps = StackScreenProps<HealthStackParamList, 'GeneralHelpScreen'>

/** Component for the global general help screen inside the request appointment flow  */
const GeneralHelpScreen: FC<GeneralHelpScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { title, description } = route.params
  const onFacilityLocator = navigateTo('Webview', { url: WEBVIEW_URL_FACILITY_LOCATOR, displayTitle: tc('webview.vagov'), loadingMessage: tc('webview.valocation.loading') })
  const headerStyle = useRequestAppointmentModalHeaderStyles()

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
    })
  }, [navigation, headerStyle])

  return (
    <Box flex={1} backgroundColor={'main'}>
      <Box mx={theme?.dimensions?.gutter}>
        <TextView variant="MobileBodyBold" mt={theme?.dimensions?.contentMarginTop}>
          {title}
        </TextView>
        <TextView variant="MobileBody">{description}</TextView>
        <TextView
          mt={theme?.dimensions?.contentMarginTop}
          variant="MobileBodyLink"
          onPress={() => {
            navigation.goBack()
            onFacilityLocator()
          }}>
          {t('requestAppointments.generalHelpLinkText')}
        </TextView>
      </Box>
    </Box>
  )
}

export default GeneralHelpScreen
