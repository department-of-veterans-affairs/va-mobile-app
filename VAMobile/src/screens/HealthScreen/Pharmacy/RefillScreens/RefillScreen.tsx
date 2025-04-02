import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { MutateOptions } from '@tanstack/react-query'
import { filter } from 'underscore'

import { usePrescriptions, useRequestRefills } from 'api/prescriptions'
import { PrescriptionsList, RefillRequestSummaryItems } from 'api/types'
import { AlertWithHaptics, Box, ErrorComponent, LoadingComponent, TextView } from 'components'
import SelectionList from 'components/SelectionList'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HiddenA11yElement } from 'styles/common'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  useBeforeNavBackListener,
  useDestructiveActionSheet,
  useDowntime,
  useRouteNavigation,
  useTheme,
} from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import { PrescriptionListItem } from '../PrescriptionCommon'
import NoRefills from './NoRefills'

type RefillScreenProps = StackScreenProps<HealthStackParamList, 'RefillScreenModal'>

export function RefillScreen({ navigation, route }: RefillScreenProps) {
  const { refillRequestSummaryItems } = route.params
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const submitRefillAlert = useDestructiveActionSheet()
  const confirmAlert = useDestructiveActionSheet()

  const { t } = useTranslation(NAMESPACE.COMMON)

  const [showAlert, setAlert] = useState(false)
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({})
  const [selectedPrescriptionsCount, setSelectedPrescriptionsCount] = useState(0)

  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)

  const {
    data: prescriptionData,
    isFetching: loadingHistory,
    isFetched: prescriptionsFetched,
    error: prescriptionHasError,
    refetch: refetchPrescriptions,
  } = usePrescriptions({ enabled: screenContentAllowed('WG_RefillScreenModal') })
  const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionsList>([])
  const refillablePrescriptions = filter(allPrescriptions, (prescription) => {
    return prescription.attributes.isRefillable
  })

  const { mutate: requestRefill, isPending: showLoadingScreenRequestRefills } = useRequestRefills()

  const refillable = refillablePrescriptions || []

  useEffect(() => {
    if (prescriptionsFetched && prescriptionData?.data) {
      setAllPrescriptions(prescriptionData.data)
    }
  }, [prescriptionsFetched, prescriptionData])

  useEffect(() => {
    if (refillRequestSummaryItems) {
      navigateTo('RefillRequestSummary', { refillRequestSummaryItems: refillRequestSummaryItems })
    }
  }, [navigateTo, refillRequestSummaryItems])

  const scrollViewRef = useRef<ScrollView>(null)

  useBeforeNavBackListener(navigation, (e) => {
    if (selectedPrescriptionsCount === 0) {
      return
    }
    e.preventDefault()
    confirmAlert({
      title: t('prescriptions.refillRequest.cancelMessage'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('prescriptions.refillRequest.continueRequest'),
        },
        {
          text: t('cancelRequest'),
          onPress: () => {
            navigation.dispatch(e.data.action)
          },
        },
      ],
    })
  })

  const onSubmitPressed = () => {
    const prescriptionList: PrescriptionsList = []
    Object.values(selectedValues).forEach((isSelected, index) => {
      if (isSelected) {
        prescriptionList.push(refillable[index])
      }
    })
    const prescriptionIds = prescriptionList.map((prescription) => prescription.id)
    logAnalyticsEvent(Events.vama_rx_request_start(prescriptionIds))
    submitRefillAlert({
      title:
        selectedPrescriptionsCount === refillablePrescriptions?.length
          ? t('prescriptions.refill.confirmationTitle.all')
          : t('prescriptions.refill.confirmationTitle', { count: selectedPrescriptionsCount }),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: t('cancel'),
          onPress: () => {
            logAnalyticsEvent(Events.vama_rx_request_cancel(prescriptionIds))
          },
        },
        {
          text:
            selectedPrescriptionsCount === refillablePrescriptions?.length
              ? t('prescriptions.refill.RequestRefillButtonTitle.all')
              : t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount }),
          onPress: () => {
            logAnalyticsEvent(Events.vama_rx_request_confirm(prescriptionIds))
            const mutateOptions: MutateOptions<RefillRequestSummaryItems, Error, PrescriptionsList, void> = {
              onSettled(data) {
                if (data) {
                  navigateTo('RefillRequestSummary', { refillRequestSummaryItems: data })
                }
              },
            }
            requestRefill(prescriptionList, mutateOptions)
          },
        },
      ],
    })
  }

  const getListItems = () => {
    const total = refillablePrescriptions?.length
    const listItems: Array<SelectionListItemObj> = refillable.map((prescription, idx) => {
      const orderIdentifier = t('prescription.history.orderIdentifier', { idx: idx + 1, total: total }) + '.' // Period to ensure pause w/ screen reader
      return {
        content: (
          <>
            <HiddenA11yElement accessibilityLabel={orderIdentifier}>{orderIdentifier}</HiddenA11yElement>
            <PrescriptionListItem prescription={prescription.attributes} hideInstructions={true} />
          </>
        ),
      }
    })

    return listItems
  }

  const hidePrimaryButton =
    prescriptionInDowntime || refillable.length === 0 || loadingHistory || showLoadingScreenRequestRefills
  const primaryButtonText =
    selectedPrescriptionsCount === refillablePrescriptions?.length
      ? t('prescriptions.refill.RequestRefillButtonTitle.all')
      : t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount })

  return (
    <FullScreenSubtask
      leftButtonText={t('cancel')}
      onLeftButtonPress={navigation.goBack}
      title={t('refillRequest')}
      primaryContentButtonText={hidePrimaryButton ? '' : primaryButtonText}
      primaryButtonTestID="requestRefillsButtonID"
      scrollViewRef={scrollViewRef}
      onPrimaryContentButtonPress={() => {
        if (selectedPrescriptionsCount === 0) {
          setAlert(true)
          return
        }
        onSubmitPressed()
      }}>
      {loadingHistory ? (
        <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
      ) : showLoadingScreenRequestRefills ? (
        <LoadingComponent text={t('prescriptions.refill.send', { count: selectedPrescriptionsCount })} />
      ) : prescriptionInDowntime || prescriptionHasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PRESCRIPTION_REFILL_SCREEN_ID}
          error={prescriptionHasError}
          onTryAgain={refetchPrescriptions}
        />
      ) : refillable.length === 0 ? (
        <NoRefills />
      ) : (
        <>
          {showAlert && (
            <Box mb={theme.dimensions.standardMarginBetween}>
              <AlertWithHaptics
                variant="error"
                description={t('prescriptions.refill.pleaseSelect')}
                scrollViewRef={scrollViewRef}
              />
            </Box>
          )}
          <Box mx={theme.dimensions.gutter}>
            <TextView paragraphSpacing={true} variant={'HelperText'}>
              {t('prescriptions.refill.instructions.requestRefills')}
              <TextView variant={'HelperTextBold'}>
                {t('prescriptions.refill.instructions.fifteenDays')}
                <TextView variant={'HelperText'}>{t('prescriptions.refill.instructions.beforeYouNeed')}</TextView>
              </TextView>
            </TextView>
            <TextView variant={'HelperText'} mb={theme.dimensions.standardMarginBetween}>
              {t('prescriptions.refill.weWillMailText')}
            </TextView>
            <TextView
              mt={theme.dimensions.condensedMarginBetween}
              mb={theme.dimensions.condensedMarginBetween}
              variant={'MobileBodyBold'}
              accessibilityRole="header">
              {t('prescriptions.refill.prescriptionsCount', { count: refillablePrescriptions?.length })}
            </TextView>
          </Box>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <SelectionList
              items={getListItems()}
              onSelectionChange={(items) => {
                const newSelectedCount = Object.values(items).reduce((acc, item) => (item === true ? ++acc : acc), 0)
                // only update if the count changes
                if (selectedPrescriptionsCount !== newSelectedCount) {
                  setAlert(false)
                  setSelectedPrescriptionsCount(newSelectedCount)
                  setSelectedValues(items)
                }
              }}
            />
          </Box>
        </>
      )}
    </FullScreenSubtask>
  )
}

export default RefillScreen
