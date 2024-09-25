import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps, ScrollView } from 'react-native'

import { StackScreenProps } from '@react-navigation/stack'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'
import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'
import { filter, find } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePrescriptions } from 'api/prescriptions'
import {
  PrescriptionData,
  PrescriptionSortOptionConstants,
  PrescriptionSortOptions,
  PrescriptionsList,
  RefillStatus,
  RefillStatusConstants,
} from 'api/types'
import {
  AlertWithHaptics,
  Box,
  BoxProps,
  ErrorComponent,
  FeatureLandingTemplate,
  LinkWithAnalytics,
  LoadingComponent,
  MultiTouchCard,
  MultiTouchCardProps,
  Pagination,
  PaginationProps,
  TextView,
  VAIcon,
  VAIconProps,
} from 'components'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'
import { Events } from 'constants/analytics'
import { ASCENDING, DEFAULT_PAGE_SIZE, DESCENDING } from 'constants/common'
import { NAMESPACE } from 'constants/namespaces'
import { DowntimeFeatureTypeConstants } from 'store/api/types'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'
import { getTranslation } from 'utils/formattingUtils'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { filterAndSortPrescriptions, getFilterArgsForFilter } from 'utils/prescriptions'
import { screenContentAllowed } from 'utils/waygateConfig'

import { HealthStackParamList } from '../../HealthStackScreens'
import { PrescriptionListItem } from '../PrescriptionCommon'
import PrescriptionHistoryNoMatches from './PrescriptionHistoryNoMatches'
import PrescriptionHistoryNoPrescriptions from './PrescriptionHistoryNoPrescriptions'
import PrescriptionHistoryNotAuthorized from './PrescriptionHistoryNotAuthorized'

const { LINK_URL_GO_TO_PATIENT_PORTAL } = getEnv()

const pageSize = DEFAULT_PAGE_SIZE

const sortByOptions = [
  { display: 'prescriptions.sort.fillDate', value: PrescriptionSortOptionConstants.REFILL_DATE },
  { display: 'prescriptions.sort.medication', value: PrescriptionSortOptionConstants.PRESCRIPTION_NAME },
  { display: 'prescriptions.sort.refills', value: PrescriptionSortOptionConstants.REFILL_REMAINING },
  { display: 'prescriptions.sort.status', value: PrescriptionSortOptionConstants.REFILL_STATUS },
]

type PrescriptionHistoryProps = StackScreenProps<HealthStackParamList, 'PrescriptionHistory'>

