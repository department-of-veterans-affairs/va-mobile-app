import React, { FC, useMemo } from 'react'
import { Pressable, Text, TextStyle } from 'react-native'

import {
  Icon,
  Spacer,
  useTheme as useComponentLibraryTheme,
} from '@department-of-veterans-affairs/mobile-component-library'
import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'
import { font, spacing } from '@department-of-veterans-affairs/mobile-tokens'

import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'
import { getDefinedAnalyticsProps } from 'components/LinkWithAnalytics/utils'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useExternalLink } from 'utils/hooks'

const { typography } = font

/** Resolves the icon to display based on link type and the caller's `icon` override prop,
 *  mirroring the logic in the component library's Link component. When no `icon` prop
 *  is provided, each type gets its default icon (e.g. Launch for url, Phone for call).
 *  Pass `icon="no icon"` to suppress the icon entirely. */
const resolveIcon = (type: LinkWithAnalyticsProps['type'], icon: LinkWithAnalyticsProps['icon']): IconProps => {
  const noIcon: IconProps = { name: 'none' }

  const defaultNameForType: Record<string, IconProps['name']> = {
    attachment: 'AttachFile',
    calendar: 'CalendarToday',
    call: 'Phone',
    'call TTY': 'TTY',
    directions: 'Directions',
    text: 'PhoneIphone',
    url: 'Launch',
  }

  const defaultName = defaultNameForType[type]

  if (icon === 'no icon') return noIcon
  if (icon === undefined) return defaultName ? { name: defaultName } : noIcon
  if (icon.svg) return icon as IconProps
  if (!defaultName && !icon.name) return noIcon
  return { name: defaultName, ...icon } as IconProps
}

/** Inline link that uses the same VADS token colors, typography, decoration, and
 *  icon defaults as the component library Link. When an icon is resolved it renders
 *  in a Pressable row (matching the library's layout); otherwise it renders as a
 *  plain <Text> for use inside a Text tree. */
const InlineLinkComponent: FC<LinkWithAnalyticsProps> = ({ analyticsOnPress, ...props }) => {
  const {
    type,
    text,
    variant = 'default',
    icon,
    a11yLabel,
    a11yHint,
    testID,
    onPress,
    url,
    phoneNumber,
    textNumber,
    TTYnumber,
  } = props

  const definedAnalyticsProps = getDefinedAnalyticsProps(props)
  const theme = useComponentLibraryTheme()
  const launchExternalLink = useExternalLink()

  const linkColor = variant === 'base' ? theme.vadsColorForegroundDefault : theme.vadsColorActionForegroundDefault

  const handlePress = () => {
    analyticsOnPress?.()

    switch (type) {
      case 'url':
        launchExternalLink(url || '', definedAnalyticsProps)
        break
      case 'call':
        launchExternalLink(`tel:${phoneNumber}`, definedAnalyticsProps)
        break
      case 'call TTY':
        launchExternalLink(`tel:${TTYnumber}`, definedAnalyticsProps)
        break
      case 'text':
        launchExternalLink(`sms:${textNumber}`, definedAnalyticsProps)
        break
      case 'custom':
      case 'attachment':
      case 'calendar':
        logAnalyticsEvent(Events.vama_link_click(definedAnalyticsProps))
        onPress?.()
        break
      default:
        if (url) {
          launchExternalLink(url, definedAnalyticsProps)
        }
        break
    }
  }

  const linkStyle: TextStyle = useMemo(
    () => ({
      ...typography.vadsFontBodyLarge,
      marginBottom: spacing.vadsSpaceNone,
      color: linkColor,
      textDecorationLine: 'underline',
      textDecorationColor: linkColor,
      // flexShrink: 1,
    }),
    [linkColor],
  )

  const resolvedIcon = resolveIcon(type, icon)
  const hasIcon = resolvedIcon.name !== 'none'

  if (!hasIcon) {
    return (
      <Text
        style={linkStyle}
        onPress={handlePress}
        accessible={true}
        accessibilityRole="link"
        accessibilityLabel={a11yLabel || text}
        accessibilityHint={a11yHint}
        testID={testID}>
        {text}
      </Text>
    )
  }

  return (
    <Pressable
      onPress={handlePress}
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel={a11yLabel || text}
      accessibilityHint={a11yHint}
      hitSlop={7}
      style={({ pressed }) => ({
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        backgroundColor: pressed ? theme.vadsColorSurfaceSecondary : 'transparent',
      })}
      testID={testID}>
      <Icon
        fill={linkColor}
        preventScaling
        alignWithTextLineHeight={typography.vadsFontBodyLarge.lineHeight}
        {...resolvedIcon}
      />
      <Spacer size="2xs" horizontal />
      {text.split(' ').map((word, i, arr) => (
        <Text key={i} style={linkStyle}>
          {word}
          {i < arr.length - 1 ? ' ' : ''}
        </Text>
      ))}
    </Pressable>
  )
}

export default InlineLinkComponent
