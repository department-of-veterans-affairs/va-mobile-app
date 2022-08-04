import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useLayoutEffect } from 'react'

import { Box, BoxProps, CloseModalButton, DefaultList, DefaultListItemObj, LoadingComponent, TextArea, TextView, TextViewProps, VAScrollView } from 'components'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getTrackingInfo } from 'store/slices'
import { PrescriptionTrackingInfoAttributeData, PrescriptionTrackingInfoOtherItem } from 'store/api'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateUtc } from 'utils/formattingUtils'
import { isIOS } from 'utils/platform'
import { useAppDispatch, useModalHeaderStyles, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'

type RefillTrackingDetailsProps = StackScreenProps<HealthStackParamList, 'RefillTrackingModal'>

const RefillTrackingDetails: FC<RefillTrackingDetailsProps> = ({ route, navigation }) => {
  const { prescription } = route.params
  const dispatch = useAppDispatch()
  const { loadingTrackingInfo, trackingInfo } = useSelector<RootState, PrescriptionState>((state) => state.prescriptions)
  const headerStyle = useModalHeaderStyles()
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const { condensedMarginBetween, contentMarginBottom, gutter, standardMarginBetween } = theme.dimensions

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
    dispatch(getTrackingInfo(prescription.id, ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN))
  }, [dispatch, prescription])

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

    return (
      <>
        <TextView {...commonBoxHeaderProps}>{t('prescriptions.refillTracking.trackingInformation')}</TextView>
        <TextArea>
          <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.trackingNumber')}</TextView>
          <TextView variant="MobileBodyLink">{trackingNumber}</TextView>
          <Box mt={condensedMarginBetween}>
            <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.deliveryService')}</TextView>
            <TextView variant="MobileBody">{deliveryService}</TextView>
          </Box>
          <Box {...dividerProps} />
          <TextView variant="HelperTextBold">{t('prescriptions.refillTracking.dateShipped')}</TextView>
          <TextView variant="MobileBody">{`${formatDateUtc(shippedDate || '', 'MM/dd/yyyy')}`}</TextView>
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
          <TextView {...commonTextProps} mt={0}>
            {`${t('prescription.prescriptionNumber')} ${prescriptionNumber}`}
          </TextView>
          <TextView {...commonTextProps} mt={0} my={standardMarginBetween}>
            {instructions}
          </TextView>
          <TextView {...commonTextProps}>{`${t('prescription.refillsLeft')} ${refillRemaining}`}</TextView>
          <TextView {...commonTextProps}>{`${t('prescriptions.sort.fillDate')}: ${formatDateUtc(refillDate || '', 'MM/dd/yyyy')}`}</TextView>
          <TextView {...commonTextProps} accessibilityLabel={t('prescription.vaFacility.a11yLabel')}>{`${t('prescription.vaFacility')} ${facilityName}`}</TextView>
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
      const rxNumber = `${t('prescription.prescriptionNumber')} ${prescriptionNumber}`
      return {
        textLines: [
          {
            text: prescriptionName,
            variant: 'MobileBodyBold',
          },
          {
            text: rxNumber,
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