function PrescriptionHistory({ navigation, route }: PrescriptionHistoryProps) {
  const prescriptionInDowntime = useDowntime(DowntimeFeatureTypeConstants.rx)
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchAuthServices,
  } = useAuthorizedServices()
  const {
    data: prescriptionData,
    isFetching: loadingHistory,
    error: hasError,
    isFetched: prescriptionsFetched,
    refetch: refetchPrescriptions,
  } = usePrescriptions({
    enabled: screenContentAllowed('WG_PrescriptionHistory'),
  })
  const [allPrescriptions, setAllPrescriptions] = useState<PrescriptionsList>([])
  const transferredPrescriptions = filter(allPrescriptions, (prescription) => {
    return prescription.attributes.refillStatus === RefillStatusConstants.TRANSFERRED
  })
  const pendingPrescriptions = filter(allPrescriptions, (prescription) => {
    return (
      prescription.attributes.refillStatus === RefillStatusConstants.REFILL_IN_PROCESS ||
      prescription.attributes.refillStatus === RefillStatusConstants.SUBMITTED
    )
  })
  const shippedPrescriptions = filter(allPrescriptions, (prescription) => {
    return prescription.attributes.isTrackable
  })

  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const startingFilter = route?.params?.startingFilter
  const hasTransferred = !!transferredPrescriptions?.length

  const [page, setPage] = useState(1)
  const [currentPrescriptions, setCurrentPrescriptions] = useState<PrescriptionsList>([])

  const [selectedFilter, setSelectedFilter] = useState<RefillStatus | ''>('')
  const [selectedSortBy, setSelectedSortBy] = useState<PrescriptionSortOptions | ''>(
    PrescriptionSortOptionConstants.REFILL_STATUS,
  )

  const [filterToUse, setFilterToUse] = useState<RefillStatus | ''>('')
  const [sortByToUse, setSortByToUse] = useState<PrescriptionSortOptions | ''>(
    PrescriptionSortOptionConstants.REFILL_STATUS,
  )
  const [sortOnToUse, setSortOnToUse] = useState(ASCENDING)
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<PrescriptionsList>([])

  useEffect(() => {
    if (prescriptionsFetched && prescriptionData?.data) {
      setAllPrescriptions(prescriptionData.data)
    }
  }, [prescriptionsFetched, prescriptionData])

  useEffect(() => {
    if (hasTransferred) {
      logAnalyticsEvent(Events.vama_cerner_alert())
    }
  }, [hasTransferred])

  useEffect(() => {
    if (startingFilter) {
      setPage(1)
      setSelectedFilter(startingFilter)
      setFilterToUse(startingFilter)
      setSelectedSortBy(PrescriptionSortOptionConstants.REFILL_STATUS)
      setSortByToUse(PrescriptionSortOptionConstants.REFILL_STATUS)
      setSortOnToUse(ASCENDING)
      navigation.setParams({ startingFilter: undefined })
    }
  }, [startingFilter, navigation, selectedFilter, selectedSortBy])

  // scrollViewRef is leveraged by renderPagination to reset scroll position to the top on page change.
  const scrollViewRef = useRef<ScrollView | null>(null)

  useEffect(() => {
    const filters = getFilterArgsForFilter(filterToUse)
    setFilteredPrescriptions(
      filterAndSortPrescriptions(allPrescriptions, filters, sortByToUse, sortOnToUse === ASCENDING, t),
    )
  }, [filterToUse, sortByToUse, sortOnToUse, allPrescriptions, t])

  useEffect(() => {
    const newPrescriptions = filteredPrescriptions?.slice((page - 1) * pageSize, page * pageSize)
    setCurrentPrescriptions(newPrescriptions || [])
  }, [page, filteredPrescriptions])

  const filterOptions = [
    {
      display: 'prescription.filter.all',
      value: '',
      count: allPrescriptions?.length || 0,
    },
    {
      display: 'prescription.history.tag.active',
      value: RefillStatusConstants.ACTIVE,
      count: prescriptionData?.meta.prescriptionStatusCount.active || 0,
      additionalLabelText: [t('prescription.history.tag.active.helpText')],
    },
    {
      display: 'prescription.history.tag.discontinued',
      value: RefillStatusConstants.DISCONTINUED,
      count: prescriptionData?.meta.prescriptionStatusCount.discontinued || 0,
    },
    {
      display: 'prescription.history.tag.expired',
      value: RefillStatusConstants.EXPIRED,
      count: prescriptionData?.meta.prescriptionStatusCount.expired || 0,
    },
    {
      display: 'prescription.history.tag.pending',
      value: RefillStatusConstants.PENDING,
      count: pendingPrescriptions?.length || 0,
      additionalLabelText: [t('prescription.history.tag.pending.helpText')],
    },
    {
      display: 'prescription.history.tag.tracking',
      value: RefillStatusConstants.TRACKING,
      count: shippedPrescriptions?.length || 0,
      additionalLabelText: [t('prescription.history.tag.tracking.helpText')],
    },
    {
      display: 'prescription.history.tag.transferred',
      value: RefillStatusConstants.TRANSFERRED,
      count: prescriptionData?.meta.prescriptionStatusCount.transferred || 0,
    },
    {
      display: 'prescription.history.tag.unknown',
      value: RefillStatusConstants.UNKNOWN,
      count: prescriptionData?.meta.prescriptionStatusCount.unknown || 0,
    },
  ]

  const prescriptionDetailsClicked = (prescription: PrescriptionData) => {
    logAnalyticsEvent(Events.vama_rx_details(prescription.id))
    return navigateTo('PrescriptionDetails', { prescription: prescription })
  }

  const prescriptionItems = () => {
    const total = currentPrescriptions?.length

    const listItems: Array<React.ReactNode> = (currentPrescriptions || []).map((prescription, idx) => {
      const detailsPressableProps: PressableProps = {
        onPress: () => prescriptionDetailsClicked(prescription),
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: t('prescription.history.getDetails'),
      }

      const mainContent = (
        <>
          <PrescriptionListItem prescription={prescription.attributes} includeRefillTag={true} />
          <Pressable {...detailsPressableProps}>
            <Box
              display={'flex'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              alignItems={'center'}
              minHeight={theme.dimensions.touchableMinHeight}
              pt={5}>
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
            navigateTo('RefillTrackingModal', { prescription: prescription })
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

  function renderPagination() {
    const paginationProps: PaginationProps = {
      onNext: () => {
        setPage(page + 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      onPrev: () => {
        setPage(page - 1)
        scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: false })
      },
      totalEntries: filteredPrescriptions?.length || 0,
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
    const labelKey = `${getTranslation(option.display, t)} (${option.count})`
    let a11yLabel = labelKey
    if (option.additionalLabelText) {
      a11yLabel += ` ${a11yLabelVA(option.additionalLabelText[0])}.`
    }

    return {
      value: option.value,
      labelKey,
      additionalLabelText: option.additionalLabelText,
      a11yLabel,
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
    onApply: () => {
      setPage(1)
      setFilterToUse(selectedFilter)
      setSortByToUse(selectedSortBy)
      setSortOnToUse(selectedSortBy === PrescriptionSortOptionConstants.REFILL_DATE ? DESCENDING : ASCENDING)
      logAnalyticsEvent(Events.vama_rx_filter_sel(selectedFilter || 'all', selectedSortBy))
    },
    onCancel: () => {
      logAnalyticsEvent(Events.vama_rx_filter_cancel())
    },
    testID: 'ModalTestID',
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

  const hasNoItems = filteredPrescriptions?.length === 0

  const getTransferAlert = () => {
    if (!hasTransferred) {
      return <></>
    }

    const linkProps: LinkProps = {
      type: 'url',
      url: LINK_URL_GO_TO_PATIENT_PORTAL,
      text: t('goToMyVAHealth'),
      a11yLabel: a11yLabelVA(t('goToMyVAHealth')),
      variant: 'base',
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <AlertWithHaptics
          variant="warning"
          expandable={true}
          focusOnError={false}
          header={t('prescription.history.transferred.title')}
          description={t('prescription.history.transferred.instructions')}
          descriptionA11yLabel={a11yLabelVA(t('prescription.history.transferred.instructions'))}
          analytics={{
            onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()),
          }}>
          <TextView
            mt={theme.dimensions.standardMarginBetween}
            paragraphSpacing={true}
            accessibilityLabel={a11yLabelVA(t('prescription.history.transferred.youCan'))}>
            {t('prescription.history.transferred.youCan')}
          </TextView>
          <LinkWithAnalytics {...linkProps} />
        </AlertWithHaptics>
      </Box>
    )
  }

  const getRequestRefillButton = () => {
    return (
      <Box mx={theme.dimensions.buttonPadding}>
        <Button
          label={t('prescription.history.startRefillRequest')}
          onPress={() => navigateTo('RefillScreenModal', { refillRequestSummaryItems: undefined })}
        />
      </Box>
    )
  }

  const prescriptionListTitle = () => {
    const sortUppercase = getDisplayForValue(sortByOptions, sortByToUse)
    const keys = {
      count: filteredPrescriptions?.length,
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
            <TextView
              mt={theme.dimensions.condensedMarginBetween}
              mb={theme.dimensions.condensedMarginBetween}
              variant={'MobileBodyBold'}>
              {prescriptionListTitle()}
            </TextView>
            <TextView
              mb={theme.dimensions.standardMarginBetween}
              variant={'HelperText'}
              accessibilityLabel={a11yLabelVA(prescriptionListDescription())}>
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
      navigateTo('PrescriptionHelp')
    },
  }

  // ErrorComponent normally handles both downtime and error but only for 1 screenID.
  // In this case, we need to support multiple screen IDs
  return (
    <FeatureLandingTemplate
      scrollViewProps={{ scrollViewRef }}
      headerButton={headerButton}
      backLabel={t('health.title')}
      backLabelOnPress={navigation.goBack}
      title={t('prescription.title')}
      testID="PrescriptionHistory">
      {prescriptionInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.PRESCRIPTION_SCREEN_ID} />
      ) : loadingHistory || loadingUserAuthorizedServices ? (
        <LoadingComponent text={t('prescriptions.loading')} a11yLabel={t('prescriptions.loading.a11yLabel')} />
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID}
          error={getUserAuthorizedServicesError}
          onTryAgain={refetchAuthServices}
        />
      ) : !userAuthorizedServices?.prescriptions ? (
        <PrescriptionHistoryNotAuthorized />
      ) : hasError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.PRESCRIPTION_HISTORY_SCREEN_ID}
          error={hasError}
          onTryAgain={refetchPrescriptions}
        />
      ) : !allPrescriptions?.length ? (
        <PrescriptionHistoryNoPrescriptions />
      ) : (
        <>
          {getRequestRefillButton()}
          {getTransferAlert()}
          {getContent()}
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default PrescriptionHistory
