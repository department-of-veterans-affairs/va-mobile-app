import { useTranslation } from 'react-i18next'
import React from 'react'

import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { TextView } from 'components'
import { useTheme } from 'utils/hooks'

type TypeOfCareProps = {
  attributes: AppointmentAttributes
}

function TypeOfCare({ attributes }: TypeOfCareProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const { typeOfCare, phoneOnly, appointmentType, serviceCategoryName, healthcareService } = attributes || ({} as AppointmentAttributes)

  if (phoneOnly || (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION')) {
    return (
      <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
        {typeOfCare || healthcareService || t('appointments.noTypeOfCare')}
      </TextView>
    )
  }
  return <></>
}

export default TypeOfCare
