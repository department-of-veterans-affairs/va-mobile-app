import { ReactNode, useCallback, useEffect, useState } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { find } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import {
  Box,
  BoxProps,
  ErrorComponent,
  LoadingComponent,
  MultiTouchCard,
  MultiTouchCardProps,
  Pagination,
  PaginationProps,
  TabBar,
  TabBarProps,
  TabsValuesType,
  TextView,
  VAIcon,
  VAScrollView,
} from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionHistoryTabConstants, PrescriptionSortOptionConstants, PrescriptionSortOptions, RefillStatus, RefillStatusConstants } from 'store/api/types'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, getPrescriptions, getTabCounts } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getFilterArgsForFilterAndTab, getTagColorForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'

const sortByOptions = [
  { display: 'prescriptions.sort.facility', value: PrescriptionSortOptionConstants.FACILITY_NAME },
  { display: 'prescriptions.sort.fillDate', value: PrescriptionSortOptionConstants.REFILL_DATE },
  { display: 'prescriptions.sort.medication', value: PrescriptionSortOptionConstants.PRESCRIPTION_NAME },
  { display: 'prescriptions.sort.refills', value: PrescriptionSortOptionConstants.REFILL_REMAINING },
]

const sortOrderOptions = [
  { display: 'prescriptions.sort.atoz', value: '' },
  { display: 'prescriptions.sort.ztoa', value: '-' },
]

const filterOptions = {
  all: [
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
  ],
  processing: [
    {
      display: 'prescription.filter.all',
      value: '',
    },
    {
      display: 'prescription.history.tag.active.inProgress',
      value: RefillStatusConstants.REFILL_IN_PROCESS,
    },
    {
      display: 'prescription.history.tag.active.submitted',
      value: RefillStatusConstants.SUBMITTED,
    },
  ],
}

