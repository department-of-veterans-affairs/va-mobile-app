import { AlertBox, Box } from 'components'
import React, { FC, ReactElement } from 'react'

import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/remoteConfig'
import { useTheme } from 'utils/hooks'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygate: WaygateToggleType
}

/**A common component for the react native switch component*/
export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygate }) => {
  const theme = useTheme()

  const waygateAlertBox = (wg: Waygate): ReactElement => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertBox border="warning" title={wg.errorMsgTitle} text={wg.errorMsgBody} />
      </Box>
    )
  }

  const waygateOpen = waygateEnabled(waygate)
  if (waygateOpen.enabled) {
    return <Box>{children}</Box>
  } else if (waygateOpen.enabled === false && waygateOpen.allowFunction === true) {
    return (
      <Box>
        {waygateAlertBox(waygateOpen)}
        {children}
      </Box>
    )
  } else if (waygateOpen.enabled === false && waygateOpen.allowFunction === false) {
    return waygateAlertBox(waygateOpen)
  } else {
    return <Box>{children}</Box>
  }
}

export default WaygateWrapper
