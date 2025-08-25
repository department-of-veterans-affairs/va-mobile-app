import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { Button, Checkbox } from '@department-of-veterans-affairs/mobile-component-library'
import { DateTime } from 'luxon'

import { useContactInformation } from 'api/contactInformation'
import { useSubmitTravelClaim } from 'api/travelPay'
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
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { SubmitTravelPayFlowModalStackParamList } from 'screens/HealthScreen/TravelPay/SubmitMileageTravelPayScreen'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { logAnalyticsEvent } from 'utils/analytics'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'
import { getCommonSubtaskProps } from 'utils/travelPay'

type ReviewClaimScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ReviewClaimScreen'>

function ReviewClaimScreen({ route }: ReviewClaimScreenProps) {
  const { appointment, appointmentRouteKey, smocFlowStartDate } = route.params
  const { attributes } = appointment
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { setSubtaskProps } = useContext(SubtaskContext)
  const { mutate: submitClaim, isPending: submittingTravelClaim } = useSubmitTravelClaim(
    appointment.id,
    appointmentRouteKey,
  )

  useSubtaskProps(getCommonSubtaskProps(t, navigateTo, 'AddressScreen', undefined, false))

  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false)
  const [checkBoxError, setCheckBoxError] = useState<string>('')

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

  const contactInformationQuery = useContactInformation({ enabled: true })
  const address = getTextForAddressData(contactInformationQuery.data, 'residentialAddress', t)

  const navigateToErrorScreen = (error: string) => {
    logAnalyticsEvent(Events.vama_smoc_error(error))
    navigateTo('SMOCErrorScreen', { error })
  }

  const submitTravelClaim = async () => {
    if (!isCheckboxChecked) {
      setCheckBoxError(t('required'))
      return
    }

    if (!attributes.location.id) {
      navigateToErrorScreen('error')
      return
    }

    if (smocFlowStartDate) {
      const totalTime = DateTime.now().diff(DateTime.fromISO(smocFlowStartDate)).toMillis()
      logAnalyticsEvent(Events.vama_smoc_time_taken(totalTime))
    }

    submitClaim(
      {
        appointmentDateTime: attributes.startDateLocal,
        facilityStationNumber: attributes.location.id,
        facilityName: attributes.location.name,
        appointmentType: 'Other',
        isComplete: false,
      },
      {
        onSuccess: (data) => {
          navigateTo('SubmitSuccessScreen', {
            appointmentDateTime: attributes.startDateLocal,
            facilityName: attributes.location.name,
            status: data?.data.attributes.claimStatus,
          })
        },
        onError: () => navigateToErrorScreen('error'),
      },
    )
  }

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

            <TextView testID="mileageOnlyID" variant="MobileBody">
              {t('travelPay.reviewDetails.mileageOnly')}
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
