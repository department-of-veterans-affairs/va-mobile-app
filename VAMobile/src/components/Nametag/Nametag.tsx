import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { BackgroundVariant, Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState, PersonalInformationState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { Pressable } from 'react-native'
import { RootState } from 'store'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

export const Nametag: FC = () => {
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

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
    <Pressable
      onPress={navigateTo('VeteranStatus')}
      accessibilityRole={'button'}
      accessibilityLabel={name() + ' ' + branch + ' ' + t('veteranStatus.title')}
      // accessibilityLabel: uri ? t('veteranStatus.editPhoto') : t('veteranStatus.uploadPhoto'),
    >
      <Box
        width="100%"
        backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
        minHeight={85}
        display="flex"
        justifyContent="center"
        mb={theme.dimensions.standardMarginBetween}
        pr={theme.dimensions.cardPadding}>
        <Box py={accessToMilitaryInfo ? theme.dimensions.cardPadding : 0} display="flex" flexDirection="row">
          {accessToMilitaryInfo && <Box pl={theme.dimensions.cardPadding}>{getBranchSeal()}</Box>}
          <Box ml={theme.dimensions.cardPadding} flex={1}>
            <TextView textTransform="capitalize" mb={theme.dimensions.textIconMargin} variant="BitterBoldHeading" color="primaryContrast">
              {name()}
            </TextView>
            {accessToMilitaryInfo && (
              <TextView textTransform="capitalize" variant="MobileBodyBold" color="primaryContrast">
                {branch}
              </TextView>
            )}
            <Box flexDirection={'row'} alignItems={'center'} mt={theme.dimensions.standardMarginBetween}>
              <TextView variant="MobileBody" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                {t('veteranStatus.title')}
              </TextView>
              <VAIcon
                name={'ChevronRight'}
                fill={theme.colors.icon.contrast}
                width={theme.dimensions.chevronListItemWidth}
                height={theme.dimensions.chevronListItemHeight}
                mr={theme.dimensions.listItemDecoratorMarginLeft}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Pressable>
  )
}

export default Nametag
