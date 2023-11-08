import { AlertBox, Box, ClickToCallPhoneNumber } from 'components'
import { useNavigationState } from '@react-navigation/native'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'
import { a11yLabelID } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygateName?: WaygateToggleType
}

export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygateName }) => {
  const theme = useTheme()
  const waygateStateScreen = 'WG_' + useNavigationState((state) => state.routes[state.routes.length - 1]?.name)
  const waygateScreen = waygateName ? waygateName : waygateStateScreen
  const { t } = useTranslation(NAMESPACE.COMMON)

  const waygateAlertBox = (waygate: Waygate) => {
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertBox border={waygate.type === 'DenyContent' ? 'error' : 'warning'} title={waygate.errorMsgTitle} text={waygate.errorMsgBody}>
          <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8006982411'))} phone={t('8006982411')} a11yLabel={a11yLabelID(t('8006982411'))} />
        </AlertBox>
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
