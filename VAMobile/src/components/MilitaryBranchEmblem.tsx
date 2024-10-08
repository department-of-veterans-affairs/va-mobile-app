import React, { FC } from 'react'
import { Image, ImageStyle, StyleProp } from 'react-native'

import { BranchOfService, BranchesOfServiceConstants } from 'api/types'
import { useTheme } from 'utils/hooks'

export type MilitaryBranchEmblemProps = {
  /** Name of military branch emblem to display */
  branch: BranchOfService
  /** Width of the emblem */
  width: number
  /** Height of the emblem */
  height: number
  /** Manually set which emblem variant to use when applicable. Defaults to setting based on theme */
  variant?: 'light' | 'dark'
  /** Optional test ID for emblem */
  testID?: string
}

export const MilitaryBranchEmblem: FC<MilitaryBranchEmblemProps> = ({ branch, width, height, variant, testID }) => {
  const theme = useTheme()

  const style: StyleProp<ImageStyle> = {
    width,
    height,
  }

  switch (branch) {
    case BranchesOfServiceConstants.AirForce:
      return (
        <Image
          testID={testID || 'United States Air Force Emblem'}
          style={style}
          source={require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-air-force-coat-of-arms.png')}
        />
      )
    case BranchesOfServiceConstants.Army:
      return (
        <Image
          testID={testID || 'United States Army Emblem'}
          style={style}
          source={require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-army-symbol.png')}
        />
      )
    case BranchesOfServiceConstants.CoastGuard:
      return (
        <Image
          testID={testID || 'United States Coast Guard Emblem'}
          style={style}
          source={require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-cg-emblem.png')}
        />
      )
    case BranchesOfServiceConstants.MarineCorps:
      return (
        <Image
          testID={testID || 'United States Marine Corps Emblem'}
          style={style}
          source={require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-usmc-emblem.png')}
        />
      )
    case BranchesOfServiceConstants.Navy:
      return (
        <Image
          testID={testID || 'United States Navy Emblem'}
          style={style}
          source={require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-navy-emblem.png')}
        />
      )
    case BranchesOfServiceConstants.SpaceForce:
      return (
        <Image
          testID={testID || 'United States Space Force Emblem'}
          style={style}
          source={
            (variant || theme.mode) === 'dark'
              ? require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-space-force-logo-on-dark.png')
              : require('@department-of-veterans-affairs/mobile-assets/serviceEmblems/vic-space-force-logo-on-light.png')
          }
        />
      )
    default:
      return null
  }
}

export default MilitaryBranchEmblem
