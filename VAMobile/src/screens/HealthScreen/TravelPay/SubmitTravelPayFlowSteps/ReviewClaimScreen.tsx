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

function ReviewClaimScreen({ navigation, route }: ReviewClaimScreenProps) {
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
        <TextView variant="BitterBoldHeading" accessibilityRole="header">
          {t('travelPay.reviewTitle')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('travelPay.reviewText')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">{t("What you're claiming")}</TextView>
            <TextView variant="MobileBody">{t('Mileage only')}</TextView>
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">{t('How you traveled')}</TextView>
            <TextView variant="MobileBody">{t('Your own vehicle')}</TextView>
          </TextArea>
        </Box>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <TextArea>
            <TextView variant="MobileBodyBold">{t('Where you traveled from')}</TextView>
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
