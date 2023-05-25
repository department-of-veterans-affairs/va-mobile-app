import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { ViewStyle } from 'react-native'
import { useTheme } from 'styled-components'

type AppointmentFlowLayoutProps = {
  /** Optional action for the back or single button */
  firstActionButtonPress?: () => void
  /** Optional action for the continue button*/
  secondActionButtonPress?: () => void
  /** Optional boolean to disable first action button  */
  disableFirstAction?: boolean
  /** Optional boolean to disable second action button  */
  disableSecondAction?: boolean
  /** optional text for the screens that need the link above the bottom buttons */
  linkText?: string
  /** optional action for when the link is pressed */
  onLinkPress?: () => void
  /** Optional name for the back or single button */
  firstActionButtonTitle?: string
  /** Optional name for continue button */
  secondActionButtonTitle?: string
}

/** Component for the common sections for the appointment flow modal steps */
const AppointmentFlowLayout: FC<AppointmentFlowLayoutProps> = ({
  firstActionButtonPress,
  firstActionButtonTitle,
  secondActionButtonPress,
  secondActionButtonTitle,
  disableFirstAction,
  disableSecondAction,
  linkText,
  onLinkPress,
  children,
}) => {
  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const getButtonSection = () => {
    const firstActionPress = firstActionButtonPress ? firstActionButtonPress : () => {}
    if (secondActionButtonPress) {
      return (
        <Box flexDirection="row" alignItems="center">
          <Box flex={1} mr={10}>
            <VAButton
              onPress={firstActionPress}
              label={firstActionButtonTitle || tc('back')}
              buttonType={'buttonSecondary'}
              disabled={disableFirstAction}
              a11yHint={t('requestAppointment.backBtnA11yHint')}
            />
          </Box>
          <Box flex={1}>
            <VAButton
              onPress={secondActionButtonPress}
              label={secondActionButtonTitle || tc('continue')}
              buttonType={'buttonPrimary'}
              disabled={disableSecondAction}
              minHeight={53}
              a11yHint={t('requestAppointment.continueBtnA11yHint')}
            />
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          <VAButton onPress={firstActionPress} label={firstActionButtonTitle || t('appointments.submitAppointmentRequest')} buttonType={'buttonPrimary'} />
        </Box>
      )
    }
  }

  const scrollViewStyle: ViewStyle = {
    flexGrow: 1,
  }

  return (
    <Box flex={1} backgroundColor={'main'} pt={theme.dimensions.condensedMarginBetween}>
      <VAScrollView contentContainerStyle={scrollViewStyle}>{children}</VAScrollView>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter} mt={30}>
        {!!linkText && (
          <TextView variant="MobileBodyLink" onPress={onLinkPress} mb={theme.dimensions.contentMarginBottom}>
            {linkText}
          </TextView>
        )}

        {getButtonSection()}
      </Box>
    </Box>
  )
}

export default AppointmentFlowLayout
