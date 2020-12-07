import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation, AppointmentStatusConstants, AppointmentTypeConstants } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointment } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import AppointmentAddressAndNumber from '../AppointmentDetailsCommon/AppointmentAddressAndNumber'
import AppointmentTypeAndDate from '../AppointmentDetailsCommon/AppointmentTypeAndDate'
import ProviderName from '../AppointmentDetailsCommon/ProviderName'

type PastAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route }) => {
  const { appointmentID } = route.params

  const theme = useTheme()
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const dispatch = useDispatch()
  const { appointment } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = appointment as AppointmentData
  const { appointmentType, startTime, timeZone, healthcareService, location, practitioner, status } = attributes || ({} as AppointmentAttributes)
  const { name, address, phone } = location || ({} as AppointmentLocation)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
  }, [dispatch, appointmentID])

  const appointmentTypeAndDateIsLastItem =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME || appointmentIsCanceled

  return (
    <ScrollView {...testIdProps('Past-appointment-details')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <Box mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.marginBetween}>
            <AppointmentTypeAndDate timeZone={timeZone} startTime={startTime} appointmentType={appointmentType} isAppointmentCanceled={appointmentIsCanceled} />
          </Box>

          <ProviderName appointmentType={appointmentType} practitioner={practitioner} />

          <AppointmentAddressAndNumber appointmentType={appointmentType} healthcareService={healthcareService} address={address} locationName={name} phone={phone} />
        </TextArea>
        <TextArea>
          <TextView variant="MobileBody">{t('pastAppointmentDetails.toScheduleAnotherAppointment')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default PastAppointmentDetails
