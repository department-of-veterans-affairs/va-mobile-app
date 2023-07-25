import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useLayoutEffect } from 'react'

import { Box, ClosePanelButton, LargePanel, TextView } from 'components'
import { DateTime } from 'luxon'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getStatusDefinitionTextForRefillStatus } from 'utils/prescriptions'
import { isIOS } from 'utils/platform'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useTheme } from 'utils/hooks'
import { usePanelHeaderStyles } from 'utils/hooks/headerStyles'
import { useTranslation } from 'react-i18next'

type StatusDefinitionProps = StackScreenProps<HealthStackParamList, 'StatusDefinition'>

const StatusDefinition: FC<StatusDefinitionProps> = ({ navigation, route }) => {
  const { display, value } = route.params
  const headerStyle = usePanelHeaderStyles()
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { text, a11yLabel } = getStatusDefinitionTextForRefillStatus(value, tc)
  const timeOpened = DateTime.now().toMillis()

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: (props) => (
        <ClosePanelButton
          buttonText={tc('close')}
          onPress={props.onPress}
          buttonTextColor={'showAll'}
          focusOnButton={isIOS() ? false : true} // this is done due to ios not reading the button name on modal
        />
      ),
    })
  }, [navigation, headerStyle, tc])

  useBeforeNavBackListener(navigation, () => {
    const timeClosed = DateTime.now().toMillis()
    logAnalyticsEvent(Events.vama_rx_status(display, timeClosed - timeOpened))
  })

  return (
    <LargePanel title={tc('statusDefinition')} rightButtonText={tc('close')}>
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant="MobileBodyBold">{display}</TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween} accessibilityLabel={a11yLabel}>
          {text}
        </TextView>
      </Box>
    </LargePanel>
  )
}

export default StatusDefinition
