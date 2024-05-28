import React from 'react'

import { Link, LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'
import _ from 'lodash'

import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

import Box from './Box'

export type LinkWithAnalyticsProps = LinkProps & {
  /** optional additional analytics function */
  analyticsOnPress?: () => void
  /** optional props to send with analytics event */
  analyticsProps?: { [key: string]: unknown }
  /** optional boolean to turn off padding */
  disablePadding?: boolean
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

  return (
    <Box flexDirection={'row'} py={py} pr={pr}>
      <Link analytics={analytics} icon={{ preventScaling: true }} {...props} />
    </Box>
  )
}

export default LinkWithAnalytics
