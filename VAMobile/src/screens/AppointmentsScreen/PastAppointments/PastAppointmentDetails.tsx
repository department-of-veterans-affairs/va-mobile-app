import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AppointmentAttributes, AppointmentData, AppointmentLocation } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointment } from 'store/actions'
import { getFormattedCityStateZip } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import AppointmentAddressAndNumber from '../DetailsCommon/AppointmentAddressAndNumber'
import AppointmentTypeAndDate from '../DetailsCommon/AppointmentTypeAndDate'
import ProviderName from '../DetailsCommon/ProviderName'

type PastAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route }) => {
  const { appointmentID } = route.params

  const theme = useTheme()
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const dispatch = useDispatch()
  const { appointment } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = appointment as AppointmentData
  const { appointmentType, startTime, timeZone, healthcareService, location, practitioner } = attributes || ({} as AppointmentAttributes)
  const { name, address, phone } = location || ({} as AppointmentLocation)

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
  }, [dispatch, appointmentID])

  return (
    <ScrollView {...testIdProps('Upcoming-appointment-details')}>
      <Box mt={theme.dimensions.marginBetween}>
        <TextArea>
          <AppointmentTypeAndDate timeZone={timeZone} startTime={startTime} appointmentType={appointmentType} />

          <Box mt={theme.dimensions.marginBetween}>
            <ProviderName appointmentType={appointmentType} practitioner={practitioner} />
          </Box>

          <Box mt={theme.dimensions.marginBetween}>
            <AppointmentAddressAndNumber
              appointmentType={appointmentType}
              healthcareService={healthcareService}
              address={address}
              cityStateZip={getFormattedCityStateZip(address)}
              locationName={name}
              phone={phone}
            />
          </Box>
        </TextArea>
        <TextArea>
          <TextView variant="MobileBody">{t('pastAppointmentDetails.toScheduleAnotherAppointment')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default PastAppointmentDetails
