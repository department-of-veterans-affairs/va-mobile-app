import React from 'react'

import { Link, LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'
import { LocationData } from '@department-of-veterans-affairs/mobile-component-library/src/utils/OSfunctions'
import _ from 'lodash'

import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'
import { isIOS } from 'utils/platform'
import { featureEnabled } from 'utils/remoteConfig'

import Box from './Box'
import ClickForActionLinkDeprecated, { LinkTypeOptionsConstants, LinkUrlIconType } from './ClickForActionLinkDeprecated'
import TextView from './TextView'

export type LinkWithAnalyticsProps = LinkProps & {
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

/** Wrapper for the Link component which adds analytics */
const LinkWithAnalytics = ({ analyticsOnPress, analyticsProps, disablePadding, ...props }: LinkWithAnalyticsProps) => {
  const { locationData, phoneNumber, textNumber, TTYnumber, url, type } = props
  const eventProps = { locationData, phoneNumber, textNumber, TTYnumber, url, type, ...analyticsProps }
  const definedProps = _.pickBy(eventProps, (prop) => prop !== undefined)
  const theme = useTheme()

  const py = disablePadding ? 0 : theme.dimensions.buttonPadding
  const pr = disablePadding ? 0 : theme.dimensions.gutter

  const analytics = {
    onPress: () => {
      analyticsOnPress && analyticsOnPress()
      logAnalyticsEvent(Events.vama_link_click(definedProps))
    },
    onConfirm: () => logAnalyticsEvent(Events.vama_link_confirm(definedProps)),
  }

  if (featureEnabled('useOldLinkComponent')) {
    let linkType = ''
    if (props.type === 'attachment') {
      // this should never happen since we're handling attachments differently with the flag enabled
      return <TextView>ERROR: Type "attachment" not supported with useOldLinkComponent enabled</TextView>
    } else if (props.type === 'call TTY') {
      linkType = 'callTTY'
    } else if (props.type === 'custom') {
      linkType = 'externalLink'
    } else {
      linkType = props.type
    }

    // create URL from appointment location
    const directionsURL = locationData ? FormDirectionsUrl(locationData) : ''

    // hide icon when viewing a Secure Message with links in the body
    const hideIcon = props.icon === 'no icon'

    return (
      <ClickForActionLinkDeprecated
        displayedText={props.text}
        linkType={LinkTypeOptionsConstants[linkType as keyof typeof LinkTypeOptionsConstants]}
        numberOrUrlLink={props.url || props.phoneNumber || props.TTYnumber || props.textNumber || directionsURL}
        linkUrlIconType={LinkUrlIconType.External}
        a11yLabel={props.a11yLabel || props.text}
        fireAnalytic={() => {
          props.analytics?.onPress?.()
          analyticsOnPress && analyticsOnPress()
        }}
        customOnPress={props.onPress}
        hideIcon={hideIcon}
        disablePadding={disablePadding}
        testID={props.testID}
      />
    )
  } else {
    return (
      <Box flexDirection={'row'} flexWrap="wrap" py={py} pr={pr}>
        <Link analytics={analytics} icon={{ preventScaling: true }} {...props} />
      </Box>
    )
  }
}

export default LinkWithAnalytics
