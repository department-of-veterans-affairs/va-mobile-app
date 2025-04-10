import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, Checkbox } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { useContactInformation } from 'api/contactInformation'
import { Box, LinkWithAnalytics, TextArea, TextLine, TextView, VABulletList, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type ReviewClaimScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ReviewClaimScreen'>

function ReviewClaimScreen({ route }: ReviewClaimScreenProps) {
  const { appointmentDateTime } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [error, setError] = useState<string>('')

  const theme = useTheme()
  const isPortrait = useOrientation()

  const contactInformationQuery = useContactInformation({ enabled: true })

  const address = getTextForAddressData(contactInformationQuery.data, 'residentialAddress', t)

  return (
    <VAScrollView>
      <Box
        mb={theme.dimensions.standardMarginBetween}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="reviewTitleID" variant="BitterHeading" accessibilityRole="header">
          {t('travelPay.reviewTitle')}
        </TextView>
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextArea>
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextView testID="whatID" variant="MobileBodyBold">
              {t('travelPay.reviewDetails.what')}
            </TextView>

            <TextView testID="milageOnlyID" variant="MobileBody">
              {t('travelPay.reviewDetails.milageOnly')}
            </TextView>
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VABulletList
                listOfText={[
                  DateTime.fromISO(appointmentDateTime).toFormat(
                    `cccc, LLLL dd yyyy '${t('dateTime.at')}' hh:mm a ZZZZ`,
                  ),
                ]}
              />
            </Box>
          </Box>
          <Box mb={theme.dimensions.standardMarginBetween}>
            <TextView testID="howID" variant="MobileBodyBold">
              {t('travelPay.reviewDetails.how')}
            </TextView>
            <TextView testID="vehicleID" variant="MobileBody">
              {t('travelPay.reviewDetails.vehicle')}
            </TextView>
          </Box>
          <Box>
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
          </Box>
        </TextArea>
      </Box>
      <Box
        mt={theme.dimensions.formMarginBetween}
        mx={isPortrait ? theme.dimensions.gutter : theme.dimensions.headerHeight}>
        <TextView testID="travelAgreementHeaderID" variant="MobileBodyBold">
          {t('travelPay.travelAgreementHeader')}
        </TextView>
        <TextView mt={theme.dimensions.condensedMarginBetween} testID="travelAgreementTextID" variant="MobileBody">
          <TextView variant="MobileBodyBold">{t('travelPay.penaltyStatementLine') + ' '}</TextView>
          {t('travelPay.penaltyStatement')}
        </TextView>
        <TextView mt={theme.dimensions.formMarginBetween} testID="travelAgreementTextID" variant="MobileBody">
          {t('travelPay.penaltyStatement.agreement')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="custom"
            text={t('travelPay.reviewLink')}
            testID="travelAgreementLinkID"
            onPress={() => {
              navigateTo('BeneficiaryTravelAgreementScreen')
            }}
          />
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <Checkbox
            label={t('travelPay.penaltyStatement.checkbox')}
            onPress={() => {
              setIsCheckboxChecked(!isCheckboxChecked)
            }}
            checked={isCheckboxChecked}
            error={error}
            testID="checkboxTestID"
          />
        </Box>
        <Box my={theme.dimensions.textAndButtonLargeMargin}>
          <Button
            onPress={() => {
              if (isCheckboxChecked) {
                navigateTo('SubmitLoadingScreen')
              } else {
                setError(t('required'))
              }
            }}
            testID="submitTestID"
            label={t('travelPay.submitClaim')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default ReviewClaimScreen
