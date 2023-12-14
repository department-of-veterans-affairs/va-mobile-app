import { FC, ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import React from 'react'

import { AppointmentAttributes, AppointmentStatusConstants, AppointmentStatusDetailTypeConsts, AppointmentTypeToA11yLabel, AppointmentTypeToID } from 'store/api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getFormattedDateWithWeekdayForTimeZone, getFormattedTimeForTimeZone, getTranslation } from 'utils/formattingUtils'
import { isAPendingAppointment } from 'utils/appointments'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type AppointmentTypeAndDateProps = {
  attributes: AppointmentAttributes
  isPastAppointment: boolean
}

const AppointmentTypeAndDate: FC<AppointmentTypeAndDateProps> = ({ attributes, isPastAppointment = false }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { appointmentType, startDateUtc, timeZone, isCovidVaccine, typeOfCare, status, serviceCategoryName, phoneOnly, statusDetail, healthcareProvider, location } =
    attributes || ({} as AppointmentAttributes)

  const isAppointmentPending = isAPendingAppointment(attributes)
  const isAppointmentCanceled = status === AppointmentStatusConstants.CANCELLED
  const appointmentTypeLabel = getTranslation(AppointmentTypeToA11yLabel[appointmentType], t)

  const date = getFormattedDateWithWeekdayForTimeZone(startDateUtc, timeZone)
  const time = getFormattedTimeForTimeZone(startDateUtc, timeZone)
  const covid19Text = t('upcomingAppointments.covidVaccine')

  if (phoneOnly) {
    let who = t('appointments.canceled.whoCanceled.you')
    if (statusDetail === AppointmentStatusDetailTypeConsts.CLINIC || statusDetail === AppointmentStatusDetailTypeConsts.CLINIC_REBOOK) {
      who = healthcareProvider || location?.name || t('appointments.canceled.whoCanceled.facility')
    }
    const apptTitle = isAppointmentCanceled ? t('appointments.phone.canceledTitle') : isPastAppointment ? t('appointments.phone.pastTitle') : t('appointments.phone.upcomingTitle')
    const apptBody = isAppointmentCanceled
      ? t('appointments.pending.cancelled.theTimeAndDate', { who })
      : isPastAppointment
      ? t('appointments.pastBody')
      : isAppointmentPending
      ? t('appointments.pending.submitted.pendingRequestTypeOfCare', { typeOfCare })
      : t('appointments.phone.upcomingBody')
    return (
      <Box>
        <TextView variant={'MobileBodyBold'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {apptTitle}
        </TextView>
        <TextView variant={'MobileBody'} paragraphSpacing={true}>
          {apptBody}
        </TextView>
        {isAppointmentPending ? undefined : <TextView variant={'MobileBodyBold'} mb={theme.dimensions.standardMarginBetween}>{`${date}\n${time}`}</TextView>}
      </Box>
    )
  }

  let content
  if (isAppointmentPending) {
    if (!typeOfCare) {
      content = <></>
    } else {
      // pending
      const appointmentCanceled = status === AppointmentStatusConstants.CANCELLED
      const title = appointmentCanceled ? 'appointments.pending.cancelled.pendingRequestTypeOfCare' : 'appointments.pending.submitted.pendingRequestTypeOfCare'
      content = (
        <TextView variant={'BitterBoldHeading'} accessibilityRole={'header'} selectable={true}>
          {t(title, { typeOfCare })}
        </TextView>
      )
    }
  } else if (isAppointmentCanceled && serviceCategoryName === 'COMPENSATION & PENSION') {
    content = (
      <>
        <TextView variant={'MobileBody'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.claimExam')}
        </TextView>
        <TextView variant={'BitterBoldHeading'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.canceled.message', { date, time })}
        </TextView>
      </>
    )
  } else if (isAppointmentCanceled) {
    // cancelled
    content = (
      <>
        <TextView variant={'BitterBoldHeading'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.canceled.message', { date, time })}
        </TextView>
      </>
    )
  } else if (serviceCategoryName === 'COMPENSATION & PENSION') {
    content = (
      <>
        <TextView variant={isPastAppointment ? 'MobileBody' : 'MobileBodyBold'} accessibilityRole={'header'} mb={theme.dimensions.condensedMarginBetween}>
          {t('appointments.claimExam')}
        </TextView>
        {isPastAppointment ? (
          <></>
        ) : (
          <TextView variant={'MobileBody'} paragraphSpacing={true}>
            {t('appointments.claimExam.explanationText')}
          </TextView>
        )}
        <TextView variant={'BitterBoldHeading'} accessibilityRole={'header'} selectable={true}>
          {`${date}\n${time}`}
        </TextView>
      </>
    )
  } else {
    // booked
    content = (
      <TextView testID={`${date} ${time}`} variant={'BitterBoldHeading'} accessibilityRole={'header'} selectable={true}>
        {`${date}\n${time}`}
      </TextView>
    )
  }

  const appointmentTitle = (): ReactElement => {
    if (serviceCategoryName === 'COMPENSATION & PENSION') {
      return <></>
    } else {
      return (
        <TextView variant={'MobileBody'} mb={theme.dimensions.standardMarginBetween} {...testIdProps(isCovidVaccine ? covid19Text : appointmentTypeLabel)}>
          {getTranslation(isCovidVaccine ? covid19Text : AppointmentTypeToID[appointmentType], t)}
        </TextView>
      )
    }
  }

  return (
    <Box>
      {appointmentTitle()}
      {content}
    </Box>
  )
}

export default AppointmentTypeAndDate
