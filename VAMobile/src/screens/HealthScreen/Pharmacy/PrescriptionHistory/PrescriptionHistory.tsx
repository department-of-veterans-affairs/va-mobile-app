import { Pressable, PressableProps, ScrollView } from 'react-native'
import { ReactNode, useEffect, useRef, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { find } from 'underscore'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { ASCENDING, DEFAULT_PAGE_SIZE, DESCENDING } from 'constants/common'
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
  TextView,
  VAButton,
  VAButtonProps,
  VAIcon,
  VAIconProps,
} from 'components'
import { DowntimeFeatureTypeConstants, PrescriptionSortOptionConstants, PrescriptionSortOptions, PrescriptionsList, RefillStatus, RefillStatusConstants } from 'store/api/types'
import { Events } from 'constants/analytics'
import { HealthStackParamList } from '../../HealthStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { PrescriptionListItem } from '../PrescriptionCommon'
import { PrescriptionState, filterAndSortPrescriptions, loadAllPrescriptions } from 'store/slices/prescriptionSlice'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { getFilterArgsForFilter } from 'utils/prescriptions'
import { getTranslation } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { screenContentAllowed, waygateNativeAlert } from 'utils/waygateConfig'
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

const sortByOptions = [
  { display: 'prescriptions.sort.fillDate', value: PrescriptionSortOptionConstants.REFILL_DATE },
  { display: 'prescriptions.sort.medication', value: PrescriptionSortOptionConstants.PRESCRIPTION_NAME },
  { display: 'prescriptions.sort.refills', value: PrescriptionSortOptionConstants.REFILL_REMAINING },
  { display: 'prescriptions.sort.status', value: PrescriptionSortOptionConstants.REFILL_STATUS },
]

type PrescriptionHistoryProps = StackScreenProps<HealthStackParamList, 'PrescriptionHistory'>

