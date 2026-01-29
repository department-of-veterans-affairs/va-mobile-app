import { pick } from 'underscore'

import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'

export const getDefinedAnalyticsProps = ({ analyticsProps, ...props }: LinkWithAnalyticsProps) => {
  const { locationData, phoneNumber, textNumber, TTYnumber, url, type, text, testID } = props
  const eventProps = { locationData, phoneNumber, textNumber, TTYnumber, url, type, text, testID, ...analyticsProps }

  return pick(eventProps, (prop) => prop !== undefined)
}
