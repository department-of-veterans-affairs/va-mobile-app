import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { AppointmentsStackParamList } from '../../AppointmentStackScreens'
import { BackButton, Box, ButtonTypesConstants, ErrorComponent, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { cancelAppointment } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useDispatch } from 'react-redux'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type AppointmentCancellationConfirmationProps = StackScreenProps<AppointmentsStackParamList, 'AppointmentCancellationConfirmation'>

const AppointmentCancellationConfirmation: FC<AppointmentCancellationConfirmationProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { cancelID, appointmentID } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => <BackButton onPress={navigation.goBack} canGoBack={true} label={BackButtonLabelConstants.back} />,
    })
  })

  const onCancelAppointment = (): void => {
    dispatch(cancelAppointment(cancelID, appointmentID, ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION))
    navigation.goBack()
    return
  }

  if (useError(ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION)) {
    return <ErrorComponent />
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
