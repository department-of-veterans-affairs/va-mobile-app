import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { useContactInformation } from 'api/contactInformation'
import { Box, TextArea, TextLine, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type ReviewClaimScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ReviewClaimScreen'>

function ReviewClaimScreen({}: ReviewClaimScreenProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)

  const theme = useTheme()
  const isPortrait = useOrientation()

  const contactInformationQuery = useContactInformation({ enabled: true })

  const address = getTextForAddressData(contactInformationQuery.data, 'residentialAddress', t)

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.contentMarginBottom}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="reviewTitleID" variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.reviewTitle')}
        </TextView>
        <TextView testID="reviewTextID" variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.reviewText')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView testID="whatID" variant="MobileBodyBold">
              {t('travelPay.reviewDetails.what')}
            </TextView>
            <TextView testID="milageOnlyID" variant="MobileBody">
              {t('travelPay.reviewDetails.milageOnly')}
            </TextView>
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView testID="howID" variant="MobileBodyBold">
              {t('travelPay.reviewDetails.how')}
            </TextView>
            <TextView testID="vehicleID" variant="MobileBody">
              {t('travelPay.reviewDetails.vehicle')}
            </TextView>
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView testID="whereID" variant="MobileBodyBold">
              {t('travelPay.reviewDetails.where')}
            </TextView>
            {address.map((line: TextLine) => (
              <>
                <TextView key={line.text} variant="MobileBody">
                  {line.text}
                </TextView>
              </>
            ))}
          </TextArea>
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default ReviewClaimScreen
