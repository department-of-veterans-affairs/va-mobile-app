import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AppointmentAttributes, AppointmentData } from 'store/api/types'
import { AppointmentsStackParamList } from '../AppointmentsScreen'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointment } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import AppointmentTypeAndDateDisplayed from '../DetailsCommon/AppointmentTypeAndDateDisplayed'

type PastAppointmentDetailsProps = StackScreenProps<AppointmentsStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route }) => {
  const { appointmentID } = route.params

  const theme = useTheme()
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const dispatch = useDispatch()
  const { appointment } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = appointment as AppointmentData
  const { appointmentType, startTime, timeZone } = attributes || ({} as AppointmentAttributes)

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
  }, [dispatch, appointmentID])

  return (
    <ScrollView {...testIdProps('Upcoming-appointment-details')}>
      <Box mt={theme.dimensions.marginBetween}>
        <TextArea>
          <AppointmentTypeAndDateDisplayed timeZone={timeZone} startTime={startTime} appointmentType={appointmentType} />
        </TextArea>
        <TextArea>
          <TextView variant="MobileBody">{t('pastAppointmentDetails.toScheduleAnotherAppointment')}</TextView>
        </TextArea>
      </Box>
    </ScrollView>
  )
}

export default PastAppointmentDetails
