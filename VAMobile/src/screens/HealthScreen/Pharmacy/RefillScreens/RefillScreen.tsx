import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { MutateOptions } from '@tanstack/react-query'
import { filter } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions, useRequestRefills } from 'api/prescriptions'
import { PrescriptionsList, RefillRequestSummaryItems } from 'api/types'
import { AlertWithHaptics, Box, ErrorComponent, LoadingComponent, TextView } from 'components'
import SelectionList from 'components/SelectionList'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { PrescriptionListItem, getMigratingPrescriptions } from 'screens/HealthScreen/Pharmacy/PrescriptionCommon'
import PrescriptionsDetailsBanner from 'screens/HealthScreen/Pharmacy/PrescriptionDetails/PrescriptionsDetailsBanner'
import NoRefills from 'screens/HealthScreen/Pharmacy/RefillScreens/NoRefills'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { HiddenA11yElement } from 'styles/common'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useBeforeNavBackListener, useDowntime, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'
import { screenContentAllowed } from 'utils/waygateConfig'

type RefillScreenProps = StackScreenProps<HealthStackParamList, 'RefillScreenModal'>

export function RefillScreen({ navigation, route }: RefillScreenProps) {
  const { refillRequestSummaryItems } = route.params
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const submitRefillAlert = useShowActionSheet()
  const confirmAlert = useShowActionSheet()

  const { t } = useTranslation(NAMESPACE.COMMON)
  const isOHCutoverFlagEnabled = featureEnabled('mhvMedicationsOracleHealthCutover')

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

  const refillable = refillablePrescriptions || []

  const {
    mutate: requestRefill,
    isPending: showLoadingScreenRequestRefills,
    isError: refillRequestHasError,
    reset: resetRefillRequest,
  } = useRequestRefills()

  const { data: userAuthorizedServices } = useAuthorizedServices()

  const migratingPrescriptions = getMigratingPrescriptions(refillable, userAuthorizedServices?.migratingFacilitiesList)
  const hasMigratingPrescriptions = migratingPrescriptions.length > 0

  // Only filter out migrating prescriptions when the cutover flag is enabled
  const migratingPrescriptionIds = new Set(migratingPrescriptions.map((p) => p.id))
  const filteredRefillable =
    isOHCutoverFlagEnabled && hasMigratingPrescriptions
      ? refillable.filter((prescription) => !migratingPrescriptionIds.has(prescription.id))
      : refillable

  // Reset selections when the filtered list changes to prevent stale index references
  const filteredRefillableIds = filteredRefillable.map((p) => p.id).join(',')
  useEffect(() => {
    setSelectedValues({})
    setSelectedPrescriptionsCount(0)
    setAlert(false)
  }, [filteredRefillableIds])

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
    const options = [t('cancelRequest'), t('prescriptions.refillRequest.continueRequest')]
    confirmAlert(
      {
        options,
        title: t('prescriptions.refillRequest.cancelMessage'),
        destructiveButtonIndex: 0,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            navigation.dispatch(e.data.action)
            break
        }
      },
    )
  })

  const onSubmitPressed = () => {
    const prescriptionList: PrescriptionsList = []
    Object.values(selectedValues).forEach((isSelected, index) => {
      if (isSelected) {
        prescriptionList.push(filteredRefillable[index])
      }
    })
    const prescriptionIds = prescriptionList.map((prescription) => prescription.id)
    logAnalyticsEvent(Events.vama_rx_request_start(prescriptionIds))

    const actionText =
      selectedPrescriptionsCount === filteredRefillable?.length
        ? t('prescriptions.refill.RequestRefillButtonTitle.all')
        : t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount })

    const options = [actionText, t('cancel')]
    submitRefillAlert(
      {
        options,
        title:
          selectedPrescriptionsCount === filteredRefillable?.length
            ? t('prescriptions.refill.confirmationTitle.all')
            : t('prescriptions.refill.confirmationTitle', { count: selectedPrescriptionsCount }),
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            logAnalyticsEvent(Events.vama_rx_request_confirm(prescriptionIds))
            const mutateOptions: MutateOptions<RefillRequestSummaryItems, Error, PrescriptionsList, void> = {
              onSettled(data) {
                if (data) {
                  navigateTo('RefillRequestSummary', { refillRequestSummaryItems: data })
                }
              },
            }
            requestRefill(prescriptionList, mutateOptions)
            break
          case 1:
            logAnalyticsEvent(Events.vama_rx_request_cancel(prescriptionIds))
            break
        }
      },
    )
  }

  const getListItems = () => {
    const total = filteredRefillable?.length
    const listItems: Array<SelectionListItemObj> = filteredRefillable.map((prescription, idx) => {
      const orderIdentifier = t('prescription.history.orderIdentifier', { idx: idx + 1, total: total }) + '.' // Period to ensure pause w/ screen reader
      return {
        content: (
          <>
            {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
            <HiddenA11yElement accessibilityLabel={orderIdentifier}>{orderIdentifier}</HiddenA11yElement>
            <PrescriptionListItem prescription={prescription.attributes} hideInstructions={true} />
          </>
        ),
      }
    })

    return listItems
  }

  const hidePrimaryButton =
    prescriptionInDowntime || filteredRefillable.length === 0 || loadingHistory || showLoadingScreenRequestRefills
  const primaryButtonText =
    selectedPrescriptionsCount === filteredRefillable?.length
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
      }}
      screenID={ScreenIDTypesConstants.PRESCRIPTION_REFILL_SCREEN_ID}>
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
      ) : (
        <>
          {hasMigratingPrescriptions && isOHCutoverFlagEnabled && (
            <PrescriptionsDetailsBanner
              migratingPrescriptions={migratingPrescriptions}
              variant="error"
              customHeaderText={t('prescription.refill.banner.migrating.header')}
              customFooterText={t('prescription.refill.banner.migrating.body')}
              showDefaultContent={false}
            />
          )}
          {filteredRefillable.length === 0 ? (
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
              {refillRequestHasError && (
                <Box mb={theme.dimensions.standardMarginBetween}>
                  <AlertWithHaptics
                    variant="error"
                    header={t('prescriptions.refill.error.title')}
                    description={t('prescriptions.refill.error.description')}
                    descriptionA11yLabel={a11yLabelVA(t('prescriptions.refill.error.description'))}
                    scrollViewRef={scrollViewRef}
                    primaryButton={{
                      label: t('dismiss'),
                      onPress: () => {
                        resetRefillRequest()
                      },
                    }}
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
                  {t('prescriptions.refill.prescriptionsCount', { count: filteredRefillable?.length })}
                </TextView>
              </Box>
              <Box mb={theme.dimensions.contentMarginBottom}>
                <SelectionList
                  items={getListItems()}
                  onSelectionChange={(items) => {
                    const newSelectedCount = Object.values(items).reduce(
                      (acc, item) => (item === true ? ++acc : acc),
                      0,
                    )
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
        </>
      )}
    </FullScreenSubtask>
  )
}

export default RefillScreen
