import React from 'react'
import { useTranslation } from 'react-i18next'

import { DateTime } from 'luxon'

import { AlertWithHaptics, Box, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useExternalLink, useTheme } from 'utils/hooks'

const { LINK_URL_COMPENSATION_CLAIM_EXAM } = getEnv()

type EstimatedDecisionDateProps = {
  maxEstDate: string | null
  showCovidMessage: boolean
}

function EstimatedDecisionDate({ maxEstDate, showCovidMessage }: EstimatedDecisionDateProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const launchExternalLink = useExternalLink()

  const onAlertLinkPress = async (): Promise<void> => {
    launchExternalLink(LINK_URL_COMPENSATION_CLAIM_EXAM)
  }

  //Opting to leave this code in place...because removing it will clearly kickstart pandemic part 4000.
  if (showCovidMessage) {
    return (
      <AlertWithHaptics
        variant="warning"
        description={t('claimDetails.covidMessage')}
        primaryButton={{
          label: t('claimDetails.reviewLocations'),
          a11yHint: t('claimDetails.reviewLocationsA11yHint'),
          onPress: onAlertLinkPress,
          testID: t('claimDetails.reviewLocations'),
        }}
      />
    )
  }

  let displayDate = t('claimDetails.noEstimatedDecisionDate')
  let subText = t('claimDetails.weBaseThis')
  let maxEstDateIsMoreThanTwoYearsOut = false

  // if the max estimated date exists
  if (maxEstDate) {
    const maxEstDateObj = DateTime.fromISO(maxEstDate).toLocal()
    maxEstDateIsMoreThanTwoYearsOut = maxEstDateObj > DateTime.local().plus({ years: 2 })

    // if the max estimated date is not more than 2 years in the future, show the date
    if (!maxEstDateIsMoreThanTwoYearsOut) {
      displayDate = formatDateMMMMDDYYYY(maxEstDate)
    }

    const maxEstDateIsBeforeToday = maxEstDateObj < DateTime.local()

    // if the max estimated is before today, update the sub text
    if (maxEstDateIsBeforeToday) {
      subText = t('claimDetails.weEstimatedThis')
    }
  }

  return (
    <TextArea>
      <Box accessibilityLabel={`${t('claimDetails.estimatedDecisionDate')} ${displayDate}`} accessible={true}>
        <TextView variant="MobileBody">{t('claimDetails.estimatedDecisionDate')}</TextView>
        <TextView variant="MobileBodyBold">{displayDate}</TextView>
      </Box>
      {!!maxEstDate && !maxEstDateIsMoreThanTwoYearsOut && (
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} accessible={true}>
          {subText}
        </TextView>
      )}
    </TextArea>
  )
}

export default EstimatedDecisionDate
