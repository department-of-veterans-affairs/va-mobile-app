import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { BackButton, Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, SegmentedControl, TextView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { ClaimAttributesData, ClaimData } from 'store/api/types'
import { ClaimsAndAppealsState, getClaim } from 'store/slices/claimsAndAppealsSlice'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { VATheme } from 'styles/theme'
import { featureEnabled } from 'utils/remoteConfig'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useBeforeNavBackListener, useError } from 'utils/hooks'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'
import ClaimDetails from './ClaimDetails/ClaimDetails'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimDetailsScreen'>

const ClaimDetailsScreen: FC<ClaimDetailsScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.COMMON)

  const controlValues = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  const { claimID, claimType, focusOnSnackbar } = route.params
  const { claim, loadingClaim, cancelLoadingDetailScreen } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)

  useBeforeNavBackListener(navigation, () => {
    // if claim is still loading cancel it
    if (loadingClaim) {
      cancelLoadingDetailScreen?.abort()
    }
  })

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton
          onPress={() => {
            navigation.goBack()
          }}
          focusOnButton={focusOnSnackbar ? false : true}
          canGoBack={props.canGoBack}
          label={BackButtonLabelConstants.back}
          showCarat={true}
        />
      ),
    })
  })

  useEffect(() => {
    dispatch(getClaim(claimID, ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID))
  }, [dispatch, claimID])

  const backLabel = featureEnabled('decisionLetters') ? t('claimsHistory.title') : t('claims.title')

  if (useError(ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loadingClaim) {
    return (
      <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')}>
        <LoadingComponent text={t('cliamInformation.loading')} />
      </FeatureLandingTemplate>
    )
  }

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')
  const a11yHints = [t('claimDetails.viewYourClaim', { tabName: t('claimDetails.status') }), t('claimDetails.viewYourClaim', { tabName: t('claimDetails.details') })]

  return (
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimDetails.title')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" mb={theme.dimensions.condensedMarginBetween} accessibilityRole="header">
            {t('claimDetails.titleWithType', { type: getClaimType(claim, t).toLowerCase() })}
          </TextView>
          <TextView variant="MobileBody">{t('claimDetails.receivedOn', { date: formattedReceivedDate })}</TextView>
          <Box mt={theme.dimensions.standardMarginBetween}>
            <SegmentedControl
              values={controlValues}
              titles={controlValues}
              onChange={setSelectedTab}
              selected={controlValues.indexOf(selectedTab)}
              accessibilityHints={a11yHints}
            />
          </Box>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween}>
          {claim && selectedTab === t('claimDetails.status') && <ClaimStatus claim={claim || ({} as ClaimData)} claimType={claimType} />}
          {claim && selectedTab === t('claimDetails.details') && <ClaimDetails claim={claim} />}
        </Box>
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimDetailsScreen
