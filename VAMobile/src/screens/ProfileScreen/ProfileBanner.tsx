import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, TextView, VAIcon } from 'components'
import { BranchesOfServiceConstants } from 'store/api/types'
import { DisabilityRatingState, MilitaryServiceState, PersonalInformationState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { testIdProps } from 'utils/accessibility'
import { useHasMilitaryInformationAccess } from 'utils/authorizationHooks'
import { useTheme } from 'utils/hooks'

/**
 *  Signifies the props that need to be passed in to {@link ProfileBanner}
 */
export type ProfileBannerProps = Record<string, unknown>

const ProfileBanner: FC<ProfileBannerProps> = ({ showRating = true }) => {
  const { profile } = useSelector<RootState, PersonalInformationState>((state) => state.personalInformation)
  const { mostRecentBranch } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { ratingData } = useSelector<RootState, DisabilityRatingState>((s) => s.disabilityRating)
  const accessToMilitaryInfo = useHasMilitaryInformationAccess()
  const { t } = useTranslation(NAMESPACE.PROFILE)

  const theme = useTheme()

  const name = profile?.fullName || ''
  const branch = mostRecentBranch || ''
  const ratingPercent = ratingData?.combinedDisabilityRating
  const combinedPercentText = ratingPercent !== undefined && ratingPercent !== null ? t('disabilityRating.combinePercent', { combinedPercent: ratingPercent }) : undefined
  const yourDisabilityRatingText = t('disabilityRating.yourRating')

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
        <Box ml={20} flex={1}>
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
            <TextView textTransform="capitalize" variant="MobileBodyBold" color="primaryContrast" {...testIdProps(branch)} accessibilityRole="text">
              {branch}
            </TextView>
          )}
          {ratingPercent !== undefined && ratingPercent !== null && showRating && (
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <TextView variant="MobileBody" color="primaryContrast" {...testIdProps(yourDisabilityRatingText)} accessibilityRole="text">
                {yourDisabilityRatingText}
              </TextView>
              <TextView variant="MobileBody" color="primaryContrast" {...testIdProps(combinedPercentText || '')} accessibilityRole="text">
                {combinedPercentText}
              </TextView>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProfileBanner
