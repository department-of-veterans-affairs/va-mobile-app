import { StackScreenProps } from '@react-navigation/stack'
import React, { FC, useLayoutEffect } from 'react'

import { Box, ClosePanelButton, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ViewStyle } from 'react-native'
import { getStatusGlossaryTextForRefillStatus } from 'utils/prescriptions'
import { isIOS } from 'utils/platform'
import { usePanelHeaderStyles, useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

type StatusGlossaryProps = StackScreenProps<HealthStackParamList, 'StatusGlossary'>

const StatusGlossary: FC<StatusGlossaryProps> = ({ navigation, route }) => {
  const { display, value } = route.params
  const headerStyle = usePanelHeaderStyles()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { text, a11yLabel } = getStatusGlossaryTextForRefillStatus(value, t)

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

  const scrollStyles: ViewStyle = {
    flex: 1,
    backgroundColor: theme.colors.background.panelHeader,
  }

  return (
    <VAScrollView contentContainerStyle={scrollStyles}>
      <Box mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextView variant="MobileBodyBold">{display}</TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.condensedMarginBetween} accessibilityLabel={a11yLabel}>
          {text}
        </TextView>
      </Box>
    </VAScrollView>
  )
}

export default StatusGlossary
