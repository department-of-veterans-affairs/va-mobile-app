import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useLayoutEffect } from 'react'

import { Box, BoxProps, CloseModalButton, DefaultList, DefaultListItemObj, ErrorComponent, LoadingComponent, TextArea, TextView, TextViewProps, VAScrollView } from 'components'
import { DELIVERY_SERVICE_TYPES, DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getTrackingInfo } from 'store/slices'
import { PrescriptionTrackingInfoAttributeData, PrescriptionTrackingInfoOtherItem } from 'store/api'
import { RootState } from 'store'
import { formatDateUtc } from 'utils/formattingUtils'
import { isIOS } from 'utils/platform'
import { useAppDispatch, useDowntime, useError, useExternalLink, useModalHeaderStyles, useTheme } from 'utils/hooks'
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
  const headerStyle = useModalHeaderStyles()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions
  const launchExternalLink = useExternalLink()
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const hasError = useError(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID)

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
      headerLeft: (props) => (
        <CloseModalButton
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

  // ErrorComponent normally handles both downtime and error but can only for 1 screenID.
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

  const commonBoxHeaderProps: TextViewProps = {
    mt: 30,
    mb: condensedMarginBetween,
    mx: gutter,
    accessibilityRole: 'header',
    variant: 'MobileBodyBold',
  }

  const renderTrackingInfo = () => {
    const dividerProps: BoxProps = {
      my: standardMarginBetween,
      borderBottomWidth: theme.dimensions.borderWidth,
      borderBottomColor: 'primary',
    }

    const trackingLink = getTrackingLink(deliveryService)
    const trackingNumberProps: TextViewProps = {
      variant: trackingLink ? 'MobileBodyLink' : 'MobileBody',
      onPress: trackingLink
        ? () => {
            launchExternalLink(trackingLink + trackingNumber)
          }
        : undefined,
    }

    return (
      <>
        <TextView {...commonBoxHeaderProps}>{t('prescriptions.refillTracking.trackingInformation')}</TextView>
        <TextArea>
          <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.trackingNumber')}</TextView>
          <TextView {...trackingNumberProps}>{trackingNumber || tc('noneNoted')}</TextView>
          <Box mt={condensedMarginBetween}>
            <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.deliveryService')}</TextView>
            <TextView variant="MobileBody">{deliveryService || tc('noneNoted')}</TextView>
          </Box>
          <Box {...dividerProps} />
          <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.dateShipped')}</TextView>
          <TextView variant="MobileBody">{shippedDate ? `${formatDateUtc(shippedDate, 'MM/dd/yyyy')}` : tc('noneNoted')}</TextView>
        </TextArea>
      </>
    )
  }

  const renderPrescriptionInfo = () => {
    const commonTextProps: TextViewProps = {
      variant: 'HelperText',
      mt: condensedMarginBetween,
    }
    const { prescriptionName, prescriptionNumber, instructions, refillRemaining, refillDate, facilityName } = prescription?.attributes
    return (
      <>
        <TextView {...commonBoxHeaderProps}>{t('prescriptions.refillTracking.prescriptionInformation')}</TextView>
        <TextArea>
          <TextView variant="MobileBodyBold">{prescriptionName}</TextView>
          <TextView {...commonTextProps} color={'placeholder'} mt={0}>
            {`${t('prescription.prescriptionNumber')} ${prescriptionNumber || tc('noneNoted')}`}
          </TextView>
          <TextView {...commonTextProps} mt={0} my={standardMarginBetween}>
            {instructions || t('prescription.refillTracking.instructions.noneNoted')}
          </TextView>
          <TextView {...commonTextProps} mt={0}>{`${t('prescription.refillsLeft')} ${refillRemaining > -1 ? refillRemaining : tc('noneNoted')}`}</TextView>
          <TextView {...commonTextProps}>{`${t('prescriptions.sort.fillDate')}: ${refillDate ? formatDateUtc(refillDate, 'MM/dd/yyyy') : tc('noneNoted')}`}</TextView>
          <TextView {...commonTextProps} accessibilityLabel={`${t('prescription.vaFacility.a11yLabel')} ${facilityName || tc('noneNoted')}`}>{`${t('prescription.vaFacility')} ${
            facilityName || tc('noneNoted')
          }`}</TextView>
        </TextArea>
      </>
    )
  }

  const renderOtherPrescription = () => {
    if (!otherPrescriptions || otherPrescriptions.length === 0) {
      return (
        <>
          <TextView {...commonBoxHeaderProps}>{t('prescriptions.refillTracking.otherPrescription')}</TextView>
          <Box mx={gutter} mb={contentMarginBottom}>
            <TextView variant="MobileBody">{t('prescriptions.refillTracking.otherPrescription.none')}</TextView>
          </Box>
        </>
      )
    }

    const otherPrescriptionItems: Array<DefaultListItemObj> = otherPrescriptions.map((item: PrescriptionTrackingInfoOtherItem) => {
      const { prescriptionName, prescriptionNumber } = item
      const rxNumber = `${t('prescription.prescriptionNumber')} ${prescriptionNumber || tc('noneNoted')}`
      return {
        textLines: [
          {
            text: prescriptionName,
            variant: 'MobileBodyBold',
          },
          {
            text: rxNumber,
            color: 'placeholder',
            variant: 'HelperText',
          },
        ],
        testId: `${prescriptionName} ${rxNumber}`,
      }
    })
    return (
      <>
        <TextView {...commonBoxHeaderProps}>{t('prescriptions.refillTracking.otherPrescription')}</TextView>
        <Box mb={contentMarginBottom}>
          <DefaultList items={otherPrescriptionItems} />
        </Box>
      </>
    )
  }

  return (
    <VAScrollView>
      {renderTrackingInfo()}
      {renderPrescriptionInfo()}
      {renderOtherPrescription()}
    </VAScrollView>
  )
}

export default RefillTrackingDetails
