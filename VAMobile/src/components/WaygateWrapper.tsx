import { AlertBox, Box } from 'components'
import React, { FC, ReactElement } from 'react'

import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'
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
  console.log('WG: ' + waygate + ' : ' + JSON.stringify(waygateOpen, undefined, 2))
  if (waygateOpen.enabled) {
    return <>{children}</>
  } else if ((waygateOpen.enabled === false && waygateOpen.allowFunction === true) || waygate === 'WG_LoginScreen') {
    return (
      <>
        {waygateAlertBox(waygateOpen)}
        {children}
      </>
    )
  } else if (waygateOpen.enabled === false && waygateOpen.allowFunction === false) {
    return waygateAlertBox(waygateOpen)
  } else {
    return <>{children}</>
  }
}

export default WaygateWrapper
