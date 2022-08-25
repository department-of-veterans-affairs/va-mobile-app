import { ReactNode, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StyleProp, ViewStyle } from 'react-native'
import { find } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ASCENDING, DEFAULT_PAGE_SIZE } from 'constants/common'
import { AuthorizedServicesState } from 'store/slices'
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
import {
  DowntimeFeatureTypeConstants,
  PrescriptionHistoryTabConstants,
  PrescriptionSortOptionConstants,
  PrescriptionSortOptions,
  PrescriptionsList,
  RefillStatus,
  RefillStatusConstants,
} from 'store/api/types'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, filterAndSortPrescriptions, loadAllPrescriptions } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getFilterArgsForFilter, getSortOrderOptionsForSortBy, getTagColorForStatus, getTextForRefillStatus } from 'utils/prescriptions'
import { getTranslation } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import PrescriptionHistoryNoPrescriptions from './PrescriptionHistoryNoPrescriptions'
import PrescriptionHistoryNotAuthorized from './PrescriptionHistoryNotAuthorized'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'

const pageSize = DEFAULT_PAGE_SIZE

const sortByOptions = [
  { display: 'prescriptions.sort.facility', value: PrescriptionSortOptionConstants.FACILITY_NAME },
  { display: 'prescriptions.sort.fillDate', value: PrescriptionSortOptionConstants.REFILL_DATE },
  { display: 'prescriptions.sort.medication', value: PrescriptionSortOptionConstants.PRESCRIPTION_NAME },
  { display: 'prescriptions.sort.refills', value: PrescriptionSortOptionConstants.REFILL_REMAINING },
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

type PrescriptionHistoryProps = StackScreenProps<HealthStackParamList, 'PrescriptionHistory'>

const PrescriptionHistory: FC<PrescriptionHistoryProps> = ({ route }) => {
  const dispatch = useAppDispatch()
  const { filteredPrescriptions: prescriptions, loadingHistory, tabCounts, prescriptionsNeedLoad } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const { prescriptions: prescriptionsAuthorized } = useSelector<RootState, AuthorizedServicesState>((state) => state.authorizedServices)

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.HEALTH)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const hasError = useError(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID)
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const startingTab = route?.params?.startingTab

  const [page, setPage] = useState(1)
  const [currentPrescriptions, setCurrentPrescriptions] = useState<PrescriptionsList>([])

  const [selectedFilter, setSelectedFilter] = useState<RefillStatus | ''>('')
  const [selectedSortBy, setSelectedSortBy] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [selectedSortOn, setSelectedSortOn] = useState(ASCENDING)

  const [filterToUse, setFilterToUse] = useState<RefillStatus | ''>('')
  const [sortByToUse, setSortByToUse] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [sortOnToUse, setSortOnToUse] = useState(ASCENDING)

  const [currentTab, setCurrentTab] = useState<string>(startingTab || PrescriptionHistoryTabConstants.ALL)

  useEffect(() => {
    const filters = getFilterArgsForFilter(filterToUse)
    dispatch(filterAndSortPrescriptions(filters, currentTab, sortByToUse, sortOnToUse === ASCENDING))
  }, [dispatch, filterToUse, currentTab, sortByToUse, sortOnToUse])

  useEffect(() => {
    const newPrescriptions = prescriptions?.slice((page - 1) * pageSize, page * pageSize)
    setCurrentPrescriptions(newPrescriptions || [])
  }, [page, prescriptions])

  useEffect(() => {
    if (prescriptionsNeedLoad && prescriptionsAuthorized && !prescriptionInDowntime) {
      dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
    }
  }, [dispatch, prescriptionsNeedLoad, prescriptionsAuthorized, prescriptionInDowntime])

  // ErrorComponent normally handles both downtime and error but only for 1 screenID.
  // In this case, we need to support multiple screen IDs
  if (prescriptionInDowntime) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
  }

  if (hasError) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID} />
  }

  if (!prescriptionsAuthorized) {
    return <PrescriptionHistoryNotAuthorized />
  }

  if (loadingHistory) {
    return <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
  }

  if (!tabCounts[PrescriptionHistoryTabConstants.ALL]) {
    return <PrescriptionHistoryNoPrescriptions />
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
    const total = currentPrescriptions?.length

    const listItems: Array<ReactNode> = (currentPrescriptions || []).map((prescription, idx) => {
      const refillStatus = prescription.attributes.refillStatus
      const refillStatusText = getTextForRefillStatus(refillStatus, t)

      let cardProps: MultiTouchCardProps = {
        topOnPress: navigateTo('StatusGlossary', { display: refillStatusText, value: refillStatus }),
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

      if (prescription.attributes.isTrackable) {
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

        const bottomOnPress = navigateTo('RefillTrackingModal', { prescription: prescription })

        cardProps = { ...cardProps, bottomContent, bottomOnPress }
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
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
      },
      onPrev: () => {
        setPage(page - 1)
      },
      totalEntries: prescriptions?.length || 0,
      pageSize: pageSize,
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

  const sortOrderRadioOptions = getSortOrderOptionsForSortBy(selectedSortBy, t)

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

  const getInstructions = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return t('prescriptions.header.helper.all')
      case PrescriptionHistoryTabConstants.PROCESSING:
        return t('prescriptions.header.helper.processing')
      case PrescriptionHistoryTabConstants.SHIPPED:
        return t('prescriptions.header.helper.shipped')
    }
  }

  const getInstructionA11y = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return t('prescriptions.header.helper.all.a11y')
      case PrescriptionHistoryTabConstants.PROCESSING:
        return t('prescriptions.header.helper.processing.a11y')
      case PrescriptionHistoryTabConstants.SHIPPED:
        return t('prescriptions.header.helper.shipped')
    }
  }

  const getContent = () => {
    if (hasNoItems) {
      return noMatchDisplayEl
    } else {
      return (
        <>
          <Box mx={theme.dimensions.gutter} pt={theme.dimensions.contentMarginTop}>
            <TextView variant={'HelperText'} accessibilityLabel={getInstructionA11y()}>
              {getInstructions()}
            </TextView>
            <TextView mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
              {t('prescription.history.list.title', { count: prescriptions?.length })}
            </TextView>
          </Box>
          <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
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
