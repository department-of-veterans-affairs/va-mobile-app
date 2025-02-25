import React from 'react'
import { useTranslation } from 'react-i18next'

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { useTrackingInfo } from 'api/prescriptions'
import {
  DELIVERY_SERVICE_TYPES,
  PrescriptionTrackingInfoAttributeData,
  PrescriptionTrackingInfoOtherItem,
} from 'api/types'
import {
  Box,
  ErrorComponent,
  FullScreenSubtask,
  LinkWithAnalytics,
  LoadingComponent,
  MultiTouchCard,
  MultiTouchCardProps,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { useBeforeNavBackListener, useDowntime, useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import { getDateTextAndLabel, getRxNumberTextAndLabel } from '../PrescriptionCommon'

const { CARRIER_TRACKING_URL_USPS, CARRIER_TRACKING_URL_UPS, CARRIER_TRACKING_URL_FEDEX, CARRIER_TRACKING_URL_DHL } =
  getEnv()

type RefillTrackingDetailsProps = StackScreenProps<HealthStackParamList, 'RefillTrackingModal'>

const getTrackingLink = (deliveryService: string): string => {
  const upperCaseCarrier = deliveryService?.toUpperCase() || ''
  switch (upperCaseCarrier) {
    case DELIVERY_SERVICE_TYPES.USPS:
      return CARRIER_TRACKING_URL_USPS
    case DELIVERY_SERVICE_TYPES.UPS:
      return CARRIER_TRACKING_URL_UPS
    case DELIVERY_SERVICE_TYPES.FEDEX:
      return CARRIER_TRACKING_URL_FEDEX
    case DELIVERY_SERVICE_TYPES.DHL:
      return CARRIER_TRACKING_URL_DHL
    default:
      return ''
  }
}

function RefillTrackingDetails({ route, navigation }: RefillTrackingDetailsProps) {
  const { prescription } = route.params
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const registerReviewEvent = useReviewEvent(true)
  const {
    data: trackingInfo,
    isFetching: loadingTrackingInfo,
    error: hasError,
    refetch: refetchTracking,
  } = useTrackingInfo(prescription.id, {
    enabled: screenContentAllowed('WG_RefillTrackingModal') && !prescriptionInDowntime,
  })
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions
  const noneNoted = t('noneNoted')

  useBeforeNavBackListener(navigation, () => {
    logAnalyticsEvent(Events.vama_rx_trackdet_close(prescription.id))
  })

  useFocusEffect(
    React.useCallback(() => {
      registerReviewEvent()
    }, [registerReviewEvent]),
  )

  const renderOtherPrescription = (otherPrescriptions: Array<PrescriptionTrackingInfoOtherItem>) => {
    const noOtherPrescriptions = !otherPrescriptions || otherPrescriptions.length === 0
    let otherPrescriptionItems

    if (noOtherPrescriptions) {
      otherPrescriptionItems = (
        <Box mt={condensedMarginBetween}>
          <TextView variant="HelperText">{t('prescriptions.refillTracking.otherPrescription.none')}</TextView>
        </Box>
      )
    } else {
      otherPrescriptionItems = otherPrescriptions.map((item: PrescriptionTrackingInfoOtherItem) => {
        const { prescriptionName, prescriptionNumber } = item
        const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)

        return (
          <Box key={prescriptionName} mt={condensedMarginBetween}>
            <TextView variant="MobileBodyBold">{prescriptionName}</TextView>
            <TextView accessibilityLabel={rxNumberA11yLabel} variant="HelperText" color="placeholder">
              {rxNumber}
            </TextView>
          </Box>
        )
      })
    }

    return (
      <>
        <Box mt={standardMarginBetween}>
          <TextView variant={'HelperText'}>{`${t('prescriptions.refillTracking.otherPrescription')}:`}</TextView>
        </Box>
        {otherPrescriptionItems}
      </>
    )
  }

  const renderTrackingCards = () => {
    const totalTracking = trackingInfo?.length
    return trackingInfo?.map((prescriptionTrackingInfo, index) => {
      const { trackingNumber, deliveryService, shippedDate, otherPrescriptions } =
        prescriptionTrackingInfo?.attributes || ({} as PrescriptionTrackingInfoAttributeData)
      const trackingLink = getTrackingLink(deliveryService)

      const [shippedDateMMddyyyy, shippedDateA11yLabel] = getDateTextAndLabel(t, shippedDate)
      const trackingNumberA11yLabel = a11yLabelID(trackingNumber)

      const mainContent = (
        <>
          <TextView variant="MobileBodyBold" accessibilityRole="header">
            {t('prescriptions.refillTracking.trackingNumber')}
          </TextView>
          {trackingLink && trackingNumber ? (
            <LinkWithAnalytics
              type="url"
              url={trackingLink + trackingNumber}
              text={trackingNumber}
              a11yLabel={trackingNumberA11yLabel}
              testID="trackingLink"
            />
          ) : (
            <TextView variant={'MobileBody'} accessibilityLabel={trackingNumberA11yLabel || noneNoted}>
              {trackingNumber || noneNoted}
            </TextView>
          )}
          <Box mt={standardMarginBetween} mb={condensedMarginBetween}>
            <TextView variant="HelperText">{`${t('prescriptions.refillTracking.deliveryService')}: ${deliveryService || noneNoted}`}</TextView>
          </Box>
          <TextView
            variant="HelperText"
            accessibilityLabel={`${t('prescriptions.refillTracking.dateShipped')}: ${shippedDateA11yLabel}`}>{`${t(
            'prescriptions.refillTracking.dateShipped',
          )}: ${shippedDateMMddyyyy}`}</TextView>
          {renderOtherPrescription(otherPrescriptions)}
        </>
      )
      const multiTouchCardProps: MultiTouchCardProps = {
        mainContent: mainContent,
      }

      return (
        <Box key={index} mt={30}>
          {trackingInfo?.length > 1 ? (
            <Box mb={condensedMarginBetween}>
              <TextView
                variant="MobileBodyBold"
                accessibilityRole="header">{`${t('package')} ${t('listPosition', { position: index + 1, total: totalTracking })}`}</TextView>
            </Box>
          ) : (
            <></>
          )}
          <MultiTouchCard {...multiTouchCardProps} />
        </Box>
      )
    })
  }

  const renderHeader = () => {
    const { prescriptionName, prescriptionNumber } = prescription?.attributes
    const [rxNumber, rxNumberA11yLabel] = getRxNumberTextAndLabel(t, prescriptionNumber)

    return (
      <>
        <TextView variant="MobileBodyBold" accessibilityRole="header" mt={theme.dimensions.condensedMarginBetween}>
          {prescriptionName}
        </TextView>
        <TextView variant={'HelperText'} accessibilityLabel={rxNumberA11yLabel}>
          {rxNumber}
        </TextView>
      </>
    )
  }

  // ErrorComponent normally handles both downtime and error but only for 1 screenID.
  // In this case, we need to support two different screenIDs:
  // 1. Generic 'rx_refill' downtime message that can be seen in multiple Pharmacy screens
  // 2. Error message specific to this page
  return (
    <FullScreenSubtask
      title={t('prescriptionTracking')}
      rightButtonText={t('close')}
      testID="refillTrackingDetailsTestID"
      rightButtonTestID="prescriptionsBackTestID">
      {prescriptionInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
      ) : loadingTrackingInfo ? (
        <LoadingComponent text={t('prescriptions.refillTracking.loading')} />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID}
          error={hasError}
          onTryAgain={refetchTracking}
        />
      ) : (
        <Box mx={gutter} mb={contentMarginBottom}>
          {renderHeader()}
          <Box mt={standardMarginBetween}>
            <TextView variant="HelperText" paragraphSpacing={true}>
              {t('prescriptions.refillTracking.upTo15Days')}
            </TextView>
          </Box>
          <TextView
            variant="HelperText"
            accessibilityLabel={a11yLabelVA(t('prescriptions.refillTracking.deliveryChanges'))}>
            {t('prescriptions.refillTracking.deliveryChanges')}
          </TextView>
          {renderTrackingCards()}
        </Box>
      )}
    </FullScreenSubtask>
  )
}

export default RefillTrackingDetails
