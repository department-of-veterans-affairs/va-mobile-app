import React from 'react'
import { useTranslation } from 'react-i18next'

import { AppointmentAttributes } from 'api/types'
import { Box, BoxProps, ClickToCallPhoneNumber, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { useTheme } from 'utils/hooks'

type TravelClaimFiledDetailsProps = {
  attributes: AppointmentAttributes
}

const spacer = (theme: VATheme) => {
  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderBottomWidth: 'default',
    borderBottomColor: 'primary',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    height: theme.dimensions.standardMarginBetween,
    backgroundColor: 'main',
    mx: -theme.dimensions.gutter,
  }
  return <Box {...boxProps} />
}

function TravelClaimFiledDetails({ attributes }: TravelClaimFiledDetailsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()

  if (!attributes.travelPayClaim?.claim) {
    return null
  }

  return (
    <Box testID="travelClaimDetails">
      {spacer(theme)}
      <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
        {t('travelPay.travelClaimFiledDetails.header')}
      </TextView>
      <TextView variant="MobileBody">
        {t('travelPay.travelClaimFiledDetails.claimNumber', {
          claimNumber: attributes.travelPayClaim?.claim?.claimNumber,
        })}
      </TextView>
      <TextView mt={theme.dimensions.condensedMarginBetween} variant="MobileBody">
        {t('travelPay.travelClaimFiledDetails.status', {
          status: attributes.travelPayClaim?.claim?.claimStatus,
        })}
      </TextView>
      <TextView testID="helpTitleID" variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
        {t('travelPay.travelClaimFiledDetails.needHelp')}
      </TextView>
      <TextView testID="helpTextID" variant="MobileBody">
        {t('travelPay.helpText')}
      </TextView>
      <Box my={theme.dimensions.condensedMarginBetween}>
        <ClickToCallPhoneNumber phone={t('travelPay.phone')} center={false} a11yLabel={'travelPay.phone.a11yHint'} />
      </Box>
    </Box>
  )
}

export default TravelClaimFiledDetails
