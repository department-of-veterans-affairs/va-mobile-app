import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { MutateOptions } from '@tanstack/react-query'

import { useRequestRefills } from 'api/prescriptions'
import { PrescriptionsList, RefillRequestSummaryItems, RefillStatusConstants } from 'api/types'
import { Box, ChildTemplate, ClickToCallPhoneNumber, LoadingComponent, TextArea, TextView } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import RefillTag from 'screens/HealthScreen/Pharmacy/PrescriptionCommon/RefillTag'
import DetailsTextSections from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/DetailsTextSections'
import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useDowntime, useExternalLink, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { getDateTextAndLabel, getRxNumberTextAndLabel } from 'utils/prescriptions'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function PrescriptionDetails({ route, navigation }: PrescriptionDetailsProps) {
  const { prescription } = route.params
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const submitRefillAlert = useShowActionSheet()
  const navigateTo = useRouteNavigation()
  const registerReviewEvent = useReviewEvent(true)
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { contentMarginBottom } = theme.dimensions

  const {
    refillStatus,
    prescriptionName,
    isRefillable,
    instructions,
    refillRemaining,
    refillDate,
    quantity,
    facilityName,
    facilityPhoneNumber,
    prescriptionNumber,
    expirationDate,
    orderedDate,
  } = prescription?.attributes

  const { mutate: requestRefill, isPending: loadingHistory } = useRequestRefills()

  useFocusEffect(
    React.useCallback(() => {
      setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
      registerReviewEvent()
    }, [registerReviewEvent]),
  )

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_GO_TO_PATIENT_PORTAL)
  }

  const getRefillVAHealthButton = () => {
    if (refillStatus === RefillStatusConstants.TRANSFERRED) {
      return getGoToMyVAHealthButton()
    } else if (isRefillable === true) {
      // Explicit boolean check to handle undefined/null/string values
      return getRequestRefillButton()
    }

    // Diagnostic logging for missing refill button
    if (__DEV__ && isRefillable !== false && refillStatus !== RefillStatusConstants.TRANSFERRED) {
      console.debug('[PrescriptionDetails] Refill button not shown:', {
        id: prescription.id,
        name: prescriptionName,
        isRefillable,
        isRefillableType: typeof isRefillable,
        refillStatus,
        refillRemaining,
      })
    }

    return <></>
  }
  const getGoToMyVAHealthButton = () => {
    return (
      <Box mb={theme.dimensions.buttonPadding} mx={theme.dimensions.buttonPadding}>
        <Button label={t('goToMyVAHealth')} onPress={redirectLink} testID={a11yLabelVA(t('goToMyVAHealth'))} />
      </Box>
    )
  }

  const getRequestRefillButton = () => {
    const requestRefillButtonPress = () => {
      const prescriptionIds = [prescription].map((prescriptions) => prescriptions.id)
      logAnalyticsEvent(Events.vama_rx_request_start(prescriptionIds))

      const options = [t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 }), t('cancel')]
      submitRefillAlert(
        {
          options,
          title: t('prescriptions.refill.confirmationTitle', { count: 1 }),
          cancelButtonIndex: 1,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              // Call refill request so its starts the loading screen and then go to the modal
              if (!prescriptionInDowntime) {
                logAnalyticsEvent(Events.vama_rx_request_confirm(prescriptionIds))
                const mutateOptions: MutateOptions<RefillRequestSummaryItems, Error, PrescriptionsList, void> = {
                  onSettled(data) {
                    navigateTo('RefillScreenModal', { refillRequestSummaryItems: data })
                  },
                }
                requestRefill([prescription], mutateOptions)
              }
              break
            case 1:
              logAnalyticsEvent(Events.vama_rx_request_cancel(prescriptionIds))
              break
          }
        },
      )
    }
    return (
      <Box mb={theme.dimensions.buttonPadding} mx={theme.dimensions.buttonPadding}>
        <Button
          label={t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 })}
          onPress={requestRefillButtonPress}
          testID="requestRefillsButtonID"
        />
      </Box>
    )
  }

  const getBanner = () => {
    if (refillStatus !== RefillStatusConstants.TRANSFERRED) {
      return <></>
    }
    return <PrescriptionsDetailsBanner />
  }

  const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)
  const [lastRefilledDateFormatted, lastRefilledDateFormattedA11yLabel] = getDateTextAndLabel(
    t,
    refillDate,
    t('prescription.details.fillDateNotAvailable'),
  )
  const [expireDateFormatted, expireDateFormattedA11yLabel] = getDateTextAndLabel(
    t,
    expirationDate,
    t('prescription.details.expirationDateNotAvailable'),
  )
  const [dateOrderedFormatted, dateOrderedFormattedA11yLabel] = getDateTextAndLabel(
    t,
    orderedDate,
    t('prescription.details.orderedDateNotAvailable'),
  )
  const refillRemainingText =
    refillRemaining >= 0 && refillRemaining !== null
      ? refillRemaining
      : t('prescription.details.refillRemainingNotAvailable')
  const instructionsText = instructions || t('prescription.details.instructionsNotAvailable')
  const facilityNameText = facilityName || t('prescription.details.facilityNameNotAvailable')
  const quantityText = quantity || t('prescription.details.quantityNotAvailable')

  return (
    <ChildTemplate
      backLabel={t('prescription.title')}
      backLabelOnPress={navigation.goBack}
      title={t('prescriptionDetails')}
      backLabelTestID="prescriptionsDetailsBackTestID">
      {loadingHistory ? (
        <LoadingComponent text={t('prescription.details.loading')} />
      ) : (
        <>
          {getBanner()}
          {getRefillVAHealthButton()}
          <Box mb={contentMarginBottom}>
            <TextArea>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {prescriptionName}
              </TextView>
              {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
              <TextView color={'placeholder'} accessibilityLabel={rxNumberA11yLabel}>
                {rxNumber}
              </TextView>
              <Box pt={theme.dimensions.standardMarginBetween}>
                <RefillTag status={refillStatus} />
              </Box>
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.instructionsHeader')}
                leftSectionValue={instructionsText}
                leftSectionTitleLabel={instructionsText}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.refillLeftHeader')}
                leftSectionValue={refillRemainingText}
                leftSectionValueLabel={t('prescription.details.refillRemainingNotAvailable')}
                rightSectionTitle={t('fillDate')}
                rightSectionValue={lastRefilledDateFormatted}
                rightSectionValueLabel={lastRefilledDateFormattedA11yLabel}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.quantityHeader')}
                leftSectionValue={quantityText}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.expiresOnHeader')}
                leftSectionValue={expireDateFormatted}
                leftSectionValueLabel={expireDateFormattedA11yLabel}
                rightSectionTitle={t('prescription.details.orderedOnHeader')}
                rightSectionValue={dateOrderedFormatted}
                rightSectionValueLabel={dateOrderedFormattedA11yLabel}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.vaFacilityHeader')}
                leftSectionValue={facilityNameText}
                leftSectionTitleLabel={a11yLabelVA(t('prescription.details.vaFacilityHeader'))}>
                <ClickToCallPhoneNumber phone={facilityPhoneNumber} />
              </DetailsTextSections>
            </TextArea>
          </Box>
        </>
      )}
    </ChildTemplate>
  )
}

export default PrescriptionDetails
