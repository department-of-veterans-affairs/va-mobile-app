import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, ErrorComponent, TextView, VAButton, VAScrollView } from 'components'
import { HealthStackParamList } from '../../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { cancelAppointment } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type AppointmentCancellationConfirmationProps = StackScreenProps<HealthStackParamList, 'AppointmentCancellationConfirmation'>

const AppointmentCancellationConfirmation: FC<AppointmentCancellationConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { cancelID, appointmentID } = route.params

  const onCancelAppointment = (): void => {
    dispatch(cancelAppointment(cancelID, appointmentID, ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION))
    navigation.goBack()
    return
  }

  if (useError(ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION} />
  }

  return (
    <VAScrollView {...testIdProps('Cancel-appointment-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('upcomingAppointmentDetails.cancellationConfirmation.doYouWantToCancel')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onCancelAppointment}
            label={t('upcomingAppointmentDetails.cancellationConfirmation.yesCancelThisAppointment')}
            testID={t('upcomingAppointmentDetails.cancellationConfirmation.yesCancelThisAppointment')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('upcomingAppointmentDetails.cancellationConfirmation.yesCancelThisAppointment.a11yHint')}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <VAButton
            onPress={(): void => navigation.goBack()}
            label={t('upcomingAppointmentDetails.cancellationConfirmation.noTakeMeBack')}
            testID={t('upcomingAppointmentDetails.cancellationConfirmation.noTakeMeBack')}
            buttonType={ButtonTypesConstants.buttonSecondary}
            a11yHint={t('upcomingAppointmentDetails.cancellationConfirmation.noTakeMeBack.a11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default AppointmentCancellationConfirmation
