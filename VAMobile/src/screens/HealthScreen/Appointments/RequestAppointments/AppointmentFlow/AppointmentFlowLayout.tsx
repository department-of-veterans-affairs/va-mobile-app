import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAButton, VAIcon, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { isIOS } from 'utils/platform'
import { useTheme } from 'utils/hooks'
import CloseButton from 'components/CloseButton'

type AppointmentFlowLayoutProps = {
  /** Action for closing the modal */
  onClose: () => void
  /** Optional action for the back or submit button */
  firstActionButtonPress?: () => void
  /** Optional action for the continue button*/
  secondActionButtonPress?: () => void
  /** Optional boolean to disable first action button  */
  disableFirstAction?: boolean
  /** Optional boolean to disable second action button  */
  disableSecondAction?: boolean
}

/** Component for the common sections for the appointment flow modal steps */
const AppointmentFlowLayout: FC<AppointmentFlowLayoutProps> = ({ onClose, firstActionButtonPress, secondActionButtonPress, disableFirstAction, disableSecondAction, children }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const { contentMarginBottom, gutter, contentMarginTop, standardMarginBetween, textIconMargin } = theme.dimensions

  const getButtonSection = () => {
    const firstActionPress = firstActionButtonPress ? firstActionButtonPress : () => {}
    if (secondActionButtonPress) {
      return (
        <Box flexDirection="row">
          <Box flex={1} mr={10}>
            <VAButton onPress={firstActionPress} label={tc('back')} buttonType={'buttonPrimary'} disabled={disableFirstAction} />
          </Box>
          <Box flex={1}>
            <VAButton onPress={secondActionButtonPress} label={tc('continue')} buttonType={'buttonPrimary'} disabled={disableSecondAction} />
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

  const iconProps = {
    width: 24,
    height: 24,
    fill: 'primary',
  }

  return (
    <Box flex={1} backgroundColor={'main'}>
      {/* // This is done due IOS having a delay and not announcing the button on modal launch */}
      <CloseButton onPress={onClose} a11yHint={t('appointments.closeAppointmentRequestModal')} focusOnButton={isIOS() ? false : true} />
      <VAScrollView>{children}</VAScrollView>
      <Box mb={contentMarginBottom} mx={gutter} mt={contentMarginTop}>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" mb={standardMarginBetween}>
          <VAIcon name="QuestionMark" {...iconProps} preventScaling={true} />
          <TextView variant="MobileBody" ml={textIconMargin} allowFontScaling={false}>
            {t('appointments.needHelpAppointmentRequest')}
          </TextView>
        </Box>
        {getButtonSection()}
      </Box>
    </Box>
  )
}

export default AppointmentFlowLayout
