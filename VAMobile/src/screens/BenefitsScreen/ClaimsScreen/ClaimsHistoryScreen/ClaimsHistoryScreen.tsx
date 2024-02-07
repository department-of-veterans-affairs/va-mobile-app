import { SegmentedControl } from '@department-of-veterans-affairs/mobile-component-library'
import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { ReactElement, useEffect, useState } from 'react'

import { AlertBox, Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent } from 'components'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ClaimTypeConstants } from 'constants/claims'
import { ClaimsAndAppealsErrorServiceTypesConstants } from 'api/types/ClaimsAndAppealsData'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { featureEnabled } from 'utils/remoteConfig'
import { logAnalyticsEvent } from 'utils/analytics'
import { screenContentAllowed } from 'utils/waygateConfig'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useClaimsAndAppeals } from 'api/claimsAndAppeals'
import { useDowntime, useTheme } from 'utils/hooks'
import ClaimsAndAppealsListView from '../ClaimsAndAppealsListView/ClaimsAndAppealsListView'
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
  const [selectedTab, setSelectedTab] = useState(0)
  const [claimsServiceErrors, setClaimsServiceErrors] = useState(false)
  const [appealsServiceErrors, setAppealsServiceErrors] = useState(false)
  const [claimsAndAppealsServiceErrors, setClaimsAndAppealsServiceErrors] = useState(false)
  const claimType = selectedTab === controlLabels.indexOf(t('claimsTab.active')) ? ClaimTypeConstants.ACTIVE : ClaimTypeConstants.CLOSED
  const claimsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.claims)
  const appealsNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.appeals)
  const {
    data: claimsAndAppealsListPayload,
    isError: claimsAndAppealsListError,
    isLoading: loadingClaimsAndAppealsList,
    refetch: refetchClaimsAndAppealsList,
  } = useClaimsAndAppeals(claimType, 1, { enabled: claimsAndAppealsAccess && (claimsNotInDowntime || appealsNotInDowntime) })

  const title = featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters ? t('claimsHistory.title') : t('claims.title')
  const backLabel = featureEnabled('decisionLettersWaygate') && userAuthorizedServices?.decisionLetters ? t('claims.title') : t('benefits.title')

  const fetchInfoAgain = (): void => {
    refetchUserAuthorizedServices()
    if (claimsAndAppealsAccess) {
      refetchClaimsAndAppealsList()
    }
  }

  useEffect(() => {
    const nonFatalErros = claimsAndAppealsListPayload?.meta.errors
    const claimsError = !!nonFatalErros?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.CLAIMS)
    const appealsError = !!nonFatalErros?.find((el) => el.service === ClaimsAndAppealsErrorServiceTypesConstants.APPEALS)
    setClaimsAndAppealsServiceErrors(claimsError && appealsError)
    setClaimsServiceErrors(claimsError)
    setAppealsServiceErrors(appealsError)
  }, [claimsAndAppealsListPayload, setClaimsAndAppealsServiceErrors, setClaimsServiceErrors, setAppealsServiceErrors])

  const serviceErrorAlert = (): ReactElement => {
    // if there is a claims service error or an appeals service error
    if (claimsServiceErrors || appealsServiceErrors) {
      let alertTitle, alertText

      // if both services failed
      if (claimsAndAppealsServiceErrors) {
        alertTitle = t('claimsAndAppeal.claimAndAppealStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaimsAndAppeals')

        // if claims service fails but appeals did not
      } else if (claimsServiceErrors && !appealsServiceErrors) {
        alertTitle = t('claimsAndAppeal.claimStatusUnavailable')
        alertText = t('claimsAndAppeal.troubleLoadingClaims')

        // if appeals service fails but claims does not
      } else if (appealsServiceErrors && !claimsServiceErrors) {
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

  return (
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={title} testID="claimsHistoryID">
      {claimsAndAppealsListError || getUserAuthorizedServicesError ? (
        <ErrorComponent onTryAgain={fetchInfoAgain} screenID={ScreenIDTypesConstants.CLAIMS_HISTORY_SCREEN_ID} />
      ) : loadingClaimsAndAppealsList || loadingUserAuthorizedServices ? (
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
              <ClaimsAndAppealsListView claimType={claimType} />
            </Box>
          )}
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimsHistoryScreen
