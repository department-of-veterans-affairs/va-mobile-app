import { useSelector } from 'react-redux'
import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { DisabilityRatingState, MilitaryServiceState, PersonalInformationState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useTheme, useTranslation } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type ProfileBannerProps = Record<string, unknown>

const ProfileBanner: FC<ProfileBannerProps> = ({}) => {
  const { profile } = useSelector<StoreState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<StoreState, MilitaryServiceState>((s) => s.militaryService)
  const { ratingData } = useSelector<StoreState, DisabilityRatingState>((s) => s.disabilityRating)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const t = useTranslation(NAMESPACE.PROFILE)

  const theme = useTheme()

  const name = profile?.fullName || ''
  const branch = mostRecentBranch || ''
  const ratingPercent = ratingData?.combinedDisabilityRating

  const getBranchSeal = (): React.ReactNode => {
    if (!accessToMilitaryInfo) {
      return <></>
    }

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
    <Box width="100%" backgroundColor="profileBanner" minHeight={85} display="flex" justifyContent="center">
      <Box py={accessToMilitaryInfo ? theme.dimensions.cardPadding : 0} display="flex" flexDirection="row">
        {accessToMilitaryInfo && (
          <Box pl={theme.dimensions.cardPadding} {...testIdProps(`${branch}-seal`)} accessibilityRole="image">
            {getBranchSeal()}
          </Box>
        )}
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
          {accessToMilitaryInfo && (
            <TextView textTransform="capitalize" variant="MobileBody" color="primaryContrast" {...testIdProps(branch)} accessibilityRole="text">
              {branch}
            </TextView>
          )}
          {ratingPercent !== undefined && (
            <TextView textTransform="capitalize" variant="MobileBody" color="primaryContrast" {...testIdProps('combined-rating-percent')} accessibilityRole="text">
              {t('disabilityRating.combinePercent', { combinedPercent: ratingPercent })}
            </TextView>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileBanner
