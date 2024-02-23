import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'

import { TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { AppointmentAttributes, AppointmentTypeConstants } from 'store/api/types'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

type ClinicNameAndPhysicalLocationProps = {
  attributes: AppointmentAttributes
}

function clinicName(attributes: AppointmentAttributes, theme: VATheme) {
  const { friendlyLocationName, location } = attributes || ({} as AppointmentAttributes)
  if (friendlyLocationName && friendlyLocationName.length > 1) {
    return (
      <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
        {friendlyLocationName}
      </TextView>
    )
  } else if (location && location.name && location.name.length > 1) {
    return (
      <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
        {location.name}
      </TextView>
    )
  }
  return <></>
}

function clinicPhysicalLocation(attributes: AppointmentAttributes, theme: VATheme, t: TFunction) {
  const { physicalLocation } = attributes || ({} as AppointmentAttributes)
  if (physicalLocation && physicalLocation.length > 1) {
    return (
      <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
        {t('appointments.clinicLocation', { physicalLocation: physicalLocation })}
      </TextView>
    )
  }
  return <></>
}

function ClinicNameAndPhysicalLocation({ attributes }: ClinicNameAndPhysicalLocationProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { appointmentType, serviceCategoryName } = attributes || ({} as AppointmentAttributes)

  if (appointmentType === AppointmentTypeConstants.VA && serviceCategoryName !== 'COMPENSATION & PENSION') {
    return (
      <>
        {clinicName(attributes, theme)}
        {clinicPhysicalLocation(attributes, theme, t)}
      </>
    )
  }
  return <></>
}

export default ClinicNameAndPhysicalLocation
