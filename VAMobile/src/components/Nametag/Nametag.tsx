import React, { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BranchesOfServiceConstants, ServiceHistoryData } from 'api/types'
import { BackgroundVariant, Box, TextView, VAIcon } from 'components'
import { Events, UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export const Nametag: FC = () => {
  const { data: militaryServiceHistoryAttributes } = useServiceHistory()
  const serviceHistory = militaryServiceHistoryAttributes?.serviceHistory || ([] as ServiceHistoryData)
  const mostRecentBranch = militaryServiceHistoryAttributes?.mostRecentBranch
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
      logAnalyticsEvent(Events.vama_vet_status_shown())
    } else if (service.honorableServiceIndicator === 'N') {
      logAnalyticsEvent(Events.vama_vet_status_nStatus())
    } else if (service.honorableServiceIndicator === 'Z') {
      logAnalyticsEvent(Events.vama_vet_status_zStatus(service.characterOfDischarge))
    }
  })

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

  const pressableProps: PressableProps = {
    onPress: () => (accessToMilitaryInfo && showVeteranStatus ? navigateTo('VeteranStatus') : undefined),
    accessibilityRole: accessToMilitaryInfo ? 'button' : undefined,
    accessibilityLabel: accessToMilitaryInfo ? `${fullName} ${branch} ${t('veteranStatus.proofOf')}` : undefined,
  }

  return (
    <Pressable {...pressableProps}>
      <Box
        width="100%"
        backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
        minHeight={accessToMilitaryInfo || fullName ? 85 : undefined}
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
}

export default Nametag
