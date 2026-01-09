import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'
import { pick } from 'underscore';


export const getDefinedAnalyticsProps = ({ analyticsProps, ...props }: LinkWithAnalyticsProps) => {
  const { locationData, phoneNumber, textNumber, TTYnumber, url, type } = props
  const eventProps = { locationData, phoneNumber, textNumber, TTYnumber, url, type, ...analyticsProps }

  return pick(eventProps, (prop) => prop !== undefined)
}