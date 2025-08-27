import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, TextView } from 'components'
import RadioGroupModal, { RadioGroupModalProps } from 'components/RadioGroupModal'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { TravelPayClaimData } from 'api/types'
import { TravelClaimsFilter } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsScreen'

type TravelPayClaimsFilterProps = {
  claims: Array<TravelPayClaimData>
  setClaimsFilter: Dispatch<SetStateAction<TravelClaimsFilter>>
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
  claims = [],
  setClaimsFilter,
}: TravelPayClaimsFilterProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const [selectedFilter, setSelectedFilter] = useState<TravelClaimsFilter>({
    filter: '',
    sortBy: '',
  })

  const totalClaims = claims.length;

  // Allow filtering by any of the statuses that appear in the list, and 'All'
  const statusToCount: Map<string, number> = new Map();
  claims.forEach(claim => {
    const status = claim.attributes.claimStatus;
    const existingCount = statusToCount.get(status) ?? 0;
    statusToCount.set(status, existingCount + 1);
  })

  const filterOptions = Array.from(statusToCount.keys()).map(status => ({
    optionLabelKey: `${status} (${statusToCount.get(status)!})`,
    value: status,
  }));
  filterOptions.sort((a, b) => a.optionLabelKey > b.optionLabelKey ? 1 : -1);
  filterOptions.unshift({ optionLabelKey: `${t('travelPay.statusList.filterOption.all')} (${totalClaims})`, value: 'all' }) // TODO: Union const

  const modalProps: RadioGroupModalProps = {
    groups: [
      {
        items: filterOptions,
        onSetOption: (filter: string) => setSelectedFilter(prev => ({ filter: filter, sortBy: prev.sortBy })),
        selectedValue: selectedFilter.filter,
        title: t('travelPay.statusList.filterBy'),
      },
      {
        items: [
          { optionLabelKey: t('travelPay.statusList.sortOption.recent'), value: SortOption.Recent },
          { optionLabelKey: t('travelPay.statusList.sortOption.oldest'), value: SortOption.Oldest },
        ],
        onSetOption: (sortBy: string) => setSelectedFilter(prev => ({ filter: prev.filter, sortBy: sortBy })),
        selectedValue: selectedFilter.sortBy,
        title: t('travelPay.statusList.sortBy'),
      },
    ],
    buttonText: t('travelPay.statusList.filterAndSort'),
    buttonA11yLabel: t('travelPay.statusList.filterAndSort'),
    buttonTestID: 'openFilterAndSortTestID',
    headerText: t('travelPay.statusList.filterAndSort'),
    onApply: () => setClaimsFilter(selectedFilter),
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
      {/* Filter and Sort Section */}
      {filterModal()}
    </Box>
  )
}

export default TravelPayClaimsFilter
