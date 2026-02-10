import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, PressableProps } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { colors } from '@department-of-veterans-affairs/mobile-tokens'

import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { BackgroundVariant, Box, TextView } from 'components'
import VASeal from 'components/VAIcon/svgs/VASeal.svg'
import { UserAnalytics } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { setAnalyticsUserProperty } from 'utils/analytics'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export const Nametag = () => {
  const { data: personalInfo } = usePersonalInformation()
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

  const pressableProps: PressableProps = {
    onPress: () => navigateTo('VeteranStatus'),
    accessibilityRole: 'link',
    accessibilityLabel: t('veteranStatus.title'),
    style: ({ pressed }) => [
      {
        backgroundColor: pressed
          ? theme.colors.background.listActive
          : (theme.colors.background.veteranStatusHome as BackgroundVariant),
        justifyContent: 'center',
        minHeight: 82,
        paddingLeft: theme.dimensions.buttonPadding,
        borderRadius: 8,
        marginBottom: theme.dimensions.standardMarginBetween,
        paddingRight: theme.dimensions.buttonPadding,
        marginHorizontal: theme.dimensions.condensedMarginBetween,
        shadowColor: colors.vadsColorBlack,
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
      <Pressable {...pressableProps} testID="veteranStatusButtonID">
        <Box py={theme.dimensions.buttonPadding} pr={8} flexDirection="row" alignItems="center">
          <Icon svg={VASeal} width={40} height={40} testID="VASeal" preventScaling />
          <Box ml={theme.dimensions.buttonPadding} flex={1}>
            <Box flexDirection="row" alignItems="center">
              <TextView variant="VeteranStatusProof" mr={theme.dimensions.textIconMargin}>
                {t('veteranStatus.title')}
              </TextView>
            </Box>
          </Box>
          <Box ml={theme.dimensions.listItemDecoratorMarginLeft}>
            <Icon
              name={'ChevronRight'}
              fill={theme.colors.icon.linkRow}
              width={theme.dimensions.chevronListItemWidth}
              height={theme.dimensions.chevronListItemHeight}
              preventScaling={true}
            />
          </Box>
        </Box>
      </Pressable>
    </Box>
  )
}

export default Nametag