const PrescriptionHistory: FC<PrescriptionHistoryProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const {
    filteredPrescriptions: prescriptions,
    prescriptions: allPrescriptions,
    loadingHistory,
    statusCounts,
    prescriptionsNeedLoad,
    transferredPrescriptions,
  } = useSelector<RootState, PrescriptionState>((s) => s.prescriptions)
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const hasError = useError(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID)
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const hasTransferred = !!transferredPrescriptions?.length

  const [page, setPage] = useState(1)
  const [currentPrescriptions, setCurrentPrescriptions] = useState<PrescriptionsList>([])

  const [selectedFilter, setSelectedFilter] = useState<RefillStatus | ''>('')
  const [selectedSortBy, setSelectedSortBy] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.REFILL_STATUS)

  const [filterToUse, setFilterToUse] = useState<RefillStatus | ''>('')
  const [sortByToUse, setSortByToUse] = useState<PrescriptionSortOptions | ''>(PrescriptionSortOptionConstants.REFILL_STATUS)
  const [sortOnToUse, setSortOnToUse] = useState(ASCENDING)

  useEffect(() => {
    if (hasTransferred) {
      logAnalyticsEvent(Events.vama_rx_refill_cerner())
    }
  }, [hasTransferred])

  // scrollViewRef is leveraged by renderPagination to reset scroll position to the top on page change.
  // Must pass scrollViewRef to all uses of FeatureLandingTemplate, otherwise it will become undefined
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    const filters = getFilterArgsForFilter(filterToUse)
    dispatch(filterAndSortPrescriptions(filters, sortByToUse, sortOnToUse === ASCENDING, t))
  }, [dispatch, filterToUse, sortByToUse, sortOnToUse, allPrescriptions, t])

  useEffect(() => {
    const newPrescriptions = prescriptions?.slice((page - 1) * pageSize, page * pageSize)
    setCurrentPrescriptions(newPrescriptions || [])
  }, [page, prescriptions])

  // useFocusEffect, ensures we only call loadAllPrescriptions if needed when this component is being shown
  useFocusEffect(
    React.useCallback(() => {
      if (screenContentAllowed('WG_PrescriptionHistory') && prescriptionsNeedLoad && userAuthorizedServices?.prescriptions && !prescriptionInDowntime) {
        dispatch(loadAllPrescriptions(ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID))
      }
    }, [dispatch, prescriptionsNeedLoad, userAuthorizedServices?.prescriptions, prescriptionInDowntime]),
  )

  const filterOptions = [
    {
      display: 'prescription.filter.all',
      value: '',
      count: allPrescriptions?.length || 0,
    },
    {
      display: 'prescription.history.tag.active',
      value: RefillStatusConstants.ACTIVE,
      count: statusCounts.active || 0,
      additionalLabelText: [t('prescription.history.tag.active.helpText')],
    },
    {
      display: 'prescription.history.tag.discontinued',
      value: RefillStatusConstants.DISCONTINUED,
      count: statusCounts.discontinued || 0,
    },
    {
      display: 'prescription.history.tag.expired',
      value: RefillStatusConstants.EXPIRED,
      count: statusCounts.expired || 0,
    },
    {
      display: 'prescription.history.tag.pending',
      value: RefillStatusConstants.PENDING,
      count: statusCounts.pending || 0,
      additionalLabelText: [t('prescription.history.tag.pending.helpText')],
    },
    {
      display: 'prescription.history.tag.tracking',
      value: RefillStatusConstants.TRACKING,
      count: statusCounts.tracking || 0,
      additionalLabelText: [t('prescription.history.tag.tracking.helpText')],
    },
    {
      display: 'prescription.history.tag.transferred',
      value: RefillStatusConstants.TRANSFERRED,
      count: statusCounts.transferred || 0,
    },
    {
      display: 'prescription.history.tag.unknown',
      value: RefillStatusConstants.UNKNOWN,
      count: statusCounts.unknown || 0,
    },
  ]

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

  if (!allPrescriptions?.length) {
    return (
      <FeatureLandingTemplate scrollViewProps={{ scrollViewRef }} backLabel={t('health.title')} backLabelOnPress={navigation.goBack} title={t('prescription.title')}>
        <PrescriptionHistoryNoPrescriptions />
      </FeatureLandingTemplate>
    )
  }

  const prescriptionDetailsClicked = (prescriptionID: string) => {
    logAnalyticsEvent(Events.vama_rx_details(prescriptionID))
    if (waygateNativeAlert('WG_PrescriptionDetails')) {
      return navigation.navigate('PrescriptionDetails', { prescriptionId: prescriptionID })
    }
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
            if (waygateNativeAlert('WG_RefillTrackingModal')) {
              navigation.navigate('RefillTrackingModal', { prescription: prescription })
            }
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
    }

    return <Pagination {...paginationProps} />
  }

  const getDisplayForValue = (options: { display: string; value: string }[], val: string) => {
    const display = find(options, (f) => {
      return f.value === val
    })

    return getTranslation(display?.display || '', t)
  }

  const modalSortByOptions = sortByOptions.map((option) => {
    return {
      value: option.value,
      labelKey: getTranslation(option.display, t),
    }
  })

  const modalFilterOptions = filterOptions.map((option) => {
    return {
      value: option.value,
      labelKey: `${getTranslation(option.display, t)} (${option.count})`,
      additionalLabelText: option.additionalLabelText,
    }
  })

  const modalProps: RadioGroupModalProps = {
    groups: [
      {
        items: modalFilterOptions,
        onSetOption: (newFilter: string) => {
          setSelectedFilter(newFilter as RefillStatus | '')
        },
        selectedValue: selectedFilter,
        title: t('prescription.filter.by'),
      },
      {
        items: modalSortByOptions,
        onSetOption: (newSortBy: string) => {
          setSelectedSortBy(newSortBy as PrescriptionSortOptions | '')
        },
        selectedValue: selectedSortBy,
        title: t('prescriptions.sort.by'),
      },
    ],
    buttonText: t('filterAndSort'),
    buttonA11yLabel: t('filterAndSort'), // so Android reads button text
    buttonA11yHint: t('prescription.modal.a11yHint'),
    buttonTestID: 'openFilterAndSortTestID',
    headerText: t('filterAndSort'),
    testID: 'ModalTestID',
    onApply: () => {
      setPage(1)
      setFilterToUse(selectedFilter)
      setSortByToUse(selectedSortBy)
      setSortOnToUse(selectedSortBy === PrescriptionSortOptionConstants.REFILL_DATE ? DESCENDING : ASCENDING)
      logAnalyticsEvent(Events.vama_rx_filter_sel(selectedFilter))
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

  const hasNoItems = prescriptions?.length === 0

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
    const requestRefillButtonProps: VAButtonProps = {
      label: t('prescription.history.startRefillRequest'),
      buttonType: ButtonTypesConstants.buttonPrimary,
      onPress: () => {
        if (waygateNativeAlert('WG_RefillScreenModal')) {
          navigateTo('RefillScreenModal')()
        }
      },
    }
    return (
      <Box mx={theme.dimensions.buttonPadding}>
        <VAButton {...requestRefillButtonProps} />
      </Box>
    )
  }

  const prescriptionListTitle = () => {
    const sortUppercase = getDisplayForValue(sortByOptions, sortByToUse)
    const keys = {
      count: prescriptions?.length,
      filter: getDisplayForValue(filterOptions, filterToUse),
      sort: sortUppercase[0].toLowerCase() + sortUppercase.slice(1),
    }

    if (selectedFilter === RefillStatusConstants.PENDING) {
      return t('prescription.history.list.title.pending', keys)
    } else if (selectedFilter === RefillStatusConstants.TRACKING) {
      return t('prescription.history.list.title.tracking', keys)
    } else {
      return t('prescription.history.list.title', keys)
    }
  }

  const prescriptionListDescription = () => {
    if (selectedFilter === RefillStatusConstants.PENDING) {
      return t('prescription.history.list.header.pending')
    } else if (selectedFilter === RefillStatusConstants.TRACKING) {
      return t('prescription.history.list.header.tracking')
    } else {
      return t('prescription.history.list.header')
    }
  }

  const filterModal = () => {
    return (
      <Box {...filterContainerProps}>
        <Box mr={8} mb={10}>
          <RadioGroupModal {...modalProps} />
        </Box>
      </Box>
    )
  }

  const getContent = () => {
    if (hasNoItems) {
      return (
        <>
          {filterModal()}
          <PrescriptionHistoryNoMatches isFiltered={!!filterToUse} />
        </>
      )
    } else {
      return (
        <>
          <Box mx={theme.dimensions.gutter} pt={theme.dimensions.contentMarginTop}>
            <TextView mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.condensedMarginBetween} variant={'MobileBodyBold'}>
              {prescriptionListTitle()}
            </TextView>
            <TextView mb={theme.dimensions.standardMarginBetween} variant={'HelperText'} accessibilityLabel={a11yLabelVA(prescriptionListDescription())}>
              {prescriptionListDescription()}
            </TextView>
          </Box>

          {filterModal()}

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
      if (waygateNativeAlert('WG_PrescriptionHelp')) {
        navigation.navigate('PrescriptionHelp')
      }
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
      {getTransferAlert()}
      {getContent()}
    </FeatureLandingTemplate>
  )
}

export default PrescriptionHistory
