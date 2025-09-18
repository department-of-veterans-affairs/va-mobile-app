import React, { Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimData } from 'api/types'
import { Box, BoxProps, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { CheckboxOption } from 'screens/HealthScreen/TravelPay/TravelPayClaims/TravelPayClaimsFilterCheckboxGroup'
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

  const filterOptions = useMemo(() => {
    // Allow filtering by any of the statuses that appear in the list
    const statusToCount: Map<string, number> = new Map()
    claims.forEach((claim) => {
      const status = claim.attributes.claimStatus
      const existingCount = statusToCount.get(status) ?? 0
      statusToCount.set(status, existingCount + 1)
    })

    const options = Array.from(statusToCount.keys()).map(
      (status) =>
        ({
          optionLabelKey: `${status} (${statusToCount.get(status)!})`,
          value: status,
        }) as CheckboxOption,
    )

    options.sort((a, b) => (a.value > b.value ? 1 : -1))

    return options
  }, [claims])

  return (
    <Box {...filterContainerProps}>
      <Box mr={8} mb={10}>
        <TravelClaimsFilterModal
          totalClaims={claims.length}
          options={filterOptions}
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
