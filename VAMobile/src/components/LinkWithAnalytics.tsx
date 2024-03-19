import React from 'react'

import { Link, LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'
import _ from 'lodash'

import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'

import Box from './Box'

/** Wrapper for the Link component which adds analytics */
const LinkWithAnalytics = (props: LinkProps) => {
  const { locationData, phoneNumber, textNumber, TTYnumber, url, type } = props
  const eventProps = { locationData, phoneNumber, textNumber, TTYnumber, url, type }
  const definedProps = _.pickBy(eventProps, (prop) => prop !== undefined)

  const analytics = {
    onPress: () => logAnalyticsEvent(Events.vama_link_click(definedProps)),
    onConfirm: () => logAnalyticsEvent(Events.vama_link_confirm(definedProps)),
  }

  return (
    <Box flexDirection={'row'}>
      <Link analytics={analytics} {...props} />
    </Box>
  )
}

export default LinkWithAnalytics
