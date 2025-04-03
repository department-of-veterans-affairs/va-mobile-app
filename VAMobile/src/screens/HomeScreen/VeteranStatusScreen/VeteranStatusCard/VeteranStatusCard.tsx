import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { BranchOfService } from 'api/types'
import { BackgroundVariant, Box, TextView } from 'components'
import VASeal from 'components/VAIcon/svgs/VASeal.svg'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

// Constants for layout/orientation
const LANDSCAPE_PADDING = 44
const PORTRAIT_PADDING = 18

const MAX_WIDTH = 672

const EMBLEM_SIZE_LANDSCAPE = 82
const EMBLEM_SIZE_PORTRAIT = 50

type VeteranStatusCardProps = {
  /** Displayed name of the Veteran */
  fullName?: string

  /** DOD ID number (EDIPI) */
  edipi?: string | null | undefined

  /** The user’s most recent branch (e.g., "Army") */
  branch: BranchOfService | string

  /** Optional combined rating text (e.g. “50%”) */
  percentText?: string

  /** Function to get the "latest period of service" JSX */
  getLatestPeriodOfService: () => React.ReactNode
}

/**
 * A self-contained component that displays the Veteran Status Card UI.
 * Orientation- and platform-specific constants are defined within this file,
 * so you only need to pass the core data.
 */
export function VeteranStatusCard({ fullName, edipi, percentText, getLatestPeriodOfService }: VeteranStatusCardProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const isPortrait = useOrientation()
  const isLandscape = !isPortrait

  // Compute layout values based on orientation
  const horizontalPadding = isPortrait ? PORTRAIT_PADDING : LANDSCAPE_PADDING
  const emblemSize = isPortrait ? EMBLEM_SIZE_PORTRAIT : EMBLEM_SIZE_LANDSCAPE

  // For positioning emblem
  const emblemOffset = -emblemSize / 2

  // If landscape, we add MAX_WIDTH & center the box
  const containerStyle = isLandscape ? { maxWidth: MAX_WIDTH, alignSelf: 'center' as const } : {}

  // Orientation variants for fonts
  const titleVariant = isPortrait ? 'VeteranStatusCardHeaderPortraitBold' : 'VeteranStatusCardHeaderLandscapeBold'
  const headerVariant = isPortrait ? 'HelperTextBold' : 'MobileBodyBold'
  const helperVariant = isPortrait ? 'HelperText' : 'VeteranStatusProof'

  // zIndex for VASeal icon
  const VASealStyle = { zIndex: 2 }

  // VASeal SVG
  const VASealProps = {
    svg: VASeal,
    height: emblemSize,
    width: emblemSize,
    testID: 'VeteranStatusCardVAIcon',
    preventScaling: true,
  } as IconProps

  const titleStyle = {
    paddingTop: 16,
    paddingLeft: 16,
    paddingBottom: 8,
    paddingRight: 80,
  }

  const dropShadowStyle = {
    backgroundColor: theme.colors.background.veteranStatus,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3.75 },
    shadowOpacity: 0.25,
    shadowRadius: 3.75,
    elevation: 3.75,
  }

  return (
    <Box
      style={containerStyle}
      position="relative"
      width="100%"
      px={horizontalPadding}
      pt={theme.dimensions.contentMarginTop}
      borderRadius={15}>
      <Box
        alignItems="flex-start"
        justifyContent="center"
        backgroundColor={theme.colors.background.carousel as BackgroundVariant}
        borderRadiusTop={15}
        style={titleStyle}>
        <TextView accessibilityRole="header" color="primaryContrast" variant={titleVariant}>
          {t('veteranStatus.title')}
        </TextView>
      </Box>

      <View style={VASealStyle}>
        <Box
          accessible={true}
          accessibilityRole="image"
          accessibilityLabel={t('veteranStatus.imageDescription')}
          right={theme.dimensions.standardMarginBetween}
          alignSelf="flex-end"
          mt={emblemOffset}>
          <Icon {...VASealProps} />
        </Box>
      </View>

      <Box
        backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
        borderRadiusBottom={15}
        mt={emblemOffset}
        px={16}
        style={dropShadowStyle}>
        <Box pt={8}>
          <TextView color="primaryContrast" variant={headerVariant}>
            {t('veteranStatus.name')}
          </TextView>
          <TextView
            color="primaryContrast"
            variant="MobileBody"
            textTransform="capitalize"
            testID="veteranStatusFullNameTestID">
            {fullName?.toLowerCase()}
          </TextView>
        </Box>

        <Box pt={8}>
          <TextView color="primaryContrast" variant={headerVariant}>
            {t('veteranStatus.latestPeriodOfService')}
          </TextView>
          <TextView color="primaryContrast" variant="MobileBody" testID="veteranStatusMilitaryServiceTestID">
            {getLatestPeriodOfService()}
          </TextView>
        </Box>

        <Box flexDirection={isLandscape ? 'row' : 'column'}>
          <Box flex={isLandscape ? 1 : undefined}>
            <TextView color="primaryContrast" variant={headerVariant}>
              {t('veteranStatus.dodIdNumber')}
            </TextView>
            <TextView color="primaryContrast" variant="MobileBody" testID="veteranStatusDODTestID">
              {edipi}
            </TextView>
          </Box>

          {percentText && percentText !== '0%' && (
            <Box flex={isLandscape ? 1 : undefined}>
              <TextView color="primaryContrast" variant={headerVariant}>
                {t('veteranStatus.disabilityRating')}
              </TextView>
              <TextView color="primaryContrast" variant="MobileBody" testID="veteranStatusDisabilityRatingTestID">
                {percentText}
              </TextView>
            </Box>
          )}
        </Box>

        <Box mt={8} pb={16}>
          <TextView color="primaryContrast" variant={helperVariant}>
            {t('veteranStatus.noBenefitsEntitled')}
          </TextView>
        </Box>
      </Box>
    </Box>
  )
}

export default VeteranStatusCard
