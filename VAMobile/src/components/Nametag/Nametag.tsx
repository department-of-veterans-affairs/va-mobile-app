import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, PressableProps } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useServiceHistory } from 'api/militaryService'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BackgroundVariant, Box, MilitaryBranchEmblem, TextView } from 'components'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import colors from 'styles/themes/VAColors'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export const Nametag = () => {
  const { data: userAuthorizedServices } = useAuthorizedServices()
  const { data: personalInfo } = usePersonalInformation()
  const { data: serviceHistory } = useServiceHistory({ enabled: false })
  const accessToMilitaryInfo =
    userAuthorizedServices?.militaryServiceHistory && !!serviceHistory?.serviceHistory?.length
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const branch = serviceHistory?.mostRecentBranch || ''

  useEffect(() => {
    if (personalInfo) {
      setAnalyticsUserProperty(
        UserAnalytics.vama_cerner_transition(personalInfo.hasFacilityTransitioningToCerner || false),
      )
    }
  }, [personalInfo])

  const showVeteranStatus = !!serviceHistory?.serviceHistory?.find(
    (service) => service.honorableServiceIndicator === 'Y',
  )

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
    style: ({ pressed }) => [
      {
        backgroundColor: pressed
          ? theme.colors.background.listActive
          : (theme.colors.background.veteranStatusHome as BackgroundVariant),
        justifyContent: 'center',
        minHeight: accessToMilitaryInfo ? 82 : undefined,
        paddingLeft: theme.dimensions.buttonPadding,
        borderRadius: 8,
        marginBottom: theme.dimensions.standardMarginBetween,
        paddingRight: theme.dimensions.buttonPadding,
        marginHorizontal: theme.dimensions.condensedMarginBetween,
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
    ],
  }

  return (
    <Box>
      {accessToMilitaryInfo && branch !== '' && (
        <Pressable {...pressableProps} testID="veteranStatusButtonID">
          <Box py={theme.dimensions.buttonPadding} pr={8} flexDirection="row" alignItems="center">
            <MilitaryBranchEmblem branch={branch} width={40} height={40} />
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
              <Box ml={theme.dimensions.listItemDecoratorMarginLeft}>
                <Icon
                  name={'ChevronRight'}
                  fill={theme.colors.icon.linkRow}
                  width={theme.dimensions.chevronListItemWidth}
                  height={theme.dimensions.chevronListItemHeight}
                  preventScaling={true}
                />
              </Box>
            )}
          </Box>
        </Pressable>
      )}
    </Box>
  )
}

export default Nametag
