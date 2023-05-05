import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useLayoutEffect } from 'react'

import { Box, ClosePanelButton, LargePanel, TextView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getStatusDefinitionTextForRefillStatus } from 'utils/prescriptions'
import { isIOS } from 'utils/platform'
import { usePanelHeaderStyles, useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

type StatusDefinitionProps = StackScreenProps<HealthStackParamList, 'StatusDefinition'>

const StatusDefinition: FC<StatusDefinitionProps> = ({ navigation, route }) => {
  const { display, value } = route.params
  const headerStyle = usePanelHeaderStyles()
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { text, a11yLabel } = getStatusDefinitionTextForRefillStatus(value, tc)

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
