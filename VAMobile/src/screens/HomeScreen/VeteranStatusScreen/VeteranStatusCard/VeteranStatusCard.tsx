import React from 'react'
import { useTranslation } from 'react-i18next'

import { Icon, IconProps } from '@department-of-veterans-affairs/mobile-component-library'

import { BranchOfService } from 'api/types'
import { BackgroundVariant, Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useOrientation, useTheme } from 'utils/hooks'

import VASeal from '../../../../components/VAIcon/svgs/VASeal.svg'

// Constants for layout/orientation
const LANDSCAPE_PADDING = 144
const PORTRAIT_PADDING = 18

const EMBLEM_SIZE_LANDSCAPE = 82
const EMBLEM_SIZE_PORTRAIT = 50

const TOP_STRIP_HEIGHT_LANDSCAPE = 70
const TOP_STRIP_HEIGHT_PORTRAIT = 50

const EMBLEM_TOP_LANDSCAPE = 40
const EMBLEM_TOP_PORTRAIT = 42

const EMBLEM_OFFSET_FROM_CARD_RIGHT = 26

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
  const topStripHeight = isPortrait ? TOP_STRIP_HEIGHT_PORTRAIT : TOP_STRIP_HEIGHT_LANDSCAPE
  const emblemTopOffset = isPortrait ? EMBLEM_TOP_PORTRAIT : EMBLEM_TOP_LANDSCAPE

  // Compute where the emblem sits horizontally
  const emblemRightOffset = horizontalPadding + EMBLEM_OFFSET_FROM_CARD_RIGHT
  const clampedEmblemRight = emblemRightOffset < 0 ? 16 : emblemRightOffset

  // Orientation variants for fonts
  const titleVariant = isPortrait ? 'VeteranStatusCardHeaderPortraitBold' : 'VeteranStatusCardHeaderLandscapeBold'
  const headerVariant = isPortrait ? 'HelperTextBold' : 'MobileBodyBold'
  const helperVariant = isPortrait ? 'HelperText' : 'VeteranStatusProof'

  // VASeal SVG
  const VASealProps = { svg: VASeal, height: emblemSize, width: emblemSize, testID: 'VASeal' } as IconProps

  return (
    <Box
      position="relative"
      width="100%"
      px={horizontalPadding}
      pt={20}
      borderRadius={15}
      style={{
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3.75 },
        shadowOpacity: 0.25,
        shadowRadius: 3.75,
        // ...Platform.select({
        //   android: { elevation: 4 },
        // }),
      }}>
      <Box
        accessibilityRole="header"
        alignItems="flex-start"
        justifyContent="center"
        backgroundColor={theme.colors.background.carousel as BackgroundVariant}
        height={topStripHeight}
        borderRadiusTop={15}
        style={{
          paddingTop: 16,
          paddingLeft: 16,
          paddingBottom: 8,
          paddingRight: 64,
        }}>
        <TextView color="primaryContrast" variant={titleVariant}>
          {t('veteranStatus.title')}
        </TextView>
      </Box>

      <Box
        backgroundColor={theme.colors.background.veteranStatus as BackgroundVariant}
        borderRadiusBottom={15}
        px={isPortrait ? 18 : 0}
        pl={isPortrait ? 0 : 18}>
        <Box pt={8}>
          <TextView color="primaryContrast" variant={headerVariant}>
            {t('veteranStatus.name')}
          </TextView>
          <TextView color="primaryContrast" variant="MobileBody" textTransform="capitalize">
            {fullName?.toLowerCase()}
          </TextView>
        </Box>

        <Box pt={8}>
          <TextView color="primaryContrast" variant={headerVariant}>
            {t('veteranStatus.latestPeriodOfService')}
          </TextView>
          <TextView color="primaryContrast" variant="MobileBody">
            {getLatestPeriodOfService()}
          </TextView>
        </Box>

        <Box flexDirection={isLandscape ? 'row' : 'column'}>
          <Box flex={isLandscape ? 1 : undefined} mr={isLandscape ? 8 : 0}>
            <TextView color="primaryContrast" variant={headerVariant}>
              {t('veteranStatus.dodIdNumber')}
            </TextView>
            <TextView color="primaryContrast" variant="MobileBody">
              {edipi}
            </TextView>
          </Box>

          <Box flex={isLandscape ? 1 : undefined} mt={isLandscape ? 0 : 8}>
            <TextView color="primaryContrast" variant={headerVariant}>
              {t('veteranStatus.disabilityRating')}
            </TextView>
            <TextView color="primaryContrast" variant="MobileBody">
              {percentText}
            </TextView>
          </Box>
        </Box>

        <Box mt={16} pb={16}>
          <TextView color="primaryContrast" variant={helperVariant}>
            {t('veteranStatus.noBenefitsEntitled')}
          </TextView>
        </Box>
      </Box>

      <Box
        position="absolute"
        top={emblemTopOffset}
        right={clampedEmblemRight}
        width={emblemSize}
        height={emblemSize}
        borderRadius={emblemSize / 2}
        overflow="hidden">
        <Icon {...VASealProps} />
      </Box>
    </Box>
  )
}

export default VeteranStatusCard
