import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AlertBox, Box, TextView, VAButton, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type AppointmentFlowLayoutProps = {
  /** Optional action for the back or submit button */
  firstActionButtonPress?: () => void
  /** Optional action for the continue button*/
  secondActionButtonPress?: () => void
  /** Optional boolean to disable first action button  */
  disableFirstAction?: boolean
  /** Optional boolean to disable second action button  */
  disableSecondAction?: boolean
  /** Optional boolean to disable second action button  */
  pageTitle: string
  /** shows the error alert  */
  isError?: boolean
  /** alert error message */
  errorMessage?: string
}

/** Component for the common sections for the appointment flow modal steps */
const AppointmentFlowLayout: FC<AppointmentFlowLayoutProps> = ({
  firstActionButtonPress,
  secondActionButtonPress,
  disableFirstAction,
  disableSecondAction,
  children,
  isError,
  pageTitle,
  errorMessage,
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { contentMarginBottom, gutter, contentMarginTop, standardMarginBetween, condensedMarginBetween } = theme.dimensions

  const getButtonSection = () => {
    const firstActionPress = firstActionButtonPress ? firstActionButtonPress : () => {}
    if (secondActionButtonPress) {
      return (
        <Box flexDirection="row" alignItems="center">
          <Box flex={1} mr={10}>
            <VAButton onPress={firstActionPress} label={tc('back')} buttonType={'buttonSecondary'} disabled={disableFirstAction} />
          </Box>
          <Box flex={1}>
            <VAButton onPress={secondActionButtonPress} label={tc('continue')} buttonType={'buttonPrimary'} disabled={disableSecondAction} minHeight={53} />
          </Box>
        </Box>
      )
    } else {
      return (
        <Box>
          <VAButton onPress={firstActionPress} label={t('appointments.submitAppointmentRequest')} buttonType={'buttonPrimary'} />
        </Box>
      )
    }
  }

  return (
    // ios set to a different padding due to the header set to transparent true for ios preventing the header flash
    <Box flex={1} backgroundColor={'main'} pt={condensedMarginBetween}>
      <VAScrollView>
        <TextView mx={gutter} mb={isError ? standardMarginBetween : contentMarginBottom} variant={'BitterBoldHeading'} accessibilityRole={'header'}>
          {pageTitle}
        </TextView>
        {isError && (
          <Box mx={gutter} mb={standardMarginBetween}>
            <AlertBox border={'error'} title={errorMessage} />
          </Box>
        )}
        {children}
      </VAScrollView>
      <Box mb={contentMarginBottom} mx={gutter} mt={contentMarginTop}>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" mb={standardMarginBetween} />
        {getButtonSection()}
      </Box>
    </Box>
  )
}

export default AppointmentFlowLayout
