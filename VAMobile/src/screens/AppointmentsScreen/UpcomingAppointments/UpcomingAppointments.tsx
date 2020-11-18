import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { format } from 'date-fns'
import _ from 'underscore'

import { AppointmentType, AppointmentTypeConstants, AppointmentTypeToName } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextView, textIDObj } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentsInDateRange } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

type UpcomingAppointmentsProps = {}

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { appointmentsByMonth } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  useEffect(() => {
    dispatch(getAppointmentsInDateRange('', ''))
  }, [dispatch])

  const getFormattedDate = (date: Date): string => {
    return format(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()), 'dddd, MMMM dd, yyyy')
  }

  const getFormattedTime = (date: Date): string => {
    return format(new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()), 'h:mm aa')
  }

  const getLocation = (appointmentType: AppointmentType, locationName: string): string => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE || appointmentType === AppointmentTypeConstants.VA) {
      return locationName
    }

    return AppointmentTypeToName[appointmentType]
  }

  const onAppointmentPress = (): void => {}

  const groupedAppointments = _.map(appointmentsByMonth || {}, (listOfAppointments, month) => {
    const buttonListItems: Array<ButtonListItemObj> = []

    _.forEach(listOfAppointments, (appointment) => {
      const { attributes } = appointment
      const startTime = new Date(attributes.startTime)

      const textIDs: Array<textIDObj> = [
        { textID: 'common:text.raw', fieldObj: { text: getFormattedDate(startTime) } },
        { textID: { id: 'common:text.raw', isBold: true }, fieldObj: { text: getFormattedTime(startTime) } },
        { textID: 'common:text.raw', fieldObj: { text: getLocation(attributes.appointmentType, attributes.location.name) } },
      ]

      buttonListItems.push({ textIDs, onPress: onAppointmentPress })
    })

    return (
      <Box key={month} mb={theme.dimensions.marginBetween}>
        <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter}>
          {month}
        </TextView>
        <ButtonList items={buttonListItems} translationNameSpace={NAMESPACE.APPOINTMENTS} />
      </Box>
    )
  })

  return (
    <Box>
      <TextView mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        {t('upcomingAppointments.confirmedApptsDisplayed')}
      </TextView>
      {groupedAppointments}
    </Box>
  )
}

export default UpcomingAppointments
