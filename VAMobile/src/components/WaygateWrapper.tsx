import { AlertBox, Box } from 'components'
import { useNavigationState } from '@react-navigation/native'
import React, { FC } from 'react'

import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'
import { useTheme } from 'utils/hooks'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygateName?: WaygateToggleType
}

export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygateName }) => {
  const theme = useTheme()
  const waygateStateScreen = 'WG_' + useNavigationState((state) => state.routes[state.routes.length - 1]?.name)
  const waygateScreen = waygateName ? waygateName : waygateStateScreen

  const waygateAlertBox = (waygate: Waygate) => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertBox border="warning" title={waygate.errorMsgTitle} text={waygate.errorMsgBody} />
      </Box>
    )
  }

  const waygate = waygateEnabled(waygateScreen as WaygateToggleType)
  if (waygate.enabled === false) {
    const showScreenContent = waygate.type === 'AllowFunction' || waygateName === 'WG_Login'
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
