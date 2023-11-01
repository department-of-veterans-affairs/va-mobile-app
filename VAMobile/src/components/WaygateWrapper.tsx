import { AlertBox, Box } from 'components'
import React, { FC, ReactElement } from 'react'

import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'
import { useTheme } from 'utils/hooks'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygateName: WaygateToggleType
}

export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygateName }) => {
  const theme = useTheme()

  const waygateAlertBox = (waygate: Waygate) => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertBox border="warning" title={waygate.errorMsgTitle} text={waygate.errorMsgBody} />
      </Box>
    )
  }

  const waygate = waygateEnabled(waygateName)
  if (waygate.enabled === false) {
    const showScreenContent = waygate.allowFunction === true || waygateName === 'WG_Login'
    return (
      <>
        {waygateAlertBox(waygate)}
        {showScreenContent && children}
      </>
    )
  }

  return <>{children}</>
}

export default WaygateWrapper
