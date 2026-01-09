import React, { FC } from 'react'

import { Link } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'
import { getDefinedAnalyticsProps } from 'components/LinkWithAnalytics/utils'
import { Box } from 'components/index'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

const LinkComponent: FC<LinkWithAnalyticsProps> = ({ analyticsOnPress, disablePadding, ...props }) => {
  const definedAnalyticsProps = getDefinedAnalyticsProps(props)
  const theme = useTheme()

  const py = disablePadding ? 0 : theme.dimensions.buttonPadding
  const pr = disablePadding ? 0 : theme.dimensions.gutter

  const analytics = {
    onPress: () => {
      analyticsOnPress && analyticsOnPress()
      logAnalyticsEvent(Events.vama_link_click(definedAnalyticsProps))
    },
    onConfirm: () => logAnalyticsEvent(Events.vama_link_confirm(definedAnalyticsProps)),
  }

  return (
    <Box flexDirection={'row'} flexWrap="wrap" py={py} pr={pr}>
      <Link analytics={analytics} icon={{ preventScaling: true }} {...props} />
    </Box>
  )
}

export default LinkComponent
