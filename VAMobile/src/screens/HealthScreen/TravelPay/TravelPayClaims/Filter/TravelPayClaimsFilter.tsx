import React, { useMemo } from 'react'

import { TravelPayClaimData } from 'api/types'
import { Box, BoxProps } from 'components'
import TravelClaimsFilterModal from 'screens/HealthScreen/TravelPay/TravelPayClaims/Filter/TravelPayClaimsFilterModal'
import { useTheme } from 'utils/hooks'
import { CheckboxOption, SortOptionType } from 'utils/travelPay'

type TravelPayClaimsFilterProps = {
  claims: Array<TravelPayClaimData>
  totalClaims: number
  filter: Set<string>
  onFilterChanged: (value: Set<string>) => void
  sortBy: SortOptionType
  onSortByChanged: (value: SortOptionType) => void
}

function TravelPayClaimsFilter({
  claims = [],
  totalClaims,
  filter,
  onFilterChanged,
  sortBy,
  onSortByChanged,
}: TravelPayClaimsFilterProps) {
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
      <Box mr={theme.dimensions.smallMarginBetween} mb={theme.dimensions.condensedMarginBetween}>
        <TravelClaimsFilterModal
          totalClaims={totalClaims}
          options={filterOptions}
          currentFilter={filter}
          onFilterChanged={onFilterChanged}
          currentSortBy={sortBy}
          onSortByChanged={onSortByChanged}
        />
      </Box>
    </Box>
  )
}

export default TravelPayClaimsFilter
