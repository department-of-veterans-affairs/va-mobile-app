import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, LoadingComponent, TextView } from 'components'
import { DowntimeFeatureTypeConstants, PrescriptionsList, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, dispatchClearLoadingRequestRefills, dispatchSetPrescriptionsNeedLoad, loadAllPrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import { useAppDispatch, useBeforeNavBackListener, useDestructiveAlert, useDowntime, usePrevious, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'
import FullScreenSubtask from 'components/Templates/FullScreenSubtask'
import NoRefills from './NoRefills'
import SelectionList from 'components/SelectionList'

type RefillScreenProps = StackScreenProps<HealthStackParamList, 'RefillScreenModal'>

export const RefillScreen: FC<RefillScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const submitRefillAlert = useDestructiveAlert()

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const [showAlert, setAlert] = useState(false)
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({})
  const [selectedPrescriptionsCount, setSelectedPrescriptionsCount] = useState(0)

  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)

  const { loadingHistory, refillablePrescriptions, showLoadingScreenRequestRefills, submittingRequestRefills } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const refillable = refillablePrescriptions || []
  const prevLoadingRequestRefills = usePrevious<boolean>(submittingRequestRefills)

  // useFocusEffect, ensures we only call loadAllPrescriptions if needed when this component is being shown
  useFocusEffect(
    React.useCallback(() => {
      if (!prescriptionInDowntime) {
        dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_REFILL_SCREEN_ID))
      }
    }, [dispatch, prescriptionInDowntime]),
  )

  useEffect(() => {
    if (prevLoadingRequestRefills && prevLoadingRequestRefills !== submittingRequestRefills) {
      navigation.navigate('RefillRequestSummary')
    }
  }, [navigation, submittingRequestRefills, prevLoadingRequestRefills])

  useBeforeNavBackListener(navigation, () => {
    dispatch(dispatchSetPrescriptionsNeedLoad())
    dispatch(dispatchClearLoadingRequestRefills())
  })

  const onSubmitPressed = () => {
    submitRefillAlert({
      title: t('prescriptions.refill.confirmationTitle', { count: selectedPrescriptionsCount }),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: tc('cancel'),
        },
        {
          text: t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount }),
          onPress: () => {
            const prescriptionsToRefill: PrescriptionsList = []
            // todo add params
            Object.values(selectedValues).forEach((isSelected, index) => {
              if (isSelected) {
                prescriptionsToRefill.push(refillable[index])
              }
            })

            dispatch(requestRefills(prescriptionsToRefill))
          },
        },
      ],
    })
  }

  const getListItems = () => {
    const listItems: Array<SelectionListItemObj> = refillable.map((prescription) => {
      return {
        content: <PrescriptionListItem prescription={prescription.attributes} hideInstructions={true} hideFillDate={true} />,
      }
    })

    return listItems
  }

  if (prescriptionInDowntime) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_REFILL_SCREEN_ID} />
  }

  if (refillable.length === 0) {
    return <NoRefills />
  }

  if (loadingHistory) {
    return <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
  }

  if (showLoadingScreenRequestRefills) {
    return <LoadingComponent text={t('prescriptions.refill.submit')} />
  }

  return (
    <>
      <FullScreenSubtask
        leftButtonText={tc('cancel')}
        title={t('prescriptions.refill.pageHeaderTitle')}
        primaryContentButtonText={t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount })}
        onPrimaryContentButtonPress={() => {
          if (selectedPrescriptionsCount === 0) {
            setAlert(true)
            return
          }
          onSubmitPressed()
        }}>
        {showAlert && (
          <Box mx={theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
            <AlertBox border="error" title={t('prescriptions.refill.pleaseSelect')} />
          </Box>
        )}
        <Box mx={theme.dimensions.gutter}>
          <TextView my={theme.dimensions.standardMarginBetween} variant={'HelperText'}>
            {t('prescriptions.refill.instructions.requestRefills')}
            <TextView variant={'HelperTextBold'}>
              {t('prescriptions.refill.instructions.fifteenDays')}
              <TextView variant={'HelperText'}>{t('prescriptions.refill.instructions.beforeYouNeed')}</TextView>
            </TextView>
          </TextView>
          <TextView variant={'HelperText'} mb={theme.dimensions.standardMarginBetween}>
            {t('prescriptions.refill.weWillMailText')}
          </TextView>
          <TextView mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
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
      </FullScreenSubtask>
    </>
  )
}

export default RefillScreen
