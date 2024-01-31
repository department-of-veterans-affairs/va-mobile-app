import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { ReactElement, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent } from 'components'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ClaimsAndAppealsErrorServiceTypesConstants, ClaimsAndAppealsGetDataMetaError } from 'api/types/ClaimsAndAppealsData'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDTypesConstants } from 'store/api/types'
import { featureEnabled } from 'utils/remoteConfig'
import { logAnalyticsEvent } from 'utils/analytics'
import { screenContentAllowed } from 'utils/waygateConfig'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useError, useTheme } from 'utils/hooks'
import ClaimsAndAppealsListView, { ClaimTypeConstants } from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
import NoClaimsAndAppealsAccess from '../NoClaimsAndAppealsAccess/NoClaimsAndAppealsAccess'

type IClaimsHistoryScreen = StackScreenProps<BenefitsStackParamList, 'ClaimsHistoryScreen'>

function ClaimsHistoryScreen({ navigation }: IClaimsHistoryScreen) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    isError: getUserAuthorizedServicesError,
    refetch: refetchUserAuthorizedServices,
  } = useAuthorizedServices({ enabled: screenContentAllowed('WG_ClaimsHistory') })
  const claimsAndAppealsAccess = userAuthorizedServices?.claims || userAuthorizedServices?.appeals
  const controlLabels = [t('claimsTab.active'), t('claimsTab.closed')]
  const accessibilityHints = [t('claims.viewYourActiveClaims'), t('claims.viewYourClosedClaims')]
  const [listViewError, setListViewError] = useState(false)
  const [claimsServiceError, setClaimsError] = useState(false)
  const [appealsServiceError, setAppealsError] = useState(false)
  const [selectedTab, setSelectedTab] = useState(0)
  const claimType = selectedTab === controlLabels.indexOf(t('claimsTab.active')) ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsAndAppealsServiceErrors = claimsServiceError && appealsServiceError

  const title = featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters ? t('claimsHistory.title') : t('claims.title')
  const backLabel = featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters ? t('claims.title') : t('benefits.title')

  const fetchInfoAgain = (): void => {
    refetchUserAuthorizedServices()
  }

  const serviceErrorAlert = (): ReactElement => {
    // if there is a claims service error or an appeals service error
    if (claimsServiceError || appealsServiceError) {
      let alertTitle, alertText

      // if both services failed
      if (claimsServiceError && appealsServiceError) {
        alertTitle = t('claimsAndAppeal.claimAndAppealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaimsAndAppeals')

        // if claims service fails but appeals did not
      } else if (claimsServiceError && !appealsServiceError) {
        alertTitle = t('claimsAndAppeal.claimStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaims')

        // if appeals service fails but claims does not
      } else if (appealsServiceError && !claimsServiceError) {
        alertTitle = t('claimsAndAppeal.appealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingAppeals')
      }

      return (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertBox title={alertTitle} text={alertText} border="error" />
        </Box>
      )
    }

    return <></>
  }

  const onTabChange = (tab: number) => {
    if (tab !== selectedTab) {
      logAnalyticsEvent(Events.vama_segcontrol_click(controlLabels[tab]))
    }
    setSelectedTab(tab)
  }

  const onErrorSet = (error: boolean, nonFatalErros?: Array<ClaimsAndAppealsGetDataMetaError>) => {
    setListViewError(error)
    const claimsError = !!nonFatalErros?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsError = !!nonFatalErros?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
    setClaimsError(claimsError)
    setAppealsError(appealsError)
  }

  return (
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title} testID="claimsHistoryID">
      {useError(ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID) || getUserAuthorizedServicesError || listViewError ? (
        <ErrorComponent onTryAgain={fetchInfoAgain} screenID={ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID} />
      ) : loadingUserAuthorizedServices ? (
        <LoadingComponent text={t('claimsAndAppeals.loadingClaimsAndAppeals')} />
      ) : !claimsAndAppealsAccess ? (
        <NoClaimsAndAppealsAccess />
      ) : (
        <Box flex={1} justifyContent="flex-start" mb={theme.dimensions.contentMarginBottom}>
          {!claimsAndAppealsServiceErrors && (
            <Box mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
              <SegmentedControl labels={controlLabels} onChange={onTabChange} selected={selectedTab} a11yHints={accessibilityHints} />
            </Box>
          )}
          {serviceErrorAlert()}
          {!claimsAndAppealsServiceErrors && (
            <Box flex={1}>
              <ClaimsAndAppealsListView claimType={claimType} onErrorSet={onErrorSet} />
            </Box>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimsHistoryScreen
