import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { TFunction } from 'i18next'
import React, { FC, useEffect, useState } from 'react'

import { Box, ErrorComponent, LoadingComponent, SegmentedControl, TextView, VAScrollView } from 'components'
import { ClaimAttributesData, ClaimData } from 'store/api/types'
import { ClaimsAndAppealsState, getClaim } from 'store/slices/claimsAndAppealsSlice'
import { ClaimsStackParamList } from '../ClaimsStackScreens'
import { InteractionManager } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useAppDispatch, useError, useTheme, useTranslation } from 'utils/hooks'
import { useSelector } from 'react-redux'
import ClaimDetails from './ClaimDetails/ClaimDetails'
import ClaimStatus from './ClaimStatus/ClaimStatus'

export const getClaimType = (claim: ClaimData | undefined, translation: TFunction): string => {
  return claim?.attributes?.claimType || translation('claims.defaultClaimType')
}

type ClaimDetailsScreenProps = StackScreenProps<ClaimsStackParamList, 'ClaimDetailsScreen'>

const ClaimDetailsScreen: FC<ClaimDetailsScreenProps> = ({ route }) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const controlValues = [t('claimDetails.status'), t('claimDetails.details')]
  const [selectedTab, setSelectedTab] = useState(controlValues[0])

  const { claimID, claimType } = route.params
  const { claim, loadingClaim } = useSelector<RootState, ClaimsAndAppealsState>((state) => state.claimsAndAppeals)
  const { attributes } = claim || ({} as ClaimData)
  const { dateFiled } = attributes || ({} as ClaimAttributesData)
  const [isTransitionComplete, setIsTransitionComplete] = React.useState(false)

  useEffect(() => {
    dispatch(getClaim(claimID, ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID))
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsTransitionComplete(true)
    })
    return () => interaction.cancel()
  }, [dispatch, claimID])

  if (useError(ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.CLAIM_DETAILS_SCREEN_ID} />
  }

  if (loadingClaim || !isTransitionComplete) {
    return <LoadingComponent text={t('cliamInformation.loading')} />
  }

  const formattedReceivedDate = formatDateMMMMDDYYYY(dateFiled || '')
  const a11yHints = [t('claimDetails.viewYourClaim', { tabName: t('claimDetails.status') }), t('claimDetails.viewYourClaim', { tabName: t('claimDetails.details') })]

  return (
    <VAScrollView {...testIdProps('Your-claim: Claim-details-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <Box mx={theme.dimensions.gutter}>
          <TextView variant="BitterBoldHeading" color={'primaryTitle'} mb={theme.dimensions.condensedMarginBetween} accessibilityRole="header">
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
    </VAScrollView>
  )
}

export default ClaimDetailsScreen
