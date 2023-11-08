import { AccessibilityInfo, Pressable, PressableProps, ScrollView } from 'react-native'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { find } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ASCENDING, DEFAULT_PAGE_SIZE } from 'constants/common'
import {
  Box,
  BoxProps,
  ButtonTypesConstants,
  ClickForActionLink,
  CollapsibleAlert,
  CollapsibleAlertProps,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  LoadingComponent,
  MultiTouchCard,
  MultiTouchCardProps,
  Pagination,
  PaginationProps,
  TabBar,
  TabBarProps,
  TabsValuesType,
  TextView,
  VAButton,
  VAButtonProps,
  VAIcon,
  VAIconProps,
} from 'components'
import {
  DowntimeFeatureTypeConstants,
  PrescriptionHistoryTabConstants,
  PrescriptionHistoryTabs,
  PrescriptionSortOptionConstants,
  PrescriptionSortOptions,
  PrescriptionsList,
  RefillStatus,
  RefillStatusConstants,
} from 'store/api/types'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, filterAndSortPrescriptions, loadAllPrescriptions } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getFilterArgsForFilter, getSortOrderOptionsForSortBy } from 'utils/prescriptions'
import { getTranslation } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useFocusEffect } from '@react-navigation/native'
import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'
import PrescriptionHistoryNoPrescriptions from './PrescriptionHistoryNoPrescriptions'
import PrescriptionHistoryNotAuthorized from './PrescriptionHistoryNotAuthorized'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const pageSize = DEFAULT_PAGE_SIZE

