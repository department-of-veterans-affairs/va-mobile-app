import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, PressableProps } from 'react-native'
import { useSelector } from 'react-redux'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BackgroundVariant, Box, BoxProps, TextView, VAIcon } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { BranchesOfServiceConstants } from 'store/api/types'
import { MilitaryServiceState } from 'store/slices'
import colors from 'styles/themes/VAColors'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export const Nametag = () => {
  const { mostRecentBranch, serviceHistory } = useSelector<RootState, MilitaryServiceState>((s) => s.militaryService)

  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const accessToMilitaryInfo = userAuthorizedServices?.militaryServiceHistory && serviceHistory.length > 0
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const branch = mostRecentBranch || ''

  useEffect(() => {
    if (personalInfo) {
      setAnalyticsUserProperty(
        UserAnalytics.vama_cerner_transition(personalInfo.hasFacilityTransitioningToCerner || false),
      )
    }
  }, [personalInfo])

  let showVeteranStatus = false
  serviceHistory.forEach((service) => {
    if (service.honorableServiceIndicator === 'Y') {
      showVeteranStatus = true
    }
  })

  const getBranchSeal = (): React.ReactNode => {
    const dimensions = {
      width: 40,
      height: 40,
      preventScaling: true,
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

  let accLabel
  if (!accessToMilitaryInfo) {
    accLabel = undefined
  } else {
    accLabel = showVeteranStatus ? `${branch} ${t('veteranStatus.proofOf')}` : branch
  }

  const pressableProps: PressableProps = {
    onPress: () => (accessToMilitaryInfo && showVeteranStatus ? navigateTo('VeteranStatus') : undefined),
    accessibilityRole: accessToMilitaryInfo && showVeteranStatus ? 'link' : 'text',
    accessibilityLabel: accLabel,
  }

  const boxProps: BoxProps = {
    pl: theme.dimensions.buttonPadding,
    backgroundColor: theme.colors.background.veteranStatusHome as BackgroundVariant,
    minHeight: 82,
    display: 'flex',
    justifyContent: 'center',
    mb: theme.dimensions.standardMarginBetween,
    pr: theme.dimensions.buttonPadding,
    mx: theme.dimensions.condensedMarginBetween,
    borderRadius: 8,
    style: {
      shadowColor: colors.black,
      ...Platform.select({
        ios: {
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        },
        android: {
          elevation: 8,
        },
      }),
    },
  }

  return (
    <Box>
      {accessToMilitaryInfo && (
        <Pressable {...pressableProps}>
          <Box {...boxProps}>
            <Box py={theme.dimensions.buttonPadding} pr={8} flexDirection="row" alignItems="center">
              {getBranchSeal()}
              <Box ml={theme.dimensions.buttonPadding} flex={1}>
                <TextView variant={'VeteranStatusBranch'} pb={4}>
                  {branch}
                </TextView>
                {showVeteranStatus && (
                  <Box flexDirection={'row'} alignItems={'center'}>
                    <TextView variant={'VeteranStatusProof'} mr={theme.dimensions.textIconMargin}>
                      {t('veteranStatus.proofOf')}
                    </TextView>
                  </Box>
                )}
              </Box>
              {showVeteranStatus && (
                <VAIcon
                  name={'ChevronRight'}
                  fill={theme.colors.icon.linkRow}
                  width={theme.dimensions.chevronListItemWidth}
                  height={theme.dimensions.chevronListItemHeight}
                  preventScaling={true}
                  ml={theme.dimensions.listItemDecoratorMarginLeft}
                />
              )}
            </Box>
          </Box>
        </Pressable>
      )}
    </Box>
  )
}

export default Nametag
