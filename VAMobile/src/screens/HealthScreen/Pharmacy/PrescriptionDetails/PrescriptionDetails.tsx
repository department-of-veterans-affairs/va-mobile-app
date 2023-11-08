import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, ChildTemplate, ClickToCallPhoneNumber, LoadingComponent, TextArea, TextView, VAButton, VAButtonProps } from 'components'
import { DowntimeFeatureTypeConstants, RefillStatusConstants, ScreenIDTypesConstants } from 'store/api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, loadAllPrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RefillTag, getDateTextAndLabel, getRxNumberTextAndLabel } from '../PrescriptionCommon'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { useAppDispatch, useDestructiveActionSheet, useDowntime, useExternalLink, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'
import DetailsTextSections from './DetailsTextSections'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'
import getEnv from 'utils/env'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const PrescriptionDetails: FC<PrescriptionDetailsProps> = ({ route, navigation }) => {
  const { prescriptionId } = route.params
  const { loadingHistory, prescriptionsById, prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const submitRefillAlert = useDestructiveActionSheet()
  const dispatch = useAppDispatch()
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const noneNoted = t('noneNoted')

  const { contentMarginBottom } = theme.dimensions

  const prescription = prescriptionsById[prescriptionId]
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

  // useFocusEffect, ensures we only call loadAllPrescriptions if needed when this component is being shown
  useFocusEffect(
    React.useCallback(() => {
      if (prescriptionsNeedLoad) {
        dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_TRACKING_DETAILS_SCREEN_ID))
      }
      setAnalyticsUserProperty(UserAnalytics.vama_uses_rx())
    }, [dispatch, prescriptionsNeedLoad]),
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
    const buttonProps: VAButtonProps = {
      label: t('goToMyVAHealth'),
      testID: a11yLabelVA(t('goToMyVAHealth')),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: redirectLink,
      iconProps: {
        name: 'ExternalLink',
        height: 15,
        width: 15,
        fill: 'navBar',
        preventScaling: true,
      },
    }
    return (
      <Box mb={theme.dimensions.buttonPadding} mx={theme.dimensions.buttonPadding}>
        <VAButton {...buttonProps} />
      </Box>
    )
  }

  const getRequestRefillButton = () => {
    const requestRefillButtonProps: VAButtonProps = {
      label: t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 }),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: () => {
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
                  dispatch(requestRefills([prescription]))
                }
                navigation.navigate('RefillScreenModal')
              },
            },
          ],
        })
      },
    }
    return (
      <Box mb={theme.dimensions.buttonPadding} mx={theme.dimensions.buttonPadding}>
        <VAButton {...requestRefillButtonProps} />
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
  const [lastRefilledDateFormatted, lastRefilledDateFormattedA11yLabel] = getDateTextAndLabel(t, refillDate)
  const [expireDateFormatted, expireDateFormattedA11yLabel] = getDateTextAndLabel(t, expirationDate)
  const [dateOrderedFormatted, dateOrderedFormattedA11yLabel] = getDateTextAndLabel(t, orderedDate)

  if (loadingHistory) {
    return (
      <ChildTemplate backLabel={t('prescription.title')} backLabelOnPress={navigation.goBack} title={t('prescriptionDetails')}>
        <LoadingComponent text={t('prescription.details.loading')} />
      </ChildTemplate>
    )
  }

  return (
    <ChildTemplate backLabel={t('prescription.title')} backLabelOnPress={navigation.goBack} title={t('prescriptionDetails')}>
      {getBanner()}
      {getRefillVAHealthButton()}
      <Box mb={contentMarginBottom}>
        <TextArea>
          <TextView variant="BitterBoldHeading">{prescriptionName}</TextView>
          <TextView color={'placeholder'} accessibilityLabel={rxNumberA11yLabel}>
            {rxNumber}
          </TextView>
          <Box pt={theme.dimensions.standardMarginBetween}>
            <RefillTag status={refillStatus} />
          </Box>
          <DetailsTextSections leftSectionTitle={t('prescription.details.instructionsHeader')} leftSectionValue={instructions || noneNoted} />
          <DetailsTextSections
            leftSectionTitle={t('prescription.details.refillLeftHeader')}
            leftSectionValue={refillRemaining ?? noneNoted}
            rightSectionTitle={t('prescription.details.lastFillDateHeader')}
            rightSectionValue={lastRefilledDateFormatted}
            rightSectionValueLabel={lastRefilledDateFormattedA11yLabel}
          />
          <DetailsTextSections leftSectionTitle={t('prescription.details.quantityHeader')} leftSectionValue={quantity ?? noneNoted} />
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
            leftSectionValue={facilityName || noneNoted}
            leftSectionTitleLabel={a11yLabelVA(t('prescription.details.vaFacilityHeader'))}>
            <ClickToCallPhoneNumber phone={facilityPhoneNumber} />
          </DetailsTextSections>
        </TextArea>
      </Box>
    </ChildTemplate>
  )
}

export default PrescriptionDetails
