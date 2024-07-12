import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { AppointmentAttributes } from 'api/types'
import { Box, LinkWithAnalytics } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import {
  AppointmentDetailsScreenType,
  AppointmentDetailsSubType,
  AppointmentDetailsSubTypeConstants,
  AppointmentDetailsTypeConstants,
} from 'utils/appointments'
import { getEpochSecondsOfDate } from 'utils/formattingUtils'
import { useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'

type AppointmentJoinSessionPrepareForVideoProps = {
  attributes: AppointmentAttributes
  subType: AppointmentDetailsSubType
  type: AppointmentDetailsScreenType
}

function AppointmentJoinSessionPrepareForVideo({
  attributes,
  subType,
  type,
}: AppointmentJoinSessionPrepareForVideoProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const launchExternalLink = useExternalLink()

  if (type !== AppointmentDetailsTypeConstants.VideoHome) {
    return <></>
  }

  switch (subType) {
    case AppointmentDetailsSubTypeConstants.Upcoming:
      const { location, startDateUtc } = attributes
      const thirtyMinuteFutureDateSeconds = DateTime.now().toUTC().toSeconds() + 1800 // 30 minutes
      const startDateSeconds = getEpochSecondsOfDate(startDateUtc)
      const displayButton = thirtyMinuteFutureDateSeconds >= startDateSeconds
      const joinSessionOnPress = (): void => {
        if (location.url) {
          launchExternalLink(location.url)
        } else {
          navigateTo('SessionNotStarted')
        }
      }
      return (
        <Box>
          {displayButton && (
            <Button
              label={t('upcomingAppointmentDetails.joinSession')}
              testID={t('upcomingAppointmentDetails.joinSession')}
              a11yHint={t('upcomingAppointmentDetails.howToJoinVirtualSessionA11yHint')}
              onPress={joinSessionOnPress}
            />
          )}
          <Box
            py={displayButton ? theme.dimensions.buttonPadding : undefined}
            mt={displayButton ? undefined : -theme.dimensions.standardMarginBetween}
            mb={theme.dimensions.condensedMarginBetween}>
            <LinkWithAnalytics
              type="custom"
              text={t('appointments.videoHome.prepareForVideo')}
              onPress={() => navigateTo('PrepareForVideoVisit')}
              testID="prepareForVideoVisitTestID"
            />
          </Box>
        </Box>
      )
    default:
      return <></>
  }
}

export default AppointmentJoinSessionPrepareForVideo
