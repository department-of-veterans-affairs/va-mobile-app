import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { useQueryClient } from '@tanstack/react-query'

import { useDecisionLetters, useDownloadDecisionLetter } from 'api/decisionLetters'
import { DecisionLettersList } from 'api/types'
import {
  Box,
  DefaultList,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  TextLine,
  TextView,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText, isErrorObject, showSnackBar } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoClaimLettersScreen from './NoClaimLettersScreen/NoClaimLettersScreen'

type ClaimLettersScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimLettersScreen'>

const ClaimLettersScreen = ({ navigation }: ClaimLettersScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)
  const [letterID, setLetterID] = useState<string>('')
  const {
    data: decisionLettersData,
    isFetching: loading,
    error: letterInfoError,
    refetch: fetchInfoAgain,
  } = useDecisionLetters({
    enabled: screenContentAllowed('WG_ClaimLettersScreen') && !claimsInDowntime,
  })
  const {
    isFetching: downloading,
    error: downloadLetterErrorDetails,
    refetch: refetchLetter,
  } = useDownloadDecisionLetter(letterID, {
    enabled: letterID.length > 0,
  })
  // This screen is reachable from two different screens, so adjust back button label
  const decisionLetters = decisionLettersData?.data || ([] as DecisionLettersList)
  const backLabel = prevScreen === 'ClaimDetailsScreen' ? t('claimDetails.title') : t('claims.title')

  useEffect(() => {
    if (downloadLetterErrorDetails && isErrorObject(downloadLetterErrorDetails)) {
      if (!snackBar) {
        logAnalyticsEvent(Events.vama_snackbar_null('ClaimLetters view letter'))
      }
      snackBar?.hideAll()
      showSnackBar(t('claimLetters.download.error'), dispatch, refetchLetter, false, true, true)
    }
  }, [downloadLetterErrorDetails, queryClient, dispatch, t, refetchLetter])

  const letterButtons = decisionLetters.map((letter, index) => {
    const { typeDescription, receivedAt } = letter.attributes
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    const date = t('claimLetters.letterDate', { date: formatDateMMMMDDYYYY(receivedAt || '') })
    const textLines: Array<TextLine> = [{ text: date, variant }, { text: typeDescription }]
    const onPress = () => {
      logAnalyticsEvent(Events.vama_ddl_letter_view())
      if (letterID === letter.id) {
        refetchLetter()
      } else {
        setLetterID(letter.id)
      }
    }

    const letterButton = {
      textLines,
      onPress,
      a11yValue: t('listPosition', { position: index + 1, total: decisionLetters.length }),
      testId: getA11yLabelText(textLines), // read by screen reader
    }

    return letterButton
  })

  return (
    <FeatureLandingTemplate
      backLabel={backLabel}
      backLabelOnPress={navigation.goBack}
      title={t('claimLetters.title')}
      backLabelTestID="claimLettersBackTestID">
      {loading || downloading ? (
        <LoadingComponent text={t(loading ? 'claimLetters.loading' : 'claimLetters.downloading')} />
      ) : letterInfoError || claimsInDowntime ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID}
          onTryAgain={fetchInfoAgain}
          error={letterInfoError}
        />
      ) : decisionLetters.length === 0 ? (
        <NoClaimLettersScreen />
      ) : (
        <>
          <TextView variant="MobileBody" mx={theme.dimensions.gutter} paragraphSpacing={true}>
            {t('claimLetters.overview')}
          </TextView>
          <Box mb={theme.dimensions.contentMarginBottom}>
            <DefaultList items={letterButtons} />
          </Box>
        </>
      )}
    </FeatureLandingTemplate>
  )
}

export default ClaimLettersScreen
