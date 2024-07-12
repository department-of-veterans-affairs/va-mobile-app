import React from 'react'
import { useTranslation } from 'react-i18next'

import { TFunction } from 'i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

type CommunityCarePendingLocationProps = {
  attributes: AppointmentAttributes
}

const getSchedulingFacility = (attributes: AppointmentAttributes, t: TFunction, theme: VATheme) => {
  const { friendlyLocationName } = attributes
  const hasFriendlyLocationName = friendlyLocationName && friendlyLocationName.length > 1

  return (
    hasFriendlyLocationName && (
      <Box>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('schedulingFacility')}
        </TextView>
        <TextView variant="MobileBody">{t('thisFacilityWillContactYou')}</TextView>
        <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {friendlyLocationName}
        </TextView>
      </Box>
    )
  )
}

const getProviderAndLocation = (attributes: AppointmentAttributes, t: TFunction, theme: VATheme) => {
  const { location, healthcareProvider } = attributes
  const locationName = location?.name || ''
  const hasFullAddress = Boolean(
    location?.address?.street && location?.address?.city && location?.address?.state && location?.address?.zipCode,
  )
  const hasInfoToDisplay = healthcareProvider || locationName || hasFullAddress

  return (
    hasInfoToDisplay && (
      <Box>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('preferredCommunityCareProvider')}
        </TextView>
        {healthcareProvider && (
          <TextView variant="MobileBody" selectable={true}>
            {healthcareProvider}
          </TextView>
        )}
        {locationName && (
          <TextView variant="MobileBody" selectable={true}>
            {locationName}
          </TextView>
        )}
        {hasFullAddress && (
          <Box>
            <TextView variant="MobileBody" selectable={true}>
              {location.address?.street}
            </TextView>
            <TextView variant="MobileBody" selectable={true} mb={theme.dimensions.condensedMarginBetween}>
              {`${location.address?.city}, ${location.address?.state} ${location.address?.zipCode}`}
            </TextView>
          </Box>
        )}
      </Box>
    )
  )
}

function CommunityCarePendingLocation({ attributes }: CommunityCarePendingLocationProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  return (
    <Box>
      {getSchedulingFacility(attributes, t, theme)}
      {getProviderAndLocation(attributes, t, theme)}
    </Box>
  )
}

export default CommunityCarePendingLocation
