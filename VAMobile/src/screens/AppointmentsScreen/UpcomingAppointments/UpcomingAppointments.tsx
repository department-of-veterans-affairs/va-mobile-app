import { useDispatch, useSelector } from 'react-redux'
import React, { FC, ReactInstance, useEffect } from 'react'

import _ from 'underscore'

import { AppointmentType, AppointmentTypeConstants, AppointmentTypeToName } from 'store/api/types'
import { AppointmentsState, StoreState } from 'store/reducers'
import { Box, ButtonList, ButtonListItemObj, TextView, textIDObj } from 'components'
import { DateTime, DateTimeFormatOptions } from 'luxon'
import { NAMESPACE } from 'constants/namespaces'
import { getAppointmentsInDateRange } from 'store/actions'
import { useTheme, useTranslation } from 'utils/hooks'

type UpcomingAppointmentsProps = {}

const UpcomingAppointments: FC<UpcomingAppointmentsProps> = () => {
  const t = useTranslation(NAMESPACE.APPOINTMENTS)
  const theme = useTheme()
  const dispatch = useDispatch()
  const { appointmentsByYear } = useSelector<StoreState, AppointmentsState>((state) => state.appointments)

  useEffect(() => {
    dispatch(getAppointmentsInDateRange('', ''))
  }, [dispatch])

  const getLocation = (appointmentType: AppointmentType, locationName: string): string => {
    if (appointmentType === AppointmentTypeConstants.COMMUNITY_CARE || appointmentType === AppointmentTypeConstants.VA) {
      return locationName
    }

    return AppointmentTypeToName[appointmentType]
  }

  const onAppointmentPress = (): void => {}

  const getFormattedDateTime = (dateTime: string, dateTimeType: DateTimeFormatOptions, timeZone: string, dateTimeOptions?: { [key: string]: string }): string => {
    const dateObj = DateTime.fromISO(dateTime).setZone(timeZone)
    return dateObj.toLocaleString(Object.assign(dateTimeType, dateTimeOptions))
  }

  const getGroupedAppointments = (): ReactInstance => {
    return _.map(appointmentsByYear || {}, (appointmentsByMonth, year) => {
      return _.map(appointmentsByMonth, (listOfAppointments, month) => {
        const buttonListItems: Array<ButtonListItemObj> = []

        _.forEach(listOfAppointments, (appointment) => {
          const { attributes } = appointment

          const textIDs: Array<textIDObj> = [
            { textID: 'common:text.raw', fieldObj: { text: getFormattedDateTime(attributes.startTime, DateTime.DATE_FULL, attributes.timeZone, { weekday: 'long' }) } },
            {
              textID: { id: 'common:text.raw', isBold: true },
              fieldObj: { text: getFormattedDateTime(attributes.startTime, DateTime.TIME_SIMPLE, attributes.timeZone, { timeZoneName: 'short' }) },
            },
            { textID: 'common:text.raw', fieldObj: { text: getLocation(attributes.appointmentType, attributes.location.name) } },
          ]

          buttonListItems.push({ textIDs, onPress: onAppointmentPress })
        })

        return (
          <Box key={month} mb={theme.dimensions.marginBetween}>
            <TextView variant="TableHeaderBold" ml={theme.dimensions.gutter}>
              {month} {year}
            </TextView>
            <ButtonList items={buttonListItems} translationNameSpace={NAMESPACE.APPOINTMENTS} />
          </Box>
        )
      })
    })
  }

  return (
    <Box>
      <TextView mx={theme.dimensions.gutter} mb={theme.dimensions.marginBetween}>
        {t('upcomingAppointments.confirmedApptsDisplayed')}
      </TextView>
      {getGroupedAppointments()}
    </Box>
  )
}

export default UpcomingAppointments
