import { AccessibilityProps, Linking, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import React, { FC } from 'react'

import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import TextView, { TextViewProps } from './TextView'
import VAIcon, { VA_ICON_MAP } from './VAIcon'

/** Icon type for links, defaults to Messages */
export enum LinkIconType {
  /** Signifies icon with chat bubbles */
  Messages = 'Messages',
  /** Signifies icon with right pointing arrow */
  Arrow = 'Arrow',
}

type LinkTypeOptions = 'text' | 'call' | 'url'

/**
 *  Signifies the props that need to be passed in to {@link ClickForActionLink}
 */
export type LinkButtonProps = AccessibilityProps & {
  /** phone number or text for url that is displayed to the user, may be different than actual number or url used */
  displayedText: string

  /** string signifying the type of link it is (click to call/text/go to website) */
  linkType: LinkTypeOptions

  /** signifies actual link or number used for link, may be different than text displayed */
  numberOrUrlLink: string

  /** signifies icon type of link */
  linkIconType?: LinkIconType
}

/**
 * Reusable component used for opening native calling app, texting app, or opening a url in the browser
 */
const ClickForActionLink: FC<LinkButtonProps> = ({ displayedText, linkType, numberOrUrlLink, linkIconType, ...props }) => {
  const theme = useTheme()
  const _onPress = (): void => {
    let openUrlText = numberOrUrlLink
    if (linkType === 'call') {
      openUrlText = `tel:${numberOrUrlLink}`
    } else if (linkType === 'text') {
      openUrlText = `sms:${numberOrUrlLink}`
    }

    // ex. numbers: tel:${8008271000}, sms:${8008271000} (number must have no dashes)
    // ex. url: https://google.com (need https for url)
    Linking.openURL(openUrlText)
  }

  const getIconName = (): keyof typeof VA_ICON_MAP => {
    switch (linkType) {
      case 'call':
        return 'Phone'
      case 'text':
        return 'Text'
      case 'url':
        if (linkIconType === LinkIconType.Arrow) {
          return 'ArrowRight'
        } else {
          return 'Chat'
        }
    }
  }

  const textViewProps: TextViewProps = {
    color: 'link',
    variant: 'MobileBody',
    ml: 4,
    textDecoration: 'underline',
    textDecorationColor: 'link',
  }

  return (
    <TouchableWithoutFeedback onPress={_onPress} {...testIdProps(generateTestID(displayedText, ''))} accessibilityRole="link" accessible={true} {...props}>
      <Box flexDirection={'row'} py={theme.dimensions.buttonPadding} alignItems={'center'}>
        <VAIcon name={getIconName()} fill={'link'} />
        <TextView {...textViewProps}>{displayedText}</TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default ClickForActionLink
