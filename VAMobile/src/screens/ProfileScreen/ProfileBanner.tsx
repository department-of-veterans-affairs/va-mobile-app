import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type ProfileBannerProps = {}

const ProfileBanner: FC<ProfileBannerProps> = ({}) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)

  const theme = useTheme()

  const name = profile?.fullName || ''
  const branch = mostRecentBranch || ''

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 50,
      height: 50,
    }

    switch (branch) {
      case BranchesOfServiceConstants.AirForce:
        return <VAIcon name="Airforce" {...dimensions} {...testIdProps('Airforce')} />
      case BranchesOfServiceConstants.Army:
        return <VAIcon name="Army" {...dimensions} {...testIdProps('Army')} />
      case BranchesOfServiceConstants.CoastGuard:
        return <VAIcon name="CoastGuard" {...dimensions} {...testIdProps('Coast-Guard')} />
      case BranchesOfServiceConstants.MarineCorps:
        return <VAIcon name="Marines" {...dimensions} {...testIdProps('Marine-Corps')} />
      case BranchesOfServiceConstants.Navy:
        return <VAIcon name="Navy" {...dimensions} {...testIdProps('Navy')} />
    }
  }

  return (
    <Box width="100%" backgroundColor="profileBanner" minHeight={85}>
      <Box p={theme.dimensions.cardPadding} display="flex" flexDirection="row">
        <Box {...testIdProps(`${branch}-seal`)} accessibilityRole="image">
          {getBranchSeal()}
        </Box>
        <Box ml={theme.dimensions.textXPadding} flex={1}>
          <TextView
            textTransform="capitalize"
            mb={theme.dimensions.textIconMargin}
            variant="BitterBoldHeading"
            color="primaryContrast"
            {...testIdProps(name)}
            accessibilityRole="text">
            {name}
          </TextView>
          <TextView textTransform="capitalize" variant="MobileBody" color="primaryContrast" {...testIdProps(branch)} accessibilityRole="text">
            {branch}
          </TextView>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileBanner
