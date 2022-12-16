import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ButtonTypesConstants, ClickToCallPhoneNumber, LoadingComponent, TextArea, TextView, VAButton, VAButtonProps, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, RefillStatusConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, loadAllPrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RefillTag, getDateTextAndLabel, getRxNumberTextAndLabel } from '../PrescriptionCommon'
import { RootState } from 'store'
import { UserAnalytics } from 'constants/analytics'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useAppDispatch, useDestructiveAlert, useDowntime, useExternalLink, useTheme } from 'utils/hooks'
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
  const submitRefillAlert = useDestructiveAlert()
  const dispatch = useAppDispatch()
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const noneNoted = tc('noneNoted')

  const { contentMarginTop, contentMarginBottom } = theme.dimensions

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
      label: tc('goToMyVAHealth'),
      testID: tc('goToMyVAHealth.a11yLabel'),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: redirectLink,
      iconProps: {
        name: 'WebviewOpen',
        height: 15,
        width: 15,
        fill: 'navBar',
        preventScaling: true,
      },
    }
    return (
      <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
        <VAButton {...buttonProps} />
      </Box>
    )
  }

  const getRequestRefillButton = () => {
    const requestRefillButtonProps: VAButtonProps = {
      label: t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 }),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: () => {
        submitRefillAlert({
          title: t('prescriptions.refill.confirmationTitle', { count: 1 }),
          cancelButtonIndex: 0,
          buttons: [
            {
              text: tc('cancel'),
            },
            {
              text: t('prescriptions.refill.RequestRefillButtonTitle', { count: 1 }),
              onPress: () => {
                // Call refill request so its starts the loading screen and then go to the modal
                if (!prescriptionInDowntime) {
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
      <Box mx={theme.dimensions.buttonPadding} mt={theme.dimensions.buttonPadding}>
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
    return <LoadingComponent text={t('prescription.details.loading')} />
  }

  return (
    <>
      <VAScrollView>
        {getBanner()}
        {getRefillVAHealthButton()}
        <Box mt={contentMarginTop} mb={contentMarginBottom}>
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
              leftSectionTitleLabel={t('prescription.details.vaFacilityHeaderLabel')}>
              <ClickToCallPhoneNumber phone={facilityPhoneNumber} />
            </DetailsTextSections>
          </TextArea>
        </Box>
      </VAScrollView>
    </>
  )
}

export default PrescriptionDetails
