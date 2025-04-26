import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, Checkbox } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { useContactInformation } from 'api/contactInformation'
import { submitClaim } from 'api/travelPay/submitClaim'
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
import { NAMESPACE } from 'constants/namespaces'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type ReviewClaimScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ReviewClaimScreen'>

function ReviewClaimScreen({ route }: ReviewClaimScreenProps) {
  const { appointmentDateTime, facilityName } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { setSubtaskProps } = useContext(SubtaskContext)

  useSubtaskProps({
    leftButtonText: t('back'),
    onLeftButtonPress: () => navigateTo('AddressScreen'),
    leftButtonTestID: 'leftBackTestID',
    rightButtonText: t('help'),
    rightIconProps: {
      name: 'Help',
      fill: 'default',
    },
    rightButtonTestID: 'rightHelpTestID',
    onRightButtonPress: () => navigateTo('TravelClaimHelpScreen'),
  })

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [checkBoxError, setCheckBoxError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!loading) {
      return
    }
    setSubtaskProps({
      rightButtonText: t('close'),
      rightButtonTestID: 'rightCloseTestID',
    })
  }, [loading, setSubtaskProps, t])

  const theme = useTheme()
  const isPortrait = useOrientation()

  const contactInformationQuery = useContactInformation({ enabled: true })
  const address = getTextForAddressData(contactInformationQuery.data, 'residentialAddress', t)

  const navigateToErrorScreen = () => {
    navigateTo('ErrorScreen', { error: 'error' })
  }

  const submitTravelClaim = async () => {
    if (!isCheckboxChecked) {
      setCheckBoxError(t('required'))
      return
    }
    setLoading(true)

    // Set a timeout to navigate to the error screen if the claim is not submitted in 30 seconds
    const timeout = setTimeout(() => {
      navigateToErrorScreen()
    }, 30000)
    try {
      await submitClaim()
      navigateTo('SubmitSuccessScreen', {
        appointmentDateTime,
        facilityName,
      })
    } catch (error) {
      navigateToErrorScreen()
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  if (loading) {
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
        <TextView mt={theme.dimensions.condensedMarginBetween} testID="penaltyStatementID" variant="MobileBody">
          <TextView variant="MobileBodyBold">{t('travelPay.penaltyStatementLine') + ' '}</TextView>
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
              setIsCheckboxChecked(!isCheckboxChecked)
            }}
            checked={isCheckboxChecked}
            error={checkBoxError}
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
