import React, { Dispatch, SetStateAction, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimData } from 'api/types'
import { Box, BoxProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import TravelClaimsFilterModal from './TravelPayClaimsFilterModal'

type TravelPayClaimsFilterProps = {
  claims: Array<TravelPayClaimData>
  filter: Set<string>,
  setFilter: Dispatch<SetStateAction<Set<string>>>
  sortBy: SortOptionType
  setSortBy: Dispatch<SetStateAction<SortOptionType>>
}

export type SortOptionType = 'recent' | 'oldest'

export const SortOption: {
  Recent: SortOptionType
  Oldest: SortOptionType
} = {
  Recent: 'recent',
  Oldest: 'oldest',
}

function TravelClaimsFilter({
  claims = [],
  filter,
  setFilter,
  sortBy,
  setSortBy
}: TravelPayClaimsFilterProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const filterContainerProps: BoxProps = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    mx: theme.dimensions.gutter,
    mb: theme.dimensions.standardMarginBetween,
  }

  const onClearFiltersPress = () => setFilter(new Set());

  const filterModal = () => {
    return (
      <Box {...filterContainerProps}>
        <Box mr={8} mb={10}>
          <TravelClaimsFilterModal
            claims={claims}
            currentFilter={filter}
            setCurrentFilter={setFilter}
            currentSortBy={sortBy}
            setCurrentSortBy={setSortBy}
          />
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

export default TravelClaimsFilter
