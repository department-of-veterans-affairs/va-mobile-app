import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { AlertBox, Box, ClosePanelButton, ErrorComponent, FooterButton, LoadingComponent, TextView, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, PrescriptionsList, ScreenIDTypesConstants } from 'store/api/types'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, dispatchClearLoadingRequestRefills, dispatchSetPrescriptionsNeedLoad, loadAllPrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import { isIOS } from 'utils/platform'
import { useAppDispatch, useDestructiveAlert, useDowntime, usePanelHeaderStyles, usePrevious, useTheme } from 'utils/hooks'
import { useFocusEffect } from '@react-navigation/native'
import NoRefills from './NoRefills'
import RefillRequestSummary from './RefillRequestSummary'
import SelectionList from 'components/SelectionList'
import { HiddenA11yElement } from 'styles/common'

type RefillScreenProps = StackScreenProps<RefillStackParamList, 'RefillScreen'>

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
    const total = refillablePrescriptions?.length
    const listItems: Array<SelectionListItemObj> = refillable.map((prescription, idx) => {
      const orderIdentifier = t('prescription.history.orderIdentifier', { idx: idx + 1, total: total })
      return {
        content: (
          <>
            {orderIdentifier && <HiddenA11yElement accessibilityLabel={orderIdentifier}>{orderIdentifier}</HiddenA11yElement>}
            <PrescriptionListItem prescription={prescription.attributes} hideInstructions={true} hideFillDate={true} />
          </>
        ),
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
      <VAScrollView>
        {showAlert && (
          <Box mt={theme.dimensions.standardMarginBetween}>
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
      </VAScrollView>
      <FooterButton
        text={t('prescriptions.refill.RequestRefillButtonTitle', { count: selectedPrescriptionsCount })}
        backGroundColor="buttonPrimary"
        textColor={'navBar'}
        onPress={() => {
          if (selectedPrescriptionsCount === 0) {
            setAlert(true)
            return
          }
          onSubmitPressed()
        }}
      />
    </>
  )
}

type RefillStackScreenProps = StackScreenProps<HealthStackParamList, 'RefillScreenModal'>

export type RefillStackParamList = {
  RefillScreen: undefined
  RefillRequestSummary: undefined
}

const RefillScreenStack = createStackNavigator<RefillStackParamList>()

const RefillStackScreen: FC<RefillStackScreenProps> = () => {
  const headerStyle = usePanelHeaderStyles()

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const dispatch = useDispatch()
  return (
    <RefillScreenStack.Navigator
      initialRouteName="RefillScreen"
      screenOptions={{
        title: t('prescriptions.refill.pageHeaderTitle'),
        ...TransitionPresets.SlideFromRightIOS,
        ...headerStyle,
        headerLeft: (props) => (
          <ClosePanelButton
            buttonText={tc('cancel')}
            onPress={props.onPress}
            buttonTextColor={'showAll'}
            focusOnButton={isIOS() ? false : true} // this is done due to ios not reading the button name on modal
          />
        ),
      }}>
      <RefillScreenStack.Screen
        name="RefillScreen"
        component={RefillScreen}
        listeners={{
          beforeRemove: () => {
            dispatch(dispatchSetPrescriptionsNeedLoad())
            dispatch(dispatchClearLoadingRequestRefills())
          },
        }}
      />
      <RefillScreenStack.Screen key={'RefillRequestSummary'} name="RefillRequestSummary" component={RefillRequestSummary} />
    </RefillScreenStack.Navigator>
  )
}

export default RefillStackScreen
