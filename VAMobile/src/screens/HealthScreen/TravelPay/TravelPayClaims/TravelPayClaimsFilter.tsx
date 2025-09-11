import React, { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimData } from 'api/types'
import { Box, BoxProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import TravelClaimsFilterModal from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterModal'
import { useTheme } from 'utils/hooks'

type TravelPayClaimsFilterProps = {
  claims: Array<TravelPayClaimData>
  filter: Set<string>
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

function TravelPayClaimsFilter({ claims = [], filter, setFilter, sortBy, setSortBy }: TravelPayClaimsFilterProps) {
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

  const onClearFiltersPress = () => setFilter(new Set())

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

export default TravelPayClaimsFilter
