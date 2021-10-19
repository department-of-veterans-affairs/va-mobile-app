import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

import {
  AppointmentAttributes,
  AppointmentData,
  AppointmentLocation,
  AppointmentStatusConstants,
  AppointmentStatusDetailTypeConsts,
  AppointmentTypeConstants,
} from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, LoadingComponent, TextArea, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { InteractionManager } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointment } from 'store/actions'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import AppointmentAddressAndNumber from '../AppointmentDetailsCommon/AppointmentAddressAndNumber'
import AppointmentReason from '../AppointmentDetailsCommon/AppointmentReason'
import AppointmentTypeAndDate from '../AppointmentDetailsCommon/AppointmentTypeAndDate'
import ProviderName from '../AppointmentDetailsCommon/ProviderName'

type PastAppointmentDetailsProps = StackScreenProps<HealthStackParamList, 'PastAppointmentDetails'>

const PastAppointmentDetails: FC<PastAppointmentDetailsProps> = ({ route }) => {
  const { appointmentID } = route.params

  const theme = useTheme()
  const t = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()
  const { appointment } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  const { attributes } = (appointment || {}) as AppointmentData
  const { appointmentType, startDateUtc, timeZone, healthcareService, location, practitioner, status, statusDetail, reason, isCovidVaccine, healthcareProvider } =
    attributes || ({} as AppointmentAttributes)
  const { address, phone } = location || ({} as AppointmentLocation)
  const appointmentIsCanceled = status === AppointmentStatusConstants.CANCELLED
  const [isTransitionComplete, setIsTransitionComplete] = useState(false)

  const whoCanceled =
    statusDetail === AppointmentStatusDetailTypeConsts.CLINIC || statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK
      ? t('appointments.canceled.whoCanceled.facility')
      : t('appointments.canceled.whoCanceled.you')

  useEffect(() => {
    dispatch(getAppointment(appointmentID))
    InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
  }, [dispatch, appointmentID])

  if (!isTransitionComplete) {
    return <LoadingComponent text={t('appointmentDetails.loading')} />
  }

  const appointmentTypeAndDateIsLastItem =
    appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_GFE || appointmentType === AppointmentTypeConstants.VA_VIDEO_CONNECT_HOME || appointmentIsCanceled

  return (
    <VAScrollView {...testIdProps('Past-appointment-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <Box mb={appointmentTypeAndDateIsLastItem ? 0 : theme.dimensions.standardMarginBetween}>
            <AppointmentTypeAndDate
              timeZone={timeZone}
              startDateUtc={startDateUtc}
              appointmentType={appointmentType}
              isAppointmentCanceled={appointmentIsCanceled}
              whoCanceled={whoCanceled}
              isCovidVaccine={isCovidVaccine}
            />
          </Box>

          <ProviderName appointmentType={appointmentType} practitioner={practitioner} healthcareProvider={healthcareProvider} />

          <AppointmentAddressAndNumber
            appointmentType={appointmentType}
            healthcareService={healthcareService}
            address={address}
            location={location}
            phone={phone}
            isCovidVaccine={isCovidVaccine}
          />

          {reason && <AppointmentReason reason={reason} />}
        </TextArea>

        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextArea>
            <TextView variant="MobileBody" {...testIdProps(t('pastAppointmentDetails.toScheduleAnotherAppointmentA11yLabel'))}>
              {t('pastAppointmentDetails.toScheduleAnotherAppointment')}
            </TextView>
          </TextArea>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default PastAppointmentDetails
