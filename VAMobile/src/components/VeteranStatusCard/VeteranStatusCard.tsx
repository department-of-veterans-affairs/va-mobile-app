import { Pressable, ViewStyle } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState, PersonalInformationState } from 'store/slices'
import { RootState } from 'store'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export const VeteranStatusCard: FC = () => {
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()

  const name = (): string => {
    return profile?.fullName || ''
  }
  const branch = mostRecentBranch || ''

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 34,
      height: 34,
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

  const vaTitle = ' VA '

  //   <Pressable
  //   style={pressableStyles}
  //   onPress={_onPress}
  //   onPressIn={_onPressIn}
  //   onPressOut={_onPressOut}
  //   accessible={true}
  //   accessibilityRole={'menuitem'}
  //   testID={title}
  //   accessibilityLabel={accessibilityLabel}
  //   {...a11yHintProp(a11yHint || '')}>
  //   <Box flex={1}>
  //     <Box flexDirection={'row'} flexWrap={'wrap'} mb={subText ? theme.dimensions.condensedMarginBetween : undefined}>
  //       <TextView mr={theme.dimensions.condensedMarginBetween} variant="BitterBoldHeading" color={textColor}>
  //         {title}
  //       </TextView>
  //       {!!tagCount && <MessagesCountTag unread={tagCount} />}
  //     </Box>
  //     {subText && (
  //       <TextView variant={'MobileBody'} color={textColor}>
  //         {subText}
  //       </TextView>
  //     )}
  //   </Box>
  //   <VAIcon name="ChevronRight" fill={`${iconColor ? iconColor : 'largeNav'}`} width={10} height={15} ml={theme.dimensions.listItemDecoratorMarginLeft} />
  // </Pressable>

  const pressableStyles: ViewStyle = {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  }

  return (
    <Pressable style={pressableStyles} onPress={navigateTo('VeteranStatus')}>
      <Box flex={1} backgroundColor="profileBanner" accessible={true} mb={theme.dimensions.standardMarginBetween} mx={16}>
        <Box py={accessToMilitaryInfo ? theme.dimensions.cardPadding : 0} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
          <Box flexDirection={'row'} justifyContent={'space-between'}>
            <TextView mb={theme.dimensions.textIconMargin} variant="VAHeader" color="primaryContrast" ml={15}>
              {vaTitle}
            </TextView>
            <TextView variant="MobileBody" color="primaryContrast" ml={5}>
              Veteran Status
            </TextView>
          </Box>
          <VAIcon
            name={'ChevronRight'}
            fill={theme.colors.icon.contrast}
            width={theme.dimensions.chevronListItemWidth}
            height={theme.dimensions.chevronListItemHeight}
            mr={theme.dimensions.listItemDecoratorMarginLeft}
          />
        </Box>
        <Box ml={20} flex={1} mb={theme.dimensions.standardMarginBetween}>
          <TextView textTransform="capitalize" mb={theme.dimensions.textIconMargin} variant="BitterBoldHeading" color="primaryContrast">
            {name()}
          </TextView>
          {accessToMilitaryInfo && (
            <Box display="flex" flexDirection="row">
              {getBranchSeal()}
              <TextView ml={10} variant="MobileBody" color="primaryContrast">
                {branch}
              </TextView>
            </Box>
          )}
        </Box>
      </Box>
    </Pressable>
  )
}

export default VeteranStatusCard
