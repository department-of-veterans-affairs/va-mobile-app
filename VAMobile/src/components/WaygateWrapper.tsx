import React, { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelID, a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useOpenAppStore, useTheme } from 'utils/hooks'
import { fixedWhiteSpaceString } from 'utils/jsonFormatting'
import { Waygate, WaygateToggleType, waygateEnabled } from 'utils/waygateConfig'

export type WaygateWrapperProps = {
  /** the waygate name to check for */
  waygateName?: WaygateToggleType
  /** flag for template footer buttons to not double up alertbox display */
  bypassAlertBox?: boolean
}

export const WaygateWrapper: FC<WaygateWrapperProps> = ({ children, waygateName, bypassAlertBox }) => {
  const theme = useTheme()
  const waygateStateScreen = 'WG_' + useNavigationState((state) => state.routes[state.routes.length - 1]?.name)
  const [waygateScreen] = useState(waygateName || waygateStateScreen)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const openAppStore = useOpenAppStore()

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
    }
    const errorMsgBodyV2 = fixedWhiteSpaceString(waygate.errorMsgBodyV2)
    const text = errorMsgBodyV2.length > 0 ? errorMsgBodyV2 : waygate.errorMsgBody
    const phoneNumber =
      waygate.errorPhoneNumber && waygate.errorPhoneNumber.length > 0 ? waygate.errorPhoneNumber : t('8006982411')
    return (
      <Box mb={theme.dimensions.condensedMarginBetween}>
        <AlertWithHaptics
          variant={waygate.type === 'DenyContent' ? 'error' : 'warning'}
          header={waygate.errorMsgTitle}
          headerA11yLabel={a11yLabelVA(waygate.errorMsgTitle || '')}
          description={text}
          descriptionA11yLabel={a11yLabelVA(text || '')}
          primaryButton={
            waygate.appUpdateButton === true ? { label: t('updateNow'), onPress: onUpdateButtonPress } : undefined
          }
          focusOnError={false}
          testID="AFUseCase2TestID">
          <ClickToCallPhoneNumber
            displayedText={displayedTextPhoneNumber(phoneNumber)}
            phone={phoneNumber}
            a11yLabel={a11yLabelID(phoneNumber)}
            variant={'base'}
          />
        </AlertWithHaptics>
      </Box>
    )
  }

  const waygate = waygateEnabled(waygateScreen as WaygateToggleType)
  const showAlertBox =
    waygate.enabled === false && waygateTypeCheck(waygate.type) && (waygate.errorMsgTitle || waygate.errorMsgBody)

  useEffect(() => {
    if (showAlertBox && !bypassAlertBox) {
      const afStatus = waygate.appUpdateButton ? 'closed' : 'open'
      logAnalyticsEvent(Events.vama_af_shown(afStatus, waygateScreen))
    }
  }, [bypassAlertBox, waygateScreen, showAlertBox, waygate.appUpdateButton])

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
