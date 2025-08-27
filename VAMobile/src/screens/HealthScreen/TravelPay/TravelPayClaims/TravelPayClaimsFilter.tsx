import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, TextView } from 'components'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

type TravelPayClaimsFilterProps = {
  totalClaims: number
  selectedFilter: string
  setSelectedFilter: Dispatch<SetStateAction<string>>
  selectedSortBy: string
  setSelectedSortBy: Dispatch<SetStateAction<string>>
}

type FilterOptionType = 'all' | 'paid' | 'denied'

const FilterOption: {
  All: FilterOptionType
  Paid: FilterOptionType
  Denied: FilterOptionType
} = {
  All: 'all',
  Paid: 'paid',
  Denied: 'denied',
}

type SortOptionType = 'recent' | 'oldest'

const SortOption: {
  Recent: SortOptionType
  Oldest: SortOptionType
} = {
  Recent: 'recent',
  Oldest: 'oldest',
}

function TravelPayClaimsFilter({
  totalClaims,
  selectedFilter,
  setSelectedFilter,
  selectedSortBy,
  setSelectedSortBy,
}: TravelPayClaimsFilterProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // TODO 112328: need to replace with actual data from props or state
  const currentFilter = 'All'
  const currentSort = 'most recent'

  const travelClaimsListTitle = () => {
    const keys = {
      count: totalClaims,
      filter: currentFilter,
      sort: currentSort,
    }

    return t('travelPay.statusList.list.title', keys)
  }

  // TODO 112328: add modal props
  const modalProps: RadioGroupModalProps = {
    groups: [
      {
        items: [
          { optionLabelKey: t('travelPay.statusList.filterOption.all'), value: FilterOption.All },
          { optionLabelKey: t('travelPay.statusList.filterOption.paid'), value: FilterOption.Paid },
          { optionLabelKey: t('travelPay.statusList.filterOption.denied'), value: FilterOption.Denied },
        ],
        onSetOption: (newFilter: string) => {
          setSelectedFilter(newFilter)
        },
        selectedValue: selectedFilter,
        title: t('travelPay.statusList.filterBy'),
      },
      {
        items: [
          { optionLabelKey: t('travelPay.statusList.sortOption.recent'), value: SortOption.Recent },
          { optionLabelKey: t('travelPay.statusList.sortOption.oldest'), value: SortOption.Oldest },
        ],
        onSetOption: (newSortBy: string) => {
          setSelectedSortBy(newSortBy)
        },
        selectedValue: selectedSortBy,
        title: t('travelPay.statusList.sortBy'),
      },
    ],
    buttonText: t('travelPay.statusList.filterAndSort'),
    buttonA11yLabel: t('travelPay.statusList.filterAndSort'),
    buttonTestID: 'openFilterAndSortTestID',
    headerText: t('travelPay.statusList.filterAndSort'),
    onApply: () => {}, // TODO 112328: add apply logic
    onCancel: () => {}, // TODO 112328: add cancel logic
    testID: 'TravelPayFilterModalTestID',
  }

  const filterContainerProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.standardMarginBetween,
  }

  const onClearFiltersPress = () => {} // TODO 112328: add clear filters functionality

  const filterModal = () => {
    return (
      <Box {...filterContainerProps}>
        <Box mr={8} mb={10}>
          <RadioGroupModal {...modalProps} />
        </Box>
        <TextView
          onPress={onClearFiltersPress}
          accessibilityRole="button"
          accessibilityLabel={t('travelPay.statusList.clearFilters')}
          accessibilityHint={t('travelPay.statusList.clearFilters.a11yHint')}
          color="link"
          testID="clearFiltersButton">
          {t('travelPay.statusList.clearFilters')}
        </TextView>
      </Box>
    )
  }

  return (
    <Box>
      <Box mx={theme.dimensions.gutter} accessible={true}>
        <TextView
          mt={theme.dimensions.condensedMarginBetween}
          mb={theme.dimensions.condensedMarginBetween}
          accessibilityRole="header"
          variant={'MobileBodyBold'}>
          {travelClaimsListTitle()}
        </TextView>
      </Box>
      {/* Filter and Sort Section */}
      {filterModal()}
    </Box>
  )
}

export default TravelPayClaimsFilter
