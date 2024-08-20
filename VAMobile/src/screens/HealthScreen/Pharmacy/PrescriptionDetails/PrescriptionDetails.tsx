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
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { useDestructiveActionSheet, useDowntime, useExternalLink, useRouteNavigation, useTheme } from 'utils/hooks'
import { registerReviewEvent } from 'utils/inAppReviews'

import { RefillTag, getDateTextAndLabel, getRxNumberTextAndLabel } from '../PrescriptionCommon'
import DetailsTextSections from './DetailsTextSections'
import PrescriptionsDetailsBanner from './PrescriptionsDetailsBanner'

type PrescriptionDetailsProps = StackScreenProps<HealthStackParamList, 'PrescriptionDetails'>

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

function PrescriptionDetails({ route, navigation }: PrescriptionDetailsProps) {
  const { prescription } = route.params
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const submitRefillAlert = useDestructiveActionSheet()
  const navigateTo = useRouteNavigation()
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const noneNoted = t('noneNoted')

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
    }, []),
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
  const [lastRefilledDateFormatted, lastRefilledDateFormattedA11yLabel] = getDateTextAndLabel(t, refillDate)
  const [expireDateFormatted, expireDateFormattedA11yLabel] = getDateTextAndLabel(t, expirationDate)
  const [dateOrderedFormatted, dateOrderedFormattedA11yLabel] = getDateTextAndLabel(t, orderedDate)

  return (
    <ChildTemplate
      backLabel={t('prescription.title')}
      backLabelOnPress={navigation.goBack}
      title={t('prescriptionDetails')}>
      {loadingHistory ? (
        <LoadingComponent text={t('prescription.details.loading')} />
      ) : (
        <>
          {getBanner()}
          {getRefillVAHealthButton()}
          <Box mb={contentMarginBottom}>
            <TextArea>
              <TextView variant="MobileBodyBold">{prescriptionName}</TextView>
              <TextView color={'placeholder'} accessibilityLabel={rxNumberA11yLabel}>
                {rxNumber}
              </TextView>
              <Box pt={theme.dimensions.standardMarginBetween}>
                <RefillTag status={refillStatus} />
              </Box>
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.instructionsHeader')}
                leftSectionValue={instructions || noneNoted}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.refillLeftHeader')}
                leftSectionValue={refillRemaining ?? noneNoted}
                rightSectionTitle={t('fillDate')}
                rightSectionValue={lastRefilledDateFormatted}
                rightSectionValueLabel={lastRefilledDateFormattedA11yLabel}
              />
              <DetailsTextSections
                leftSectionTitle={t('prescription.details.quantityHeader')}
                leftSectionValue={quantity ?? noneNoted}
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
                leftSectionValue={facilityName || noneNoted}
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