const PrescriptionHistory: FC = ({}) => {
  const dispatch = useAppDispatch()
  const { prescriptions, loadingHistory, prescriptionPagination, tabCounts } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const [selectedFilter, setSelectedFilter] = useState<RefillStatus | ''>('')
  const [selectedSortBy, setSelectedSortBy] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [selectedSortOn, setSelectedSortOn] = useState('')

  const [filterToUse, setFilterToUse] = useState<RefillStatus | ''>('')
  const [sortByToUse, setSortByToUse] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [sortOnToUse, setSortOnToUse] = useState('')

  const [currentTab, setCurrentTab] = useState<string>(PrescriptionHistoryTabConstants.ALL)

  const requestPage = useCallback(
    (requestedPage: number) => {
      const filter = getFilterArgsForFilterAndTab(filterToUse, currentTab)
      const sort = sortByToUse ? `${sortOnToUse}${sortByToUse}` : ''
      const trackableOnly = currentTab === PrescriptionHistoryTabConstants.SHIPPED

      dispatch(getPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID, requestedPage, filter, sort, trackableOnly))
    },
    [dispatch, filterToUse, sortOnToUse, sortByToUse, currentTab],
  )

  useEffect(() => {
    dispatch(getTabCounts())
  }, [dispatch])

  useEffect(() => {
    requestPage(1)
  }, [requestPage])

  if (useError(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID} />
  }

  if (loadingHistory) {
    return <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
  }

  const tabs: TabsValuesType = [
    {
      value: PrescriptionHistoryTabConstants.ALL,
      title: t('prescriptions.tabs.all', { count: tabCounts[PrescriptionHistoryTabConstants.ALL] }),
    },
    {
      value: PrescriptionHistoryTabConstants.PROCESSING,
      title: t('prescriptions.tabs.processing', { count: tabCounts[PrescriptionHistoryTabConstants.PROCESSING] }),
    },
    {
      value: PrescriptionHistoryTabConstants.SHIPPED,
      title: t('prescriptions.tabs.shipped', { count: tabCounts[PrescriptionHistoryTabConstants.SHIPPED] }),
    },
  ]

  const onTabChange = (newTab: string) => {
    setFilterToUse('')
    setCurrentTab(newTab)
  }

  const tabProps: TabBarProps = {
    tabs,
    onChange: onTabChange,
    selected: currentTab,
  }

  const prescriptionItems = () => {
    const total = prescriptions?.length

    const listItems: Array<ReactNode> = (prescriptions || []).map((prescription, idx) => {
      const refillStatus = prescription.attributes.refillStatus

      let cardProps: MultiTouchCardProps = {
        topOnPress: () => {},
        topText: getTextForRefillStatus(refillStatus, t),
        topBackgroundColor: getTagColorForStatus(refillStatus),
        topTextColor: 'statusDescription',
        topIconColor: 'statusInfoIcon',
        a11yValue: t('prescription.history.a11yValue', { idx: idx + 1, total: total }),
        topA11yHint: t('prescription.history.a11yHint.top'),
        middleOnPress: navigateTo('PrescriptionDetails', { prescriptionId: prescription.id }),
        middleA11yHint: t('prescription.history.a11yHint.middle'),
        middleContent: <PrescriptionListItem prescription={prescription.attributes} />,
        bottomOnPress: () => {},
      }

      if (prescription.attributes.isRefillable) {
        const bottomContentProps: BoxProps = {
          py: 5,
          flexDirection: 'row',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }

        const bottomContent = (
          <Box {...bottomContentProps}>
            <Box mr={8}>
              <VAIcon name={'Truck'} fill={'link'} />
            </Box>
            <TextView variant={'HelperTextBold'} color={'link'}>
              {t('prescription.history.tracking')}
            </TextView>
          </Box>
        )

        cardProps = { ...cardProps, bottomContent }
      }

      return (
        <Box mt={theme.dimensions.standardMarginBetween} key={idx}>
          <MultiTouchCard {...cardProps} />
        </Box>
      )
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
          setSelectedSortBy(newSortBy as PrescriptionSortOptions | '')
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
    buttonA11yHint: t('prescription.filter.sort.a11y'),
    headerText: t('prescription.filter.sort'),
    topRightButtonText: tc('reset'),
    topRightButtonA11yHint: t('prescription.filter.sort.reset.a11y'),
    onConfirm: () => {
      setSortOnToUse(selectedSortOn)
      setSortByToUse(selectedSortBy)
    },
    onUpperRightAction: () => {
      setSelectedSortBy('')
      setSelectedSortOn('')
    },
    onCancel: () => {
      setSelectedSortBy(sortByToUse)
      setSelectedSortOn(sortOnToUse)
    },
  }

  const filterOptionsForTab = currentTab === PrescriptionHistoryTabConstants.PROCESSING ? filterOptions.processing : filterOptions.all

  const filterRadioOptions = filterOptionsForTab.map((option) => {
    return {
      value: option.value,
      labelKey: getTranslation(option.display, t),
    }
  })

  const filterButtonText = `${t('prescription.filter.by')}: ${getDisplayForValue(filterOptionsForTab, filterToUse)}`

  const filterProps: RadioGroupModalProps = {
    groups: [
      {
        items: filterRadioOptions,
        onSetOption: (newFilter: string) => {
          setSelectedFilter(newFilter as RefillStatus | '')
        },
        selectedValue: selectedFilter,
      },
    ],
    buttonText: filterButtonText,
    buttonA11yHint: t('prescription.filter.by.a11y'),
    headerText: t('prescription.filter.status'),
    topRightButtonText: tc('reset'),
    topRightButtonA11yHint: t('prescription.filter.by.reset.a11y'),
    onConfirm: () => {
      setFilterToUse(selectedFilter)
    },
    onUpperRightAction: () => {
      setSelectedFilter('')
    },
    onCancel: () => {
      setSelectedFilter(filterToUse)
    },
  }

  const filterContainerProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    pt: 16,
    pb: 6,
    px: 20,
  }

  const filterWrapperProps: BoxProps = {
    borderBottomWidth: 1,
    borderColor: 'primary',
  }

  const hasNoItems = prescriptions?.length === 0

  const noMatchScrollStyles: ViewStyle = {
    flexGrow: 1,
    justifyContent: 'center',
  }

  const noMatchDisplayEl = (
    <VAScrollView contentContainerStyle={noMatchScrollStyles}>
      <Box justifyContent="center" mx={theme.dimensions.gutter} mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} alignItems={'center'}>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          <TextView textAlign={'center'} variant="MobileBodyBold">
            {t('prescription.history.empty.title')}
          </TextView>
          <TextView textAlign={'center'} variant="MobileBody">
            {t('prescription.history.empty.message')}
          </TextView>
        </Box>
      </Box>
    </VAScrollView>
  )

  const getContent = () => {
    if (hasNoItems) {
      return noMatchDisplayEl
    } else {
      return (
        <>
          <Box mx={theme.dimensions.gutter} pt={theme.dimensions.contentMarginTop}>
            <TextView variant={'HelperText'}>{t('prescriptions.header.helper')}</TextView>
            <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
              {t('prescription.history.list.title', { count: prescriptionPagination.totalEntries })}
            </TextView>
          </Box>
          <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
            {/*<List items={getListItemsForPrescriptions()} />*/}
            {prescriptionItems()}
            <Box mt={theme.dimensions.paginationTopPadding}>{renderPagination()}</Box>
          </Box>
        </>
      )
    }
  }

  return (
    <Box display={'flex'} flexDirection={'column'} flex={1} backgroundColor={'main'}>
      <VAScrollView contentContainerStyle={mainViewStyle}>
        <TabBar {...tabProps} />
        <Box {...filterWrapperProps}>
          <Box {...filterContainerProps}>
            <Box mr={8} mb={10}>
              <RadioGroupModal {...filterProps} />
            </Box>
            <Box mb={10}>
              <RadioGroupModal {...sortProps} />
            </Box>
          </Box>
        </Box>
        {getContent()}
      </VAScrollView>
    </Box>
  )
}

export default PrescriptionHistory
