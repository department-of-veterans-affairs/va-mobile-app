import { AlertBox, Box, ButtonTypesConstants, ClickToCallPhoneNumber, VAButton } from 'components'
import { useNavigationState } from '@react-navigation/native'
import React, { FC, useEffect } from 'react'

import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'
import { a11yLabelID } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { openAppStore } from 'utils/homeScreenAlerts'
import { requestStorePopup } from 'utils/rnInAppUpdate'
import { useTheme } from 'utils/hooks'
import { useTranslation } from 'react-i18next'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygateName?: WaygateToggleType
  /** flag for template footer buttons to not double up alertbox display */
  bypassAlertBox?: boolean
}

export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygateName, bypassAlertBox }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const screenName = useNavigationState((state) => state.routes[state.routes.length - 1]?.name)

  const waygateTypeCheck = (waygateType: string | undefined) => {
    if (waygateType === 'DenyContent' || waygateType === 'AllowFunction') {
      return true
    } else {
      return false
    }
  }

  const waygateAlertBox = (waygate: Waygate) => {
    const onUpdateButtonPress = async () => {
      logAnalyticsEvent(Events.vama_af_updated())
      openAppStore()

      const isUpdated = await requestStorePopup()
      isUpdated && logAnalyticsEvent(Events.vama_af_updated_success(screenName))
    }

    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertBox border={waygate.type === 'DenyContent' ? 'error' : 'warning'} title={waygate.errorMsgTitle} text={waygate.errorMsgBody} focusOnError={false}>
          <Box my={theme.dimensions.standardMarginBetween}>
            <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8006982411'))} phone={t('8006982411')} a11yLabel={a11yLabelID(t('8006982411'))} />
          </Box>
          {waygate.appUpdateButton === true && <VAButton onPress={onUpdateButtonPress} label={t('updateNow')} buttonType={ButtonTypesConstants.buttonPrimary} />}
        </AlertBox>
      </Box>
    )
  }

  const waygateToggle = waygateName || `WG_${screenName}`
  const waygate = waygateEnabled(waygateToggle as WaygateToggleType)
  const showAlertBox = waygate.enabled === false && waygateTypeCheck(waygate.type) && (waygate.errorMsgTitle || waygate.errorMsgBody)

  useEffect(() => {
    if (showAlertBox && !bypassAlertBox) {
      const afStatus = waygate.type === 'DenyContent' ? 'open' : 'closed'
      logAnalyticsEvent(Events.vama_af_shown(afStatus, screenName))
    }
  }, [bypassAlertBox, screenName, showAlertBox, waygate.type])

  if (showAlertBox) {
    const showScreenContent = waygate.type === 'AllowFunction' || waygateName === 'WG_Login'
    return (
      <>
        {!bypassAlertBox && waygateAlertBox(waygate)}
        {showScreenContent && children}
      </>
    )
  }

  return <>{children}</>
}

export default WaygateWrapper
