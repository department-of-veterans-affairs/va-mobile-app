import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

export type LinkWithAnalyticsProps = LinkProps & {
  /** optional additional analytics function */
  analyticsOnPress?: () => void
  /** optional props to send with analytics event */
  analyticsProps?: { [key: string]: unknown }
  /** optional boolean to turn off padding */
  disablePadding?: boolean
}