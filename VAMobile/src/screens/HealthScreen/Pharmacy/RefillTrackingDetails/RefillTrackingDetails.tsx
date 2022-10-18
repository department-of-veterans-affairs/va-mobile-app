import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useLayoutEffect } from 'react'

import { Box, ClosePanelButton, ErrorComponent, LoadingComponent, MultiTouchCard, MultiTouchCardProps, TextView, VAScrollView } from 'components'
import { ClickForActionLink } from 'components'
import { DELIVERY_SERVICE_TYPES, DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getTrackingInfo } from 'store/slices'
import { PrescriptionTrackingInfoAttributeData, PrescriptionTrackingInfoOtherItem } from 'store/api'
import { RootState } from 'store'
import { formatDateUtc } from 'utils/formattingUtils'
import { isIOS } from 'utils/platform'
import { useAppDispatch, useDowntime, useError, usePanelHeaderStyles, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import getEnv from 'utils/env'

const { CARRIER_TRACKING_URL_USPS, CARRIER_TRACKING_URL_UPS, CARRIER_TRACKING_URL_FEDEX, CARRIER_TRACKING_URL_DHL } = getEnv()

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

const RefillTrackingDetails: FC<RefillTrackingDetailsProps> = ({ route, navigation }) => {
  const { prescription } = route.params
  const dispatch = useAppDispatch()
  const { loadingTrackingInfo, trackingInfo } = useSelector<RootState, PrescriptionState>((state) => state.prescriptions)
  const headerStyle = usePanelHeaderStyles()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, contentMarginBottom, contentMarginTop, gutter, standardMarginBetween } = theme.dimensions
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const hasError = useError(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID)
  const noneNoted = tc('noneNoted')

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: (props) => (
        <ClosePanelButton
          buttonText={tc('close')}
          onPress={props.onPress}
          buttonTextColor={'showAll'}
          focusOnButton={isIOS() ? false : true} // this is done due to ios not reading the button name on modal
        />
      ),
    })
  }, [navigation, headerStyle, tc])

  useEffect(() => {
    if (!prescriptionInDowntime) {
      dispatch(getTrackingInfo(prescription.id, ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID))
    }
  }, [dispatch, prescription, prescriptionInDowntime])

  // ErrorComponent normally handles both downtime and error but only for 1 screenID.
  // In this case, we need to support two different screenIDs:
  // 1. Generic 'rx_refill' downtime message that can be seen in multiple Pharmacy screens
  // 2. Error message specific to this page
  if (prescriptionInDowntime) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
  }

  if (hasError) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID} />
  }

  if (loadingTrackingInfo) {
    return <LoadingComponent text={t('prescriptions.refillTracking.loading')} />
  }

  const { trackingNumber, deliveryService, shippedDate, otherPrescriptions } = trackingInfo?.attributes || ({} as PrescriptionTrackingInfoAttributeData)

  const renderOtherPrescription = () => {
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
        const rxNumber = `${t('prescription.prescriptionNumber')} ${prescriptionNumber || noneNoted}`
        return (
          <Box key={prescriptionName} mt={condensedMarginBetween}>
            <TextView variant="MobileBodyBold">{prescriptionName}</TextView>
            <TextView variant="HelperText" color="placeholder">
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

  const renderTrackingCard = () => {
    const trackingLink = getTrackingLink(deliveryService)

    const mainContent = (
      <>
        <TextView variant="MobileBodyBold">{t('prescriptions.refillTracking.trackingNumber')}</TextView>
        {trackingLink && trackingNumber ? (
          <ClickForActionLink displayedText={trackingNumber} linkType="externalLink" numberOrUrlLink={trackingLink + trackingNumber} a11yLabel={trackingNumber} />
        ) : (
          <TextView variant={'MobileBody'}>{trackingNumber || noneNoted}</TextView>
        )}
        <Box mt={standardMarginBetween} mb={condensedMarginBetween}>
          <TextView variant="HelperText">{`${t('prescriptions.refillTracking.deliveryService')}: ${deliveryService || noneNoted}`}</TextView>
        </Box>
        <TextView variant="HelperText">{`${t('prescriptions.refillTracking.dateShipped')}: ${shippedDate ? `${formatDateUtc(shippedDate, 'MM/dd/yyyy')}` : noneNoted}`}</TextView>
        {renderOtherPrescription()}
      </>
    )
    const multiTouchCardProps: MultiTouchCardProps = {
      mainContent: mainContent,
    }

    return <MultiTouchCard {...multiTouchCardProps} />
  }

  const renderHeader = () => {
    const { prescriptionName, prescriptionNumber } = prescription?.attributes
    return (
      <>
        <TextView variant="BitterBoldHeading">{prescriptionName}</TextView>
        <TextView variant={'HelperText'}>{`${t('prescription.prescriptionNumber')} ${prescriptionNumber || noneNoted}`}</TextView>
      </>
    )
  }

  return (
    <VAScrollView>
      <Box mx={gutter} mt={contentMarginTop} mb={contentMarginBottom}>
        {renderHeader()}
        <Box my={standardMarginBetween}>
          <TextView variant="HelperText">{t('prescriptions.refillTracking.upTo15Days')}</TextView>
        </Box>
        {renderTrackingCard()}
      </Box>
    </VAScrollView>
  )
}

export default RefillTrackingDetails
