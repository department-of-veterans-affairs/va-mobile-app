import React, { FC } from 'react'
import styled from 'styled-components/native'

import { Box, TextView, VAIcon } from 'components'
import { MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { View } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

const StyledOuterView = styled.View`
  width: 100%;
  background-color: ${themeFn((t) => t.colors.background.profileBanner)};
  min-height: 85px;
`

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
    <StyledOuterView>
      <Box p={theme.dimensions.gutter} display="flex" flexDirection="row">
        <View {...testIdProps(`${branch}-seal`)} accessibilityRole="image">
          {getBranchSeal()}
        </View>
        <Box ml={theme.dimensions.profileBannerIconMargin} flex={1}>
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
    </StyledOuterView>
  )
}

export default ProfileBanner
