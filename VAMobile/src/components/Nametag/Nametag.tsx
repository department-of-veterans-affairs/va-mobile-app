import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState, PersonalInformationState } from 'store/slices'
import { RootState } from 'store'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useTheme } from 'utils/hooks'

export const Nametag: FC = () => {
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const theme = useTheme()

  const name = (): string => {
    return profile?.fullName || ''
  }
  const branch = mostRecentBranch || ''

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 50,
      height: 50,
    }

    switch (branch) {
      case BranchesOfServiceConstants.AirForce:
        return <VAIcon testID="United States Air Force" name="AirForce" {...dimensions} />
      case BranchesOfServiceConstants.Army:
        return <VAIcon testID="United States Army" name="Army" {...dimensions} />
      case BranchesOfServiceConstants.CoastGuard:
        return <VAIcon testID="United States Coast Guard" name="CoastGuard" {...dimensions} />
      case BranchesOfServiceConstants.MarineCorps:
        return <VAIcon testID="United States Marine Corps" name="MarineCorps" {...dimensions} />
      case BranchesOfServiceConstants.Navy:
        return <VAIcon testID="United States Navy" name="Navy" {...dimensions} />
    }
  }

  return (
    <Box width="100%" backgroundColor="profileBanner" minHeight={85} display="flex" justifyContent="center" mb={theme.dimensions.standardMarginBetween} accessible={true}>
      <Box py={accessToMilitaryInfo ? theme.dimensions.cardPadding : 0} display="flex" flexDirection="row">
        {accessToMilitaryInfo && <Box pl={theme.dimensions.cardPadding}>{getBranchSeal()}</Box>}
        <Box ml={20} flex={1}>
          <TextView textTransform="capitalize" mb={theme.dimensions.textIconMargin} variant="BitterBoldHeading" color="primaryContrast">
            {name()}
          </TextView>
          {accessToMilitaryInfo && (
            <TextView textTransform="capitalize" variant="MobileBodyBold" color="primaryContrast">
              {branch}
            </TextView>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default Nametag
