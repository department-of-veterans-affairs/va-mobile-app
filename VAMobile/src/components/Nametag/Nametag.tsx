import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'
import { useSelector } from 'react-redux'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BackgroundVariant, Box, ColorVariant, TextView, VAIcon } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState } from 'store/slices'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

interface NametagProps {
  /** string for differentiating visual design between home/profile */
  screen: string
}

export const Nametag: FC<NametagProps> = ({ screen }: NametagProps) => {
  const { mostRecentBranch, serviceHistory } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)

  useEffect(() => {
    if (personalInfo) {
      setAnalyticsUserProperty(
        UserAnalytics.vama_cerner_transition(personalInfo.hasFacilityTransitioningToCerner || false),
      )
    }
  }, [personalInfo])

  const fullName = personalInfo?.fullName

  const branch = mostRecentBranch || ''

  let showVeteranStatus = false
  serviceHistory.forEach((service) => {
    if (service.honorableServiceIndicator === 'Y') {
      showVeteranStatus = true
    }
  })

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: screen === 'Home' ? 40 : 50,
      height: screen === 'Home' ? 40 : 50,
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

  const pressableProps: PressableProps = {
    onPress: () => (accessToMilitaryInfo && showVeteranStatus ? navigateTo('VeteranStatus') : undefined),
    accessibilityRole: accessToMilitaryInfo ? 'button' : undefined,
    accessibilityLabel:
      accessToMilitaryInfo && screen === 'Profile'
        ? `${fullName} ${branch} ${t('veteranStatus.proofOf')}`
        : accessToMilitaryInfo && screen === 'Home'
          ? `${branch} ${t('veteranStatus.proofOf')}`
          : undefined,
  }

  if (screen === 'Profile') {
    return (
      <Pressable {...pressableProps}>
        <Box
          width="100%"
          backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
          minHeight={85}
          display="flex"
          justifyContent="center"
          mb={theme.dimensions.standardMarginBetween}
          pr={theme.dimensions.cardPadding}>
          <Box py={theme.dimensions.cardPadding} display="flex" flexDirection="row">
            {accessToMilitaryInfo && <Box pl={theme.dimensions.cardPadding}>{getBranchSeal()}</Box>}
            <Box ml={theme.dimensions.cardPadding} flex={1}>
              <TextView
                textTransform="capitalize"
                mb={accessToMilitaryInfo ? theme.dimensions.textIconMargin : 0}
                variant="BitterBoldHeading"
                color="primaryContrast">
                {fullName}
              </TextView>
              {accessToMilitaryInfo && (
                <TextView textTransform="capitalize" variant="MobileBodyBold" color="primaryContrast">
                  {branch}
                </TextView>
              )}
              {accessToMilitaryInfo && showVeteranStatus && (
                <Box flexDirection={'row'} alignItems={'center'} mt={theme.dimensions.standardMarginBetween}>
                  <TextView variant="MobileBody" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                    {t('veteranStatus.proofOf')}
                  </TextView>
                  <VAIcon
                    name={'ChevronRight'}
                    fill={theme.colors.icon.contrast}
                    width={theme.dimensions.chevronListItemWidth}
                    height={theme.dimensions.chevronListItemHeight}
                    mr={theme.dimensions.listItemDecoratorMarginLeft}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Pressable>
    )
  } else if (screen === 'Home') {
    return (
      <Box>
        <Pressable {...pressableProps}>
          <Box
            pl={theme.dimensions.buttonPadding}
            backgroundColor={theme.colors.background.veteranStatusHome as BackgroundVariant}
            minHeight={82}
            display="flex"
            justifyContent="center"
            mb={theme.dimensions.standardMarginBetween}
            pr={theme.dimensions.cardPadding}
            mx={theme.dimensions.gutter}
            borderRadius={8}
            flex={1}>
            <Box py={theme.dimensions.cardPadding} display="flex" flexDirection="row" alignItems="center">
              {getBranchSeal()}
              <Box ml={theme.dimensions.cardPadding} flex={1}>
                <TextView
                  textTransform="capitalize"
                  variant="MobileBody"
                  color={theme.colors.text.veteranStatusHome as ColorVariant}>
                  {branch}
                </TextView>
                {showVeteranStatus && (
                  <Box flexDirection={'row'} alignItems={'center'}>
                    <TextView variant="MobileBody" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
                      {t('veteranStatus.proofOf')}
                    </TextView>
                  </Box>
                )}
              </Box>
              <VAIcon
                name={'ChevronRight'}
                fill={theme.colors.icon.contrast}
                width={theme.dimensions.chevronListItemWidth}
                height={theme.dimensions.chevronListItemHeight}
                ml={theme.dimensions.listItemDecoratorMarginLeft}
              />
            </Box>
          </Box>
        </Pressable>
      </Box>
    )
  } else {
    return <></>
  }
}

export default Nametag
