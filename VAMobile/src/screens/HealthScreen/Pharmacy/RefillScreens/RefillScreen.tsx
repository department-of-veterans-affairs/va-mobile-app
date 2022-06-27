import { StackScreenProps } from '@react-navigation/stack'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, FooterButton, LoadingComponent, TabsControl, TabsValuesType, TextView, VAScrollView } from 'components'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, getRefillablePrescriptions, requestRefills } from 'store/slices/prescriptionSlice'
import { PrescriptionsList, ScreenIDTypesConstants } from 'store/api/types'
import { RootState } from 'store'
import { SelectionListItemObj } from 'components/SelectionList/SelectionListItem'
import { useAppDispatch, useDestructiveAlert, useModalHeaderStyles, useTheme } from 'utils/hooks'
import SelectionList from 'components/SelectionList'

type RefillcreenProps = StackScreenProps<HealthStackParamList, 'RefillScreen'>

const RefillScreen: FC<RefillcreenProps> = ({ navigation }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const submitRefillAlert = useDestructiveAlert()
  const headerStyle = useModalHeaderStyles()

  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)

  const [selecteTab, setSelectedTab] = useState(0)
  const [selectedValues, setSelectedValues] = useState<Record<string, boolean>>({})
  const [totalPrescriptionsToRefill, setTotalPrescriptionsToRefill] = useState(0)

  const { loadingRefillable, loadingRequestRefills, refillableCount, nonRefillableCount, refillablePrescriptions, needsRefillableLoaded, submittedRequestRefillCount } =
    useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const refillable = refillablePrescriptions || []

  const tabs: TabsValuesType = [
    {
      title: t('prescriptions.refill.refillableTabText', { count: refillableCount }),
      value: t('prescriptions.refill.refillableTabValue'),
    },
    {
      title: t('prescriptions.refill.noRrefillableTabText', { count: nonRefillableCount }),
      value: t('prescriptions.refill.noRrefillableTabValue'),
    },
  ]

  useEffect(() => {
    navigation.setOptions({
      ...headerStyle,
    })
  }, [navigation, headerStyle])

  useEffect(() => {
    if (needsRefillableLoaded) {
      dispatch(getRefillablePrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
    }
  }, [dispatch, needsRefillableLoaded])

  if (loadingRefillable) {
    return <LoadingComponent text={t('prescriptions.loading')} />
  }

  const onSubmitPressed = () => {
    submitRefillAlert({
      title: t('prescriptions.refill.confirmationTitle', { plural: getSelectedPrescriptionsCount() > 1 ? 's' : '' }),
      cancelButtonIndex: 0,
      buttons: [
        {
          text: tc('cancel'),
        },
        {
          text: t('prescriptions.refill.RequestRefillButtonTitle', { plural: '' }),
          onPress: () => {
            const prescriptionsToRefill: PrescriptionsList = []
            // todo add params
            Object.values(selectedValues).forEach((isSelected, index) => {
              if (isSelected) {
                prescriptionsToRefill.push(refillable[index])
              }
            })

            setTotalPrescriptionsToRefill(prescriptionsToRefill.length)
            dispatch(requestRefills(prescriptionsToRefill))
          },
        },
      ],
    })
  }

  const getSelectedPrescriptionsCount = () => {
    return Object.values(selectedValues).reduce((acc, item) => (item === true ? ++acc : acc), 0)
  }

  const getListItems = () => {
    const listItems: Array<SelectionListItemObj> = refillable.map((prescription) => {
      return {
        content: <PrescriptionListItem prescription={prescription.attributes} showTag={false} />,
      }
    })

    return listItems
  }

  if (loadingRequestRefills) {
    // TODO update count to be the count actually submitted not selected
    return <LoadingComponent text={t('prescriptions.refill.submit', { count: submittedRequestRefillCount, total: totalPrescriptionsToRefill })} />
  }

  return (
    <>
      <VAScrollView>
        <TabsControl onChange={setSelectedTab} tabs={tabs} selected={selecteTab} />

        <TextView mt={theme.dimensions.standardMarginBetween} mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
          {t('prescriptions.refill.weWillMailText')}
        </TextView>
        <Box mb={theme.dimensions.contentMarginBottom}>
          <SelectionList items={getListItems()} onSelectionChange={setSelectedValues} />
        </Box>
      </VAScrollView>
      <FooterButton
        text={t('prescriptions.refill.RequestRefillButtonTitle', { plural: getSelectedPrescriptionsCount() > 1 ? 's' : '' })}
        backGroundColor="buttonPrimary"
        textColor={'navBar'}
        onPress={onSubmitPressed}
      />
    </>
  )
}

export default RefillScreen
