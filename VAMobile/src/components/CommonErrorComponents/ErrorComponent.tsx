import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { CallHelpCenter, DowntimeError, ErrorAlert, NetworkConnectionError } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ErrorsState } from 'store/slices'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDToDowntimeFeatures, ScreenIDTypes } from 'store/api/types'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { oneOfFeaturesInDowntime } from 'utils/hooks'

export type ErrorComponentProps = {
  /**The screen id for the screen that has the errors*/
  screenID: ScreenIDTypes
  /** optional function called when the Try again button is pressed */
  onTryAgain?: () => void
}

/**Main error handling component. This component will show the proper screen according to the type of error.*/
const ErrorComponent: FC<ErrorComponentProps> = (props) => {
  const { errorsByScreenID, downtimeWindowsByFeature, tryAgain: storeTryAgain } = useSelector<RootState, ErrorsState>((state) => state.errors)
  const { t } = useTranslation(NAMESPACE.COMMON)
  const features = ScreenIDToDowntimeFeatures[props.screenID]
  const isInDowntime = oneOfFeaturesInDowntime(features, downtimeWindowsByFeature)

  const getSpecificErrorComponent: FC<ErrorComponentProps> = ({ onTryAgain, screenID }) => {
    const tryAgain = onTryAgain ? onTryAgain : storeTryAgain
    const errorType = errorsByScreenID[screenID] || ''

    if (isInDowntime) {
      return <DowntimeError screenID={screenID} />
    }
    // check which specific error occurred and return the corresponding error element
    switch (errorType) {
      case CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR:
        return <NetworkConnectionError onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR:
        return <CallHelpCenter />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_WITH_REFRESH:
        return <CallHelpCenter onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_HEALTH_LOAD:
        return (
          <CallHelpCenter
            onTryAgain={tryAgain}
            errorText={t('secureMessaging.sendError.ifTheAppStill')}
            errorA11y={t('secureMessaging.sendError.ifTheAppStill.a11y')}
            callPhone={displayedTextPhoneNumber(t('8773270022'))}
          />
        )
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_DISABILITY_RATING:
        return <CallHelpCenter titleText={t('disabilityRating.errorTitle')} callPhone={displayedTextPhoneNumber(t('8008271000'))} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_APPOINTMENTS:
        return <ErrorAlert text={t('appointments.errorText')} onTryAgain={tryAgain} />
      case CommonErrorTypesConstants.APP_LEVEL_ERROR_VACCINE:
        return <CallHelpCenter onTryAgain={tryAgain} titleText={t('errors.callHelpCenter.vaAppNotWorking')} callPhone={displayedTextPhoneNumber(t('8006982411'))} />
      default:
        return <CallHelpCenter onTryAgain={tryAgain} />
    }
  }

  return getSpecificErrorComponent(props)
}

export default ErrorComponent
