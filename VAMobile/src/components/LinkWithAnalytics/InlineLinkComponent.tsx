import React, { FC, useMemo } from 'react'
import { Text, TextStyle } from 'react-native'

import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'
import { getDefinedAnalyticsProps } from 'components/LinkWithAnalytics/utils'
import { useExternalLink, useTheme } from 'utils/hooks'

/** Text-based link that flows inline within a Text tree. */
const InlineLinkComponent: FC<LinkWithAnalyticsProps> = ({ analyticsOnPress, ...props }) => {
  const definedAnalyticsProps = getDefinedAnalyticsProps(props)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()

  const handlePress = () => {
    analyticsOnPress && analyticsOnPress()
    launchExternalLink(props.url || '', definedAnalyticsProps)
  }

  const linkStyle: TextStyle = useMemo(
    () => ({ color: theme.colors.text.link, textDecorationLine: 'underline' }),
    [theme.colors.text.link],
  )

  return (
    // eslint-disable-next-line react-native-a11y/has-accessibility-hint
    <Text
      style={linkStyle}
      onPress={handlePress}
      accessible={true}
      accessibilityRole="link"
      accessibilityLabel={props.a11yLabel || props.text}
      testID={props.testID}>
      {props.text}
    </Text>
  )
}

export default InlineLinkComponent