// Delay custom screen reader announcements so they don't cut off native announcements
const announcementDelay = 1000

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
      display: 'prescription.history.tag.discontinued',
      value: RefillStatusConstants.DISCONTINUED,
    },
    {
      display: 'prescription.history.tag.expired',
      value: RefillStatusConstants.EXPIRED,
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
  pending: [
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

const PrescriptionHistory: FC<PrescriptionHistoryProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const {
    filteredPrescriptions: prescriptions,
    prescriptions: allPrescriptions,
    loadingHistory,
    tabCounts,
    prescriptionsNeedLoad,
    transferredPrescriptions,
  } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const hasError = useError(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID)
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const startingTab = route?.params?.startingTab
  const hasTransferred = !!transferredPrescriptions?.length

  const [page, setPage] = useState(1)
  const [currentPrescriptions, setCurrentPrescriptions] = useState<PrescriptionsList>([])

  const [selectedFilter, setSelectedFilter] = useState<RefillStatus | ''>('')
  const [selectedSortBy, setSelectedSortBy] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [selectedSortOn, setSelectedSortOn] = useState(ASCENDING)

  const [filterToUse, setFilterToUse] = useState<RefillStatus | ''>('')
  const [sortByToUse, setSortByToUse] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
  const [sortOnToUse, setSortOnToUse] = useState(ASCENDING)

  const [currentTab, setCurrentTab] = useState<string>(PrescriptionHistoryTabConstants.ALL)

  useEffect(() => {
    if (hasTransferred) {
      logAnalyticsEvent(Events.vama_rx_refill_cerner())
    }
  }, [hasTransferred])

  useEffect(() => {
    if (startingTab) {
      onTabChange(startingTab)
      navigation.setParams({ startingTab: undefined })
    }
  }, [startingTab, navigation])

  // scrollViewRef is leveraged by renderPagination to reset scroll position to the top on page change.
  // Must pass scrollViewRef to all uses of FeatureLandingTemplate, otherwise it will become undefined
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    const filters = getFilterArgsForFilter(filterToUse)
    dispatch(filterAndSortPrescriptions(filters, currentTab, sortByToUse, sortOnToUse === ASCENDING))
  }, [dispatch, filterToUse, currentTab, sortByToUse, sortOnToUse, allPrescriptions])

  useEffect(() => {
    const newPrescriptions = prescriptions?.slice((page - 1) * pageSize, page * pageSize)
    setCurrentPrescriptions(newPrescriptions || [])
  }, [page, prescriptions])

  // useFocusEffect, ensures we only call loadAllPrescriptions if needed when this component is being shown
  useFocusEffect(
    React.useCallback(() => {
      if (prescriptionsNeedLoad && userAuthorizedServices?.prescriptions && !prescriptionInDowntime) {
        dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
      }
    }, [dispatch, prescriptionsNeedLoad, userAuthorizedServices?.prescriptions, prescriptionInDowntime]),
  )

  // ErrorComponent normally handles both downtime and error but only for 1 screenID.
  // In this case, we need to support multiple screen IDs
  if (prescriptionInDowntime) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (hasError || getUserAuthorizedServicesError) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (!userAuthorizedServices?.prescriptions) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <PrescriptionHistoryNotAuthorized />
      </FeatureLandingTemplate>
    )
  }

  if (loadingHistory || loadingUserAuthorizedServices) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
      </FeatureLandingTemplate>
    )
  }

  if (!tabCounts[PrescriptionHistoryTabConstants.ALL]) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <PrescriptionHistoryNoPrescriptions />
      </FeatureLandingTemplate>
    )
  }

  const tabs: TabsValuesType = [
    {
      value: PrescriptionHistoryTabConstants.ALL,
      title: t('prescriptions.tabs.all', { count: tabCounts[PrescriptionHistoryTabConstants.ALL] }),
      testID: 'prescriptionAllCountTestID',
    },
    {
      value: PrescriptionHistoryTabConstants.PENDING,
      title: t('prescriptions.tabs.pending', { count: tabCounts[PrescriptionHistoryTabConstants.PENDING] }),
      testID: 'prescriptionPendingCountTestID',
    },
    {
      value: PrescriptionHistoryTabConstants.TRACKING,
      title: t('prescriptions.tabs.tracking', { count: tabCounts[PrescriptionHistoryTabConstants.TRACKING] }),
      testID: 'prescriptionTrackingCountTestID',
    },
  ]

  const onTabChange = (newTab: string) => {
    setFilterToUse('')
    setSelectedFilter('')
    setCurrentTab(newTab)
    setPage(1)

    if (newTab === PrescriptionHistoryTabConstants.PENDING) {
      logAnalyticsEvent(Events.vama_rx_pendingtab())
    } else if (newTab === PrescriptionHistoryTabConstants.TRACKING) {
      logAnalyticsEvent(Events.vama_rx_trackingtab())
    }
  }

  const tabProps: TabBarProps = {
    tabs,
    onChange: onTabChange,
    selected: currentTab,
  }

  const prescriptionDetailsClicked = (prescriptionID: string) => {
    logAnalyticsEvent(Events.vama_rx_details(prescriptionID))
    return navigation.navigate('PrescriptionDetails', { prescriptionId: prescriptionID })
  }

  const prescriptionItems = () => {
    const total = currentPrescriptions?.length

    const listItems: Array<ReactNode> = (currentPrescriptions || []).map((prescription, idx) => {
      const detailsPressableProps: PressableProps = {
        onPress: () => prescriptionDetailsClicked(prescription.id),
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t('prescription.history.getDetails'),
      }

      const mainContent = (
        <>
          <PrescriptionListItem prescription={prescription.attributes} includeRefillTag={true} />
          <Pressable {...detailsPressableProps}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} minHeight={theme.dimensions.touchableMinHeight} pt={5}>
              <TextView flex={1} variant={'HelperTextBold'} color={'link'}>
                {t('prescription.history.getDetails')}
              </TextView>
              <VAIcon
                name={'ChevronRight'}
                fill={theme.colors.icon.chevronListItem}
                width={theme.dimensions.chevronListItemWidth}
                height={theme.dimensions.chevronListItemHeight}
              />
            </Box>
          </Pressable>
        </>
      )

      let cardProps: MultiTouchCardProps = {
        orderIdentifier: t('prescription.history.orderIdentifier', { idx: idx + 1, total: total }),
        mainContent,
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
              <VAIcon name={'Truck'} fill={'link'} height={16} width={16} />
            </Box>
            <TextView flex={1} variant={'HelperTextBold'} color={'link'}>
              {t('prescription.history.tracking')}
            </TextView>
          </Box>
        )

        cardProps = {
          ...cardProps,
          bottomContent,
          bottomOnPress() {
            logAnalyticsEvent(Events.vama_rx_trackdet(prescription.id))
            navigation.navigate('RefillTrackingModal', { prescription: prescription })
          },
        }
      }

      return (
        <Box key={idx}>
          <MultiTouchCard {...cardProps} />
        </Box>
      )
    })

    return listItems
  }

  const renderPagination = (): ReactNode => {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: prescriptions?.length || 0,
      pageSize: pageSize,
      page,
      tab: currentTab,
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

  const announceAfterDelay = (announcement: string) => {
    setTimeout(() => AccessibilityInfo.announceForAccessibility(announcement), announcementDelay)
  }

  const sortOrderRadioOptions = getSortOrderOptionsForSortBy(selectedSortBy, t)

  const sortButtonText = `${t('prescriptions.sort.by')}: ${getDisplayForValue(sortByOptions, sortByToUse)}`

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
    buttonText: sortButtonText,
    buttonA11yLabel: sortButtonText, // so Android reads button text
    buttonA11yHint: t('prescription.filter.sort.a11y'),
    buttonTestID: 'openSortTestID',
    headerText: t('prescription.filter.sort'),
    topRightButtonText: t('reset'),
    topRightButtonA11yHint: t('prescription.filter.sort.reset.a11y'),
    topRightButtonTestID: 'resetSortTestID',
    testID: 'sortListTestID',
    onConfirm: () => {
      setSortOnToUse(selectedSortOn)
      setSortByToUse(selectedSortBy)
      logAnalyticsEvent(Events.vama_rx_sort_sel(selectedSortBy))
    },
    onUpperRightAction: () => {
      setSelectedSortBy(PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
      setSelectedSortOn(ASCENDING)
      const value = getDisplayForValue(sortByOptions, PrescriptionSortOptionConstants.PRESCRIPTION_NAME)
      const direction = t('prescriptions.sort.atoz.a11y')
      announceAfterDelay(t('prescriptions.resetAnnouncementWithDirection', { value, direction }))
    },
    onCancel: () => {
      setSelectedSortBy(sortByToUse)
      setSelectedSortOn(sortOnToUse)
    },
    onShowAnalyticsFn: () => {
      logAnalyticsEvent(Events.vama_rx_sort())
    },
  }

  const filterOptionsForTab = currentTab === PrescriptionHistoryTabConstants.PENDING ? filterOptions.pending : filterOptions.all

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
    buttonA11yLabel: filterButtonText, // so Android reads button text
    buttonA11yHint: t('prescription.filter.by.a11y'),
    buttonTestID: 'openFilterTestID',
    headerText: t('prescription.filter.status'),
    topRightButtonText: t('reset'),
    topRightButtonA11yHint: t('prescription.filter.by.reset.a11y'),
    topRightButtonTestID: 'resetFilterTestID',
    testID: 'filterListTestID',
    onConfirm: () => {
      setPage(1)
      setFilterToUse(selectedFilter)
      logAnalyticsEvent(Events.vama_rx_filter_sel(selectedFilter))
    },
    onUpperRightAction: () => {
      setSelectedFilter('')
      announceAfterDelay(t('prescriptions.resetAnnouncement', { value: getDisplayForValue(filterOptionsForTab, '') }))
    },
    onCancel: () => {
      setSelectedFilter(filterToUse)
    },
    onShowAnalyticsFn: () => {
      logAnalyticsEvent(Events.vama_rx_filter())
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
    testID: 'filterSortWrapperBoxTestID',
  }

  const filterWrapperProps: BoxProps = {
    borderBottomWidth: 1,
    borderColor: 'primary',
  }

  const hasNoItems = prescriptions?.length === 0

  const getInstructions = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return t('prescriptions.header.helper.all')
      case PrescriptionHistoryTabConstants.PENDING:
        return t('prescriptions.header.helper.pending')
      case PrescriptionHistoryTabConstants.TRACKING:
        return t('prescriptions.header.helper.tracking')
    }
  }

  const getInstructionA11y = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return a11yLabelVA(t('prescriptions.header.helper.all'))
      case PrescriptionHistoryTabConstants.PENDING:
        return a11yLabelVA(t('prescriptions.header.helper.pending'))
      case PrescriptionHistoryTabConstants.TRACKING:
        return t('prescriptions.header.helper.tracking')
    }
  }

  const getTransferAlert = () => {
    if (!hasTransferred) {
      return <></>
    }

    const linkProps: LinkButtonProps = {
      displayedText: t('goToMyVAHealth'),
      linkType: LinkTypeOptionsConstants.externalLink,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: LINK_URL_GO_TO_PATIENT_PORTAL,
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
    }

    const props: CollapsibleAlertProps = {
      border: 'warning',
      headerText: t('prescription.history.transferred.title'),
      body: (
        <>
          <TextView mt={theme.dimensions.standardMarginBetween} accessibilityLabel={a11yLabelVA(t('prescription.history.transferred.instructions'))} paragraphSpacing={true}>
            {t('prescription.history.transferred.instructions')}
          </TextView>
          <TextView paragraphSpacing={true} accessibilityLabel={a11yLabelVA(t('prescription.history.transferred.youCan'))}>
            {t('prescription.history.transferred.youCan')}
          </TextView>
          <ClickForActionLink {...linkProps} />
        </>
      ),
      a11yLabel: t('prescription.history.transferred.title'),
      onExpand() {
        logAnalyticsEvent(Events.vama_rx_cerner_exp())
      },
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <CollapsibleAlert {...props} />
      </Box>
    )
  }

  const getRequestRefillButton = () => {
    if (currentTab !== PrescriptionHistoryTabConstants.ALL) {
      return <></>
    }

    const requestRefillButtonProps: VAButtonProps = {
      label: t('prescription.history.startRefillRequest'),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: navigateTo('RefillScreenModal'),
    }
    return (
      <Box mx={theme.dimensions.buttonPadding}>
        <VAButton {...requestRefillButtonProps} />
      </Box>
    )
  }

  const getHistoryListHeader = () => {
    switch (currentTab) {
      case PrescriptionHistoryTabConstants.ALL:
        return t('prescription.history.list.title.all', { count: prescriptions?.length })
      case PrescriptionHistoryTabConstants.PENDING:
        return t('prescription.history.list.title.pending', { count: prescriptions?.length })
      case PrescriptionHistoryTabConstants.TRACKING:
        return t('prescription.history.list.title.tracking', { count: prescriptions?.length })
    }
  }

  const getContent = () => {
    if (hasNoItems) {
      return <PrescriptionHistoryNoMatches currentTab={currentTab as PrescriptionHistoryTabs} isFiltered={!!filterToUse} />
    } else {
      return (
        <>
          {getTransferAlert()}
          <Box mx={theme.dimensions.gutter} pt={theme.dimensions.contentMarginTop}>
            <TextView mb={theme.dimensions.standardMarginBetween} variant={'HelperText'} accessibilityLabel={getInstructionA11y()}>
              {getInstructions()}
            </TextView>
            <TextView mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
              {getHistoryListHeader()}
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

  const helpIconProps: VAIconProps = {
    name: 'QuestionMark',
    fill2: theme.colors.icon.transparent,
  }

  const headerButton = {
    label: t('help'),
    icon: helpIconProps,
    onPress: () => {
      logAnalyticsEvent(Events.vama_rx_help())
      navigation.navigate('PrescriptionHelp')
    },
  }

  return (
    <FeatureLandingTemplate
      scrollViewProps={{ scrollViewRef }}
      headerButton={headerButton}
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('prescription.title')}
      testID="PrescriptionHistory">
      {getRequestRefillButton()}
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
    </FeatureLandingTemplate>
  )
}

export default PrescriptionHistory
