import { Linking } from 'react-native'
import React, { FC, ReactElement } from 'react'

import { DateTime } from 'luxon'

import { AlertBox, TextArea, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TextLine } from 'components/types'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_COMPENSATION_CLAIM_EXAM } = getEnv()

type EstimatedDecisionDateProps = {
  maxEstDate: string | undefined
}

const EstimatedDecisionDate: FC<EstimatedDecisionDateProps> = ({ maxEstDate }): ReactElement => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  // TODO: get this field from API
  const showCovidMessage = false

  if (showCovidMessage) {
    const textLines: Array<TextLine> = [
      { text: t('claimDetails.covidMessage') },
      { text: t('claimDetails.covidMessage.link'), onPress: () => Linking.openURL(LINK_URL_COMPENSATION_CLAIM_EXAM), variant: 'MobileBodyLink', color: 'link' },
    ]

    return (
      <TextArea>
        <AlertBox border="warning" background="cardBackground" text={textLines} />
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
      <TextView variant="MobileBody">{t('claimDetails.estimatedDecisionDate')}</TextView>
      <TextView variant="MobileBodyBold">{displayDate}</TextView>
      {!!maxEstDate && !maxEstDateIsMoreThanTwoYearsOut && (
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
          {subText}
        </TextView>
      )}
    </TextArea>
  )
}

export default EstimatedDecisionDate
