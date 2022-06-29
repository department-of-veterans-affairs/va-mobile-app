import { ReactNode, useCallback, useEffect, useState } from 'react'
import { find } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, ErrorComponent, List, ListItemObj, LoadingComponent, Pagination, PaginationProps, TextView, VAScrollView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, getPrescriptions } from 'store/slices/prescriptionSlice'
import { RefillStatusConstants } from 'store/api/types'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { StyleProp, ViewStyle } from 'react-native'
import { getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'

const sortByOptions = [
  { display: 'prescriptions.sort.facility', value: 'facilityName' },
  { display: 'prescriptions.sort.fillDate', value: 'refillDate' },
  { display: 'prescriptions.sort.medication', value: 'prescriptionName' },
  { display: 'prescriptions.sort.refills', value: 'refillRemaining' },
]

const sortOrderOptions = [
  { display: 'prescriptions.sort.atoz', value: 'asc' },
  { display: 'prescriptions.sort.ztoa', value: 'desc' },
]

const filterOptions = [
  {
    display: 'prescription.filter.all',
    value: '',
  },
  {
    display: 'prescription.history.tag.active',
    value: RefillStatusConstants.ACTIVE,
  },
  {
    display: 'prescription.history.tag.active.hold',
    value: RefillStatusConstants.HOLD,
  },
  {
    display: 'prescription.history.tag.active.parked',
    value: RefillStatusConstants.ACTIVE_PARKED,
  },
  {
    display: 'prescription.history.tag.active.inProgress',
    value: RefillStatusConstants.REFILL_IN_PROCESS,
  },
  {
    display: 'prescription.history.tag.active.submitted',
    value: RefillStatusConstants.SUBMITTED,
  },
  {
    display: 'prescription.history.tag.active.suspended',
    value: RefillStatusConstants.SUSPENDED,
  },
  {
    display: 'prescription.history.tag.discontinued',
    value: RefillStatusConstants.DISCONTINUED,
  },
  {
    display: 'prescription.history.tag.expired',
    value: RefillStatusConstants.EXPIRED,
  },
  {
    display: 'prescription.history.tag.nonVerified',
    value: RefillStatusConstants.NON_VERIFIED,
  },
  {
    display: 'prescription.history.tag.transferred',
    value: RefillStatusConstants.TRANSFERRED,
  },
  {
    display: 'prescription.history.tag.unknown',
    value: RefillStatusConstants.UNKNOWN,
  },
]

const PrescriptionHistory: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { prescriptions, loadingHisory, prescriptionPagination } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const navigateTo = useRouteNavigation()

  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedSortBy, setSelectedSortBy] = useState('')
  const [selectedSortOn, setSelectedSortOn] = useState('')

  const [filterToUse, setFilterToUse] = useState('')
  const [sortByToUse, setSortByToUse] = useState('')
  const [sortOnToUse, setSortOnToUse] = useState('')

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

  if (loadingHisory) {
    return <LoadingComponent text={t('prescriptions.loading')} />
  }

  const getListItemsForPrescriptions = () => {
    const listItems: Array<ListItemObj> = (prescriptions || []).map((prescription) => {
      return {
        onPress: navigateTo('PrescriptionDetails', { prescriptionId: prescription.id }),
        content: <PrescriptionListItem prescription={prescription.attributes} />,
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

  const getDisplayForValue = (options: { display: string; value: string }[], val: string) => {
    const display = find(options, (f) => {
      return f.value === val
    })

    return getTranslation(display?.display || '', t)
  }

  const sortByRadioOptions = sortByOptions.map((option) => {
    return {
      value: option.value,
      labelKey: getTranslation(option.display, t),
    }
  })

  const sortOrderRadioOptions = sortOrderOptions.map((option) => {
    return {
      value: option.value,
      labelKey: getTranslation(option.display, t),
    }
  })

  const sortProps: RadioGroupModalProps = {
    groups: [
      {
        items: sortByRadioOptions,
        onSetOption: (newSortBy: string) => {
          setSelectedSortBy(newSortBy)
        },
        selectedValue: selectedSortBy,
        title: t('prescriptions.sort.by'),
      },
      {
        items: sortOrderRadioOptions,
        onSetOption: (newSortOn: string) => {
          setSelectedSortOn(newSortOn)
        },
        selectedValue: selectedSortOn,
        title: t('prescriptions.sort.order'),
      },
    ],
    buttonText: `${t('prescriptions.sort.by')}: ${getDisplayForValue(sortByOptions, sortByToUse)}`,
    headerText: t('prescription.filter.sort'),
    onConfirm: () => {
      setSortOnToUse(selectedSortOn)
      setSortByToUse(selectedSortBy)
    },
    onReset: () => {},
    onCancel: () => {
      setSelectedSortBy(sortByToUse)
      setSelectedSortOn(sortOnToUse)
    },
  }

  const filterRadioOptions = filterOptions.map((option) => {
    return {
      value: option.value,
      labelKey: getTranslation(option.display, t),
    }
  })

  const filterButtonText = `${t('prescription.filter.by')}: ${getDisplayForValue(filterOptions, filterToUse)}`

  const filterProps: RadioGroupModalProps = {
    groups: [
      {
        items: filterRadioOptions,
        onSetOption: (newFilter: string) => {
          setSelectedFilter(newFilter)
        },
        selectedValue: selectedFilter,
      },
    ],
    buttonText: filterButtonText,
    headerText: t('prescription.filter.status'),
    onConfirm: () => {
      setFilterToUse(selectedFilter)
    },
    onReset: () => {},
    onCancel: () => {
      setSelectedFilter(filterToUse)
    },
  }

  return (
    <Box pt={theme.dimensions.contentMarginTop} display={'flex'} flexDirection={'column'} flex={1} backgroundColor={'main'}>
      <Box mx={theme.dimensions.gutter}>
        <Box>
          <RadioGroupModal {...filterProps} />
          <RadioGroupModal {...sortProps} />
        </Box>
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
