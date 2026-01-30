import React, { FC } from 'react'

import LinkComponent from 'components/LinkWithAnalytics/LinkComponent'
import OldLinkComponent from 'components/LinkWithAnalytics/OldLinkComponent'
import { LinkWithAnalyticsProps } from 'components/LinkWithAnalytics/types'
import { featureEnabled } from 'utils/remoteConfig'

/** Wrapper for the Link component which adds analytics */
const LinkWithAnalytics: FC<LinkWithAnalyticsProps> = (props) => {
  if (featureEnabled('useOldLinkComponent')) {
    return <OldLinkComponent {...props} />
  } else {
    return <LinkComponent {...props} />
  }
}

export default LinkWithAnalytics
