import { ReactNode, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ErrorComponent, List, ListItemObj, LoadingComponent, Pagination, PaginationProps, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionState, getPrescriptions } from 'store/slices/prescriptionSlice'
import { RefillTag } from '../PrescriptionCommon'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StyleProp, ViewStyle } from 'react-native'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'

const PrescriptionHistory: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { prescriptions, loading, prescriptionPagination } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const requestPage = useCallback(
    (requestedPage: number) => {
      dispatch(getPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID, requestedPage))
    },
    [dispatch],
  )

  useEffect(() => {
    requestPage(1)
  }, [requestPage])

  if (useError(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('prescriptions.loading')} />
  }

  const getListItemsForPrescriptions = () => {
    const listItems: Array<ListItemObj> = (prescriptions || []).map((prescription) => {
      return {
        onPress: navigateTo('PrescriptionDetails', { prescriptionId: prescription.id }),
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

  const renderPagination = (): ReactNode => {
    const page = prescriptionPagination?.currentPage || 1
    const paginationProps: PaginationProps = {
      onNext: () => {
        requestPage(page + 1)
      },
      onPrev: () => {
        requestPage(page - 1)
      },
      totalEntries: prescriptionPagination?.totalEntries || 0,
      pageSize: prescriptionPagination?.perPage || 0,
      page,
    }

    return <Pagination {...paginationProps} />
  }

  return (
    <Box mt={theme.dimensions.contentMarginTop} display={'flex'} flexDirection={'column'} flex={1}>
      <Box mx={theme.dimensions.gutter}>
        <TextView variant={'HelperText'}>{t('prescriptions.header.helper')}</TextView>
        <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
          {t('prescription.history.list.title', { count: prescriptionPagination.totalEntries })}
        </TextView>
      </Box>
      <VAScrollView contentContainerStyle={mainViewStyle}>
        <Box mb={theme.dimensions.contentMarginBottom}>
          <List items={getListItemsForPrescriptions()} />
          <Box mt={theme.dimensions.paginationTopPadding} mx={theme.dimensions.gutter}>
            {renderPagination()}
          </Box>
        </Box>
      </VAScrollView>
    </Box>
  )
}

export default PrescriptionHistory
