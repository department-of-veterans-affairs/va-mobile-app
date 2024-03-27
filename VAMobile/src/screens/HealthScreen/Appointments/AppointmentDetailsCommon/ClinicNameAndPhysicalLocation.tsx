import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import { TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

type ClinicNameAndPhysicalLocationProps = {
  attributes: AppointmentAttributes
}

function clinicName(attributes: AppointmentAttributes, theme: VATheme) {
  const { friendlyLocationName, physicalLocation, location } = attributes || ({} as AppointmentAttributes)
  if (friendlyLocationName && friendlyLocationName?.length > 1) {
    if (!physicalLocation && friendlyLocationName === location.name) {
      return <></>
    }
    return (
      <TextView variant="MobileBodyBold" accessibilityRole="header" mb={theme.dimensions.standardMarginBetween}>
        {friendlyLocationName}
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

  return (
    <>
      {clinicName(attributes, theme)}
      {clinicPhysicalLocation(attributes, theme, t)}
    </>
  )
}

export default ClinicNameAndPhysicalLocation
