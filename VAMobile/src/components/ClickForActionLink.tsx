import { AccessibilityProps, Linking, TouchableWithoutFeedback } from 'react-native'
import Box from './Box'
import React, { FC } from 'react'

import { addToCalendar, checkCalendarPermission, requestCalendarPermission } from 'utils/rnCalendar'
import { generateTestID } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import TextView, { TextViewProps } from './TextView'
import VAIcon, { VA_ICON_MAP } from './VAIcon'

/** Icon type for links, defaults to Chat */
export enum LinkUrlIconType {
  /** Signifies icon with chat bubbles */
  Chat = 'Chat',
  /** Signifies icon with right pointing arrow */
  Arrow = 'Arrow',
}

export const LinkTypeOptionsConstants: {
  text: LinkTypeOptions
  call: LinkTypeOptions
  callTTY: LinkTypeOptions
  url: LinkTypeOptions
  calendar: LinkTypeOptions
  directions: LinkTypeOptions
} = {
  text: 'text',
  call: 'call',
  callTTY: 'callTTY',
  url: 'url',
  calendar: 'calendar',
  directions: 'directions',
}
type LinkTypeOptions = 'text' | 'call' | 'callTTY' | 'url' | 'calendar' | 'directions'

export type CalendarMetaData = {
  title: string
  startTime: number
  endTime: number
  location: string
}

export type ActionLinkMetaData = CalendarMetaData

/**
 *  Signifies the props that need to be passed in to {@link ClickForActionLink}
 */
export type LinkButtonProps = AccessibilityProps & {
  /** phone number or text for url that is displayed to the user, may be different than actual number or url used */
  displayedText: string

  /** string signifying the type of link it is (click to call/text/go to website/add to calendar) */
  linkType: LinkTypeOptions

  /** signifies actual link or number used for link, may be different than text displayed */
  numberOrUrlLink?: string

  /** signifies icon type of link */
  linkUrlIconType?: LinkUrlIconType

  /** object with additional data needed to perform the given action */
  metaData?: ActionLinkMetaData

  /** optional testID */
  testID?: string

  /** optional function to fire analytic events when the link is clicked */
  fireAnalytic?: () => void
}

/**
 * Reusable component used for opening native calling app, texting app, or opening a url in the browser
 */
const ClickForActionLink: FC<LinkButtonProps> = ({ displayedText, linkType, numberOrUrlLink, linkUrlIconType, metaData, testID, fireAnalytic, ...props }) => {
  const theme = useTheme()

  const onCalendarPress = async (): Promise<void> => {
    const { title, endTime, startTime, location } = metaData as ActionLinkMetaData

    let hasPermission = await checkCalendarPermission()
    if (!hasPermission) {
      hasPermission = await requestCalendarPermission()
    }

    if (hasPermission) {
      await addToCalendar(title, startTime, endTime, location)
    }
  }

  const _onPress = async (): Promise<void> => {
    if (fireAnalytic) {
      fireAnalytic()
    }

    if (linkType === LinkTypeOptionsConstants.calendar) {
      await onCalendarPress()
      return
    }

    let openUrlText = numberOrUrlLink || ''
    if (linkType === LinkTypeOptionsConstants.call || linkType === LinkTypeOptionsConstants.callTTY) {
      openUrlText = `tel:${numberOrUrlLink}`
    } else if (linkType === LinkTypeOptionsConstants.text) {
      openUrlText = `sms:${numberOrUrlLink}`
    }

    // ex. numbers: tel:${8008271000}, sms:${8008271000} (number must have no dashes)
    // ex. url: https://google.com (need https for url)
    await Linking.openURL(openUrlText)
  }

  const getUrlIcon = (): keyof typeof VA_ICON_MAP => {
    switch (linkUrlIconType) {
      case LinkUrlIconType.Arrow:
        return 'RightArrowInCircle'
      default:
        return 'Chat'
    }
  }

  const getIconName = (): keyof typeof VA_ICON_MAP => {
    switch (linkType) {
      case 'call':
        return 'Phone'
      case 'callTTY':
        return 'PhoneTTY'
      case 'text':
        return 'Text'
      case 'url':
        return getUrlIcon()
      case 'calendar':
        return 'Calendar'
      case 'directions':
        return 'Directions'
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
    <TouchableWithoutFeedback onPress={_onPress} {...testIdProps(testID ? testID : generateTestID(displayedText, ''))} accessibilityRole="link" accessible={true} {...props}>
      <Box flexDirection={'row'} py={theme.dimensions.buttonPadding} alignItems={'center'}>
        <VAIcon name={getIconName()} fill={'link'} width={25} height={25} />
        <Box flexShrink={1}>
          <TextView {...textViewProps}>{displayedText}</TextView>
        </Box>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default ClickForActionLink
