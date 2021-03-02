import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, useEffect } from 'react'

import { AppointmentsStackParamList } from '../../AppointmentStackScreens'
import { Box, ButtonTypesConstants, ErrorComponent, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { testIdProps } from 'utils/accessibility'
import { useError, useTheme, useTranslation } from 'utils/hooks'

type AppointmentCancellationConfirmationProps = StackScreenProps<AppointmentsStackParamList, 'AppointmentCancellationConfirmation'>

const AppointmentCancellationConfirmation: FC<AppointmentCancellationConfirmationProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
    })
  })

  const cancelAppointment = (): void => {
    // TODO: dispatch action to attempt an appointment cancellation once integration is finished
    return
  }

  if (useError(ScreenIDTypesConstants.APPOINTMENT_CANCELLATION_CONFIRMATION)) {
    return <ErrorComponent />
  }

  return (
    <ScrollView {...testIdProps('appointment-cancellation-confirmation-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('upcomingAppointmentDetails.cancellationConfirmation.doYouWantToCancel')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={cancelAppointment}
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
    </ScrollView>
  )
}

export default AppointmentCancellationConfirmation
