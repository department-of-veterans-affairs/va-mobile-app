import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactElement, useEffect } from 'react'

import {
  AppointmentAddressAndNumber,
  AppointmentAlert,
  AppointmentReason,
  AppointmentTypeAndDate,
  ContactInformation,
  PreferredAppointmentType,
  PreferredDateAndTime,
  ProviderName,
} from '../AppointmentDetailsCommon'
import { AppointmentAttributes, AppointmentData, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'
import { AppointmentsState, getAppointmentMessages, trackAppointmentDetail } from 'store/slices/appointmentsSlice'
import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VATheme } from 'styles/theme'
import { isAPendingAppointment } from '../../../../utils/appointments'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointmentID } = route.params

  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const { pastAppointmentsById, appointmentMessagesById } = useSelector<RootState, AppointmentsState>((state) => state.appointments)

  const appointment = pastAppointmentsById?.[appointmentID]
  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, status } = attributes || ({} as AppointmentAttributes)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)
  const messages = appointmentMessagesById[appointmentID]

  useEffect(() => {
    dispatch(trackAppointmentDetail(pendingAppointment))
  }, [dispatch, appointmentID, pendingAppointment])

  useEffect(() => {
    if (appointment && isAPendingAppointment && !appointmentMessagesById[appointmentID]) {
      dispatch(getAppointmentMessages(appointmentID))
    }
  }, [dispatch, appointment, appointmentID, appointmentMessagesById])

  const appointmentTypeAndDateIsLastItem =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME || appointmentIsCanceled

  const renderScheduleAnotherAppointment = (): ReactElement => {
    if (pendingAppointment) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBody" {...testIdProps(t('pastAppointmentDetails.toScheduleAnotherAppointmentA11yLabel'))}>
            {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
          </TextView>
        </TextArea>
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={tc('appointments')} backLabelOnPress={navigation.goBack} title={tc('details')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <AppointmentAlert attributes={attributes} />
        <TextArea>
          <Box mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
            <AppointmentTypeAndDate attributes={attributes} />
          </Box>

          <ProviderName attributes={attributes} />

          <AppointmentAddressAndNumber attributes={attributes} />

          <PreferredDateAndTime attributes={attributes} />
          <PreferredAppointmentType attributes={attributes} />
          <AppointmentReason attributes={attributes} messages={messages} />
          <ContactInformation attributes={attributes} />
        </TextArea>

        {renderScheduleAnotherAppointment()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PastAppointmentDetails
