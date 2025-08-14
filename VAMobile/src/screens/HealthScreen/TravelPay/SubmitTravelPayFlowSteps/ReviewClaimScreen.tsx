import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Checkbox } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import {
  Box,
  LinkWithAnalytics,
  LoadingComponent,
  TextArea,
  TextLine,
  TextView,
  VABulletList,
  VAScrollView,
} from 'components'
import { SubtaskContext, useSubtaskProps } from 'components/Templates/MultiStepSubtask'
import { useTravelPayContext } from 'components/TravelPayContext'
import { NAMESPACE } from 'constants/namespaces'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { getCommonSubtaskProps } from 'utils/travelPay'

function ReviewClaimScreen() {
  const {
    appointment,
    submitTravelClaim,
    submittingTravelClaim,
    userContactInformation,
    penaltyStatementAccepted,
    setPenaltyStatementAccepted,
    penaltyStatementError,
  } = useTravelPayContext()
  const { attributes } = appointment
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { setSubtaskProps } = useContext(SubtaskContext)

  useSubtaskProps(getCommonSubtaskProps(t, navigateTo, 'AddressScreen', undefined, false))

  useEffect(() => {
    if (!submittingTravelClaim) {
      return
    }
    setSubtaskProps({
      rightButtonText: t('close'),
      rightButtonTestID: 'rightCloseTestID',
    })
  }, [submittingTravelClaim, setSubtaskProps, t])

  const theme = useTheme()
  const isPortrait = useOrientation()
  const address = getTextForAddressData(userContactInformation, 'residentialAddress', t)

  if (submittingTravelClaim) {
    return <LoadingComponent text={t('travelPay.submitLoading')} />
  }

  return (
    <VAScrollView testID="reviewClaimScreenID">
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
                  DateTime.fromISO(attributes.startDateUtc).toFormat(
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
              <TextView key={line.text} variant="MobileBody">
                {line.text}
              </TextView>
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
        <TextView mt={theme.dimensions.condensedMarginBetween} testID="penaltyStatementID" variant="MobileBody">
          <TextView variant="MobileBodyBold">{t('travelPay.penaltyStatement.title') + ' '}</TextView>
          {t('travelPay.penaltyStatement')}
        </TextView>
        <TextView mt={theme.dimensions.formMarginBetween} testID="penaltyStatementAgreementID" variant="MobileBody">
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
              setPenaltyStatementAccepted(!penaltyStatementAccepted)
            }}
            checked={penaltyStatementAccepted}
            error={penaltyStatementError ? t('required') : undefined}
            testID="checkboxTestID"
          />
        </Box>
        <Box my={theme.dimensions.textAndButtonLargeMargin}>
          <Button onPress={submitTravelClaim} testID="submitTestID" label={t('travelPay.submitClaim')} />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default ReviewClaimScreen
