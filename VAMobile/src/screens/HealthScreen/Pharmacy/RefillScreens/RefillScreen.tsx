import { StackScreenProps, TransitionPresets, createStackNavigator } from '@react-navigation/stack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useLayoutEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FooterButton, LoadingComponent, TextView, VAScrollView } from 'components'
import { DowntimeFeatureTypeConstants, PrescriptionsList, ScreenIDTypesConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, dispatchClearLoadingRequestRefills, getRefillablePrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import { useAppDispatch, useDestructiveAlert, useDowntime, useModalHeaderStyles, usePrevious, useTheme } from 'utils/hooks'
import NoRefills from './NoRefills'
import RefillRequestSummary from './RefillRequestSummary'
import SelectionList from 'components/SelectionList'

type RefillScreenProps = StackScreenProps<RefillStackParamList, 'RefillScreen'>

export const RefillScreen: FC<RefillScreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const submitRefillAlert = useDestructiveAlert()
  const headerStyle = useModalHeaderStyles()

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const [showAlert, setAlert] = useState(false)
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({})
  const [selectedPrescriptionsCount, setSelectedPrescriptionsCount] = useState(0)

  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)

  const { loadingRefillable, submittingRequestRefills, refillablePrescriptions, needsRefillableLoaded, showLoadingScreenRequestRefills, submittedRequestRefillCount } = useSelector<
    RootState,
    PrescriptionState
  >((s) => s.prescriptions)
  const refillable = refillablePrescriptions || []
  const prevLoadingRequestRefills = usePrevious<boolean>(submittingRequestRefills)

  useLayoutEffect(() => {
    navigation.setOptions({
      ...headerStyle,
    })
  }, [navigation, headerStyle])

  useEffect(() => {
    if (needsRefillableLoaded && !prescriptionInDowntime) {
      dispatch(getRefillablePrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
    }
  }, [dispatch, needsRefillableLoaded, prescriptionInDowntime])

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
          text: t('prescriptions.refill.RequestRefillButtonTitle', { count: 0 }),
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
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
  }

  if (refillable.length === 0) {
    return <NoRefills />
  }

  if (loadingRefillable) {
    return <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
  }

  if (showLoadingScreenRequestRefills) {
    return <LoadingComponent text={t('prescriptions.refill.submit', { count: submittedRequestRefillCount, total: selectedPrescriptionsCount })} />
  }

  return (
    <>
      <VAScrollView>
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

type RefillStackScreenProps = Record<string, unknown>

export type RefillStackParamList = {
  RefillScreen: undefined
  RefillRequestSummary: undefined
}

const RefillScreenStack = createStackNavigator<RefillStackParamList>()

const RefillStackScreen: FC<RefillStackScreenProps> = () => {
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const dispatch = useDispatch()
  return (
    <RefillScreenStack.Navigator initialRouteName="RefillScreen" screenOptions={{ title: t('prescriptions.refill.pageHeaderTitle'), ...TransitionPresets.SlideFromRightIOS }}>
      <RefillScreenStack.Screen
        name="RefillScreen"
        component={RefillScreen}
        listeners={{
          beforeRemove: () => {
            dispatch(dispatchClearLoadingRequestRefills())
          },
        }}
      />
      <RefillScreenStack.Screen key={'RefillRequestSummary'} name="RefillRequestSummary" component={RefillRequestSummary} />
    </RefillScreenStack.Navigator>
  )
}

export default RefillStackScreen
