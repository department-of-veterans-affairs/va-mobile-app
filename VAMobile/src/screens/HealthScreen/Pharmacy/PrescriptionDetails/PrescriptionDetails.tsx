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
import { useDestructiveActionSheet, useDowntime, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { getDateTextAndLabel, getRxNumberTextAndLabel } from 'utils/prescriptions'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function PrescriptionDetails({ route, navigation }: PrescriptionDetailsProps) {
  const { prescription } = route.params
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const submitRefillAlert = useDestructiveActionSheet()
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
    } else if (isRefillable) {
      return getRequestRefillButton()
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
      submitRefillAlert({
        title: t('prescriptions.refill.confirmationTitle', { count: 1 }),
        cancelButtonIndex: 0,
        buttons: [
          {
            text: t('cancel'),
            onPress: () => {
              logAnalyticsEvent(Events.vama_rx_request_cancel(prescriptionIds))
            },
          },
          {
            text: t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 }),
            onPress: () => {
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
            },
          },
        ],
      })
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
    t('prescription.details.dateNotAvailable'),
  )
  const [expireDateFormatted, expireDateFormattedA11yLabel] = getDateTextAndLabel(
    t,
    expirationDate,
    t('prescription.details.dateNotAvailable'),
  )
  const [dateOrderedFormatted, dateOrderedFormattedA11yLabel] = getDateTextAndLabel(
    t,
    orderedDate,
    t('prescription.details.dateNotAvailable'),
  )
  const refillRemainingText =
    refillRemaining >= 0 ? refillRemaining : t('prescription.details.refillRemainingNotAvailable')

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
                leftSectionValue={instructions || t('prescription.details.instructionsNotAvailable')}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.refillLeftHeader')}
                leftSectionValue={refillRemainingText}
                rightSectionTitle={t('fillDate')}
                rightSectionValue={lastRefilledDateFormatted}
                rightSectionValueLabel={lastRefilledDateFormattedA11yLabel}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.quantityHeader')}
                leftSectionValue={quantity || t('prescription.details.quantityNotAvailable')}
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
                leftSectionValue={facilityName || t('prescription.details.facilityNameNotAvailable')}
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
