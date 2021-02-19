import { Linking } from 'react-native'
import React, { FC, ReactElement } from 'react'

import { DateTime } from 'luxon'

import { AlertBox, Box, TextArea, TextView, VAButton } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_COMPENSATION_CLAIM_EXAM } = getEnv()

type EstimatedDecisionDateProps = {
  maxEstDate: string | null
  showCovidMessage: boolean
}

const EstimatedDecisionDate: FC<EstimatedDecisionDateProps> = ({ maxEstDate, showCovidMessage }): ReactElement => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const onAlertLinkPress = async (): Promise<void> => {
    await Linking.openURL(LINK_URL_COMPENSATION_CLAIM_EXAM)
  }

  if (showCovidMessage) {
    return (
      <TextArea>
        <AlertBox border="warning" background="cardBackground" text={t('claimDetails.covidMessage')}>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <VAButton
              onPress={onAlertLinkPress}
              testID={t('claimDetails.reviewLocations')}
              label={t('claimDetails.reviewLocations')}
              textColor="primaryContrast"
              backgroundColor="buttonPrimary"
              a11yHint={t('claimDetails.reviewLocationsA11yHint')}
            />
          </Box>
        </AlertBox>
      </TextArea>
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
      <Box {...testIdProps(`${t('claimDetails.estimatedDecisionDate')} ${displayDate}`)} accessible={true}>
        <TextView variant="MobileBody">{t('claimDetails.estimatedDecisionDate')}</TextView>
        <TextView variant="MobileBodyBold">{displayDate}</TextView>
      </Box>
      {!!maxEstDate && !maxEstDateIsMoreThanTwoYearsOut && (
        <Box {...testIdProps(subText)} accessible={true}>
          <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
            {subText}
          </TextView>
        </Box>
      )}
    </TextArea>
  )
}

export default EstimatedDecisionDate
