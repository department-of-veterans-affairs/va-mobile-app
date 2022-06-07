import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, List, ListItemObj, LoadingComponent, Pagination, PaginationProps, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getPrescriptions } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { StyleProp, ViewStyle } from 'react-native'
import { useAppDispatch, useTheme } from 'utils/hooks'
import RefillTag from './RefillTag'

const PrescriptionHistory: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { prescriptions, loading } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)

  useEffect(() => {
    dispatch(getPrescriptions())
  }, [dispatch])

  if (loading) {
    return <LoadingComponent text={t('prescriptions.loading')} />
  }

  const getListItemsForPrescriptions = () => {
    const listItems: Array<ListItemObj> = (prescriptions || []).map((prescription) => {
      return {
        onPress: () => {},
        content: (
          <Box flex={1}>
            <Box borderBottomWidth={1} borderBottomColor={'prescriptionDivider'}>
              <RefillTag status={prescription.attributes.refillStatus} />
              <TextView mt={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
                {prescription.attributes.prescriptionName}
              </TextView>
              <TextView my={theme.dimensions.condensedMarginBetween}>{prescription.attributes.instructions}</TextView>
            </Box>
            <TextView mt={theme.dimensions.condensedMarginBetween}>
              {t('prescription.history.refill')} <TextView variant={'MobileBodyBold'}>{prescription.attributes.refillRemaining}</TextView>
            </TextView>
            <TextView mt={theme.dimensions.condensedMarginBetween}>
              {t('prescription.history.facility')} <TextView variant={'MobileBodyBold'}>{prescription.attributes.facilityName}</TextView>
            </TextView>
            <TextView mt={theme.dimensions.condensedMarginBetween}>
              {t('prescription.history.prescriptionNumber')} <TextView variant={'MobileBodyBold'}>{prescription.attributes.prescriptionNumber}</TextView>
            </TextView>
          </Box>
        ),
      }
    })

    return listItems
  }

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

  const paginationProps: PaginationProps = {
    onNext: () => {},
    onPrev: () => {},
    totalEntries: 7,
    pageSize: 5,
    page: 1,
  }

  return (
    <Box mt={theme.dimensions.contentMarginTop} display={'flex'} flexDirection={'column'} flex={1}>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant={'HelperText'}>{t('prescriptions.header.helper')}</TextView>
        <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
          {t('prescription.history.list.title', { count: prescriptions?.length })}
        </TextView>
      </Box>
      <VAScrollView contentContainerStyle={mainViewStyle}>
        <Box mb={theme.dimensions.contentMarginBottom}>
          <List items={getListItemsForPrescriptions()} />
          <Box mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
            <Pagination {...paginationProps} />
          </Box>
        </Box>
      </VAScrollView>
    </Box>
  )
}

export default PrescriptionHistory
