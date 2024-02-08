import React from 'react'
import { useTranslation } from 'react-i18next'

import { TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types'
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
        {typeOfCare && typeOfCare.length > 1 ? typeOfCare : healthcareService && healthcareService.length > 1 ? healthcareService : t('appointments.noTypeOfCare')}
      </TextView>
    )
  }
  return <></>
}

export default TypeOfCare
