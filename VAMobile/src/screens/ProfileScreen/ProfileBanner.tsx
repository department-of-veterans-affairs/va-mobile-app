import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useSelector } from 'react-redux'
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
      case 'United States Air Force':
        return <VAIcon name="Airforce" {...dimensions} {...testIdProps('Airforce')} />
      case 'United States Army':
        return <VAIcon name="Army" {...dimensions} {...testIdProps('Army')} />
      case 'United States Coastal Guard':
        return <VAIcon name="CoastGuard" {...dimensions} {...testIdProps('Coast-Guard')} />
      case 'United States Marine Corps':
        return <VAIcon name="Marines" {...dimensions} {...testIdProps('Marine-Corps')} />
      case 'United States Navy':
        return <VAIcon name="Navy" {...dimensions} {...testIdProps('Navy')} />
    }
  }

  return (
    <Box width="100%" backgroundColor="profileBanner" minHeight={85}>
      <Box p={theme.dimensions.cardPadding} display="flex" flexDirection="row">
        <View {...testIdProps(`${branch}-seal`)} accessibilityRole="image">
          {getBranchSeal()}
        </View>
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
