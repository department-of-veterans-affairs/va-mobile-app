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
import { NAMESPACE } from 'constants/namespaces'
import { getTextForAddressData } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary/AddressSummary'
import { useOrientation, useRouteNavigation, useTheme } from 'utils/hooks'

import { SubmitTravelPayFlowModalStackParamList } from '../SubmitMileageTravelPayScreen'

type ReviewClaimScreenProps = StackScreenProps<SubmitTravelPayFlowModalStackParamList, 'ReviewClaimScreen'>

function ReviewClaimScreen({ route }: ReviewClaimScreenProps) {
  const { attributes } = route.params
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const { setSubtaskProps } = useContext(SubtaskContext)
  const { mutate: submitClaim, isPending: submittingTravelClaim } = useSubmitTravelClaim()

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

  const submitTravelClaim = async () => {
    if (!isCheckboxChecked) {
      setCheckBoxError(t('required'))
      return
    }

    if (!attributes.location.id) {
      navigateTo('ErrorScreen', { error: 'error' })
      return
    }

    submitClaim(
      {
        appointmentDateTime: attributes.startDateLocal,
        facilityStationNumber: attributes.location.id,
        appointmentType: 'Other',
        isComplete: false,
      },
      {
        onSuccess: (_data) => {
          //TODOD: Modify the nav params to include the claim data
          navigateTo('SubmitSuccessScreen', {
            appointmentDateTime: attributes.startDateUtc,
            facilityName: attributes.location.name,
          })
        },
        onError: () => {
          navigateTo('ErrorScreen', { error: 'error' })
        },
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
