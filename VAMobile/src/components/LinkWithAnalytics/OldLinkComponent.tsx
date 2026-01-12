/**
 * OldLinkComponent is used to resolve a crash on Android 14 as explained in issue #9064.
 * Currently, all android users use this instead of the Mobile Design system link to avoid any further crashes.
 * */
import React, { FC } from 'react'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'
import { LocationData } from '@department-of-veterans-affairs/mobile-component-library/src/utils/OSfunctions'

import { LinkTypeOptionsConstants, LinkUrlIconType } from 'components/ClickForActionLinkDeprecated'
import { getDefinedAnalyticsProps } from 'components/LinkWithAnalytics/utils'
import { ClickForActionLinkDeprecated, TextView } from 'components/index'
import { isIOS } from 'utils/platform'

type LinkWithAnalyticsProps = LinkProps & {
  /** optional additional analytics function */
  analyticsOnPress?: () => void
  /** optional props to send with analytics event */
  analyticsProps?: { [key: string]: unknown }
  /** optional boolean to turn off padding */
  disablePadding?: boolean
}

/** Function to convert location data into a URL for handling by Apple/Google Maps */
const FormDirectionsUrl = (location: LocationData): string => {
  const { name, address, latitude, longitude } = location
  const addressString = Object.values(address || {}).join(' ')

  const APPLE_MAPS_BASE_URL = 'https://maps.apple.com/'
  const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/dir/'

  if (isIOS()) {
    const queryString = new URLSearchParams({
      t: 'm', // type: map
      daddr: `${addressString}+${name}+${latitude},${longitude}`,
    }).toString()
    return `${APPLE_MAPS_BASE_URL}?${queryString}`
  } else {
    const queryString = new URLSearchParams({
      api: '1',
      destination: addressString || `${latitude},${longitude}`,
    }).toString()
    return `${GOOGLE_MAPS_BASE_URL}?${queryString}`
  }
}

const OldLinkComponent: FC<LinkWithAnalyticsProps> = (props) => {
  const definedAnalyticsProps = getDefinedAnalyticsProps(props)

  let linkType = ''
  if (props.type === 'attachment') {
    // this should never happen since we're handling attachments differently with the flag enabled
    return <TextView>ERROR: Type "attachment" not supported with useOldLinkComponent enabled</TextView>
  } else if (props.type === 'call TTY') {
    linkType = 'callTTY'
  } else if (props.type === 'url') {
    linkType = 'externalLink'
  } else {
    linkType = props.type
  }

  // create URL from appointment location
  const directionsURL = props.locationData ? FormDirectionsUrl(props.locationData) : ''

  // hide icon when viewing a Secure Message with links in the body
  const hideIcon = props.icon === 'no icon'

  return (
    <ClickForActionLinkDeprecated
      displayedText={props.text}
      linkType={LinkTypeOptionsConstants[linkType as keyof typeof LinkTypeOptionsConstants]}
      numberOrUrlLink={props.url || props.phoneNumber || props.TTYnumber || props.textNumber || directionsURL}
      linkUrlIconType={LinkUrlIconType.External}
      a11yLabel={props.a11yLabel || props.text}
      fireAnalytic={props.analyticsOnPress}
      analyticsProps={definedAnalyticsProps}
      customOnPress={props.onPress}
      hideIcon={hideIcon}
      disablePadding={props.disablePadding}
      testID={props.testID}
    />
  )
}

export default OldLinkComponent
