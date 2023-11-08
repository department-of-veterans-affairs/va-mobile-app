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
import { AppointmentsState, trackAppointmentDetail } from 'store/slices/appointmentsSlice'
import { Box, FeatureLandingTemplate, TextArea, TextView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getAppointmentAnalyticsDays, getAppointmentAnalyticsStatus, isAPendingAppointment } from '../../../../utils/appointments'
import { useAppDispatch, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route, navigation }) => {
  const { appointmentID } = route.params

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useAppDispatch()
  const { pastAppointmentsById } = useSelector<RootState, AppointmentsState>((state) => state.appointments)

  const appointment = pastAppointmentsById?.[appointmentID]
  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, status } = attributes || ({} as AppointmentAttributes)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const pendingAppointment = isAPendingAppointment(attributes)

  useEffect(() => {
    dispatch(
      trackAppointmentDetail(
        pendingAppointment,
        appointmentID,
        getAppointmentAnalyticsStatus(attributes),
        attributes.appointmentType.toString(),
        getAppointmentAnalyticsDays(attributes),
      ),
    )
  }, [dispatch, appointmentID, pendingAppointment, attributes])

  const appointmentTypeAndDateIsLastItem =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME || appointmentIsCanceled

  const renderScheduleAnotherAppointment = (): ReactElement => {
    if (pendingAppointment) {
      return <></>
    }

    return (
      <Box mt={theme.dimensions.condensedMarginBetween}>
        <TextArea>
          <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('pastAppointmentDetails.toScheduleAnotherAppointment'))}>
            {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
          </TextView>
        </TextArea>
      </Box>
    )
  }

  return (
    <FeatureLandingTemplate backLabel={t('appointments')} backLabelOnPress={navigation.goBack} title={t('details')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <AppointmentAlert attributes={attributes} />
        <TextArea>
          <Box mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
            <AppointmentTypeAndDate attributes={attributes} isPastAppointment={true} />
          </Box>

          <ProviderName attributes={attributes} />

          <AppointmentAddressAndNumber attributes={attributes} />

          <PreferredDateAndTime attributes={attributes} />
          <PreferredAppointmentType attributes={attributes} />
          <AppointmentReason attributes={attributes} />
          <ContactInformation attributes={attributes} />
        </TextArea>

        {renderScheduleAnotherAppointment()}
      </Box>
    </FeatureLandingTemplate>
  )
}

export default PastAppointmentDetails
