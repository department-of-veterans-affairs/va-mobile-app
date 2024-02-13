import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useNavigationState } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import {
  Box,
  DefaultList,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  TextLine,
  TextView,
} from 'components'
import { SnackbarMessages } from 'components/SnackBar'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { RootState } from 'store'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { DecisionLettersState, downloadDecisionLetter, getDecisionLetters } from 'store/slices/decisionLettersSlice'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoClaimLettersScreen from './NoClaimLettersScreen/NoClaimLettersScreen'

type ClaimLettersScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimLettersScreen'>

const ClaimLettersScreen = ({ navigation }: ClaimLettersScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { loading, decisionLetters, downloading } = useSelector<RootState, DecisionLettersState>(
    (state) => state.decisionLetters,
  )
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)
  const prevScreen = useNavigationState((state) => state.routes[state.routes.length - 2]?.name)

  // This screen is reachable from two different screens, so adjust back button label
  const backLabel = prevScreen === 'ClaimDetailsScreen' ? t('claimDetails.title') : t('claims.title')

  const snackbarMessages: SnackbarMessages = {
    successMsg: '',
    errorMsg: t('claimLetters.download.error'),
  }

  useEffect(() => {
    if (screenContentAllowed('WG_ClaimLettersScreen') && !claimsInDowntime) {
      dispatch(getDecisionLetters(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID))
    }
  }, [dispatch, claimsInDowntime])

  const fetchInfoAgain = () => {
    dispatch(getDecisionLetters(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID))
  }

  const letterButtons = decisionLetters.map((letter, index) => {
    const { typeDescription, receivedAt } = letter.attributes
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    const date = t('claimLetters.letterDate', { date: formatDateMMMMDDYYYY(receivedAt || '') })
    const textLines: Array<TextLine> = [{ text: date, variant }, { text: typeDescription }]
    const onPress = () => {
      logAnalyticsEvent(Events.vama_ddl_letter_view())
      if (!snackBar) {
        logAnalyticsEvent(Events.vama_snackbar_null('ClaimLetters view letter'))
      }
      snackBar?.hideAll()
      dispatch(downloadDecisionLetter(letter.id, snackbarMessages))
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
    <FeatureLandingTemplate backLabel={backLabel} backLabelOnPress={navigation.goBack} title={t('claimLetters.title')}>
      {useError(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID) ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID} onTryAgain={fetchInfoAgain} />
      ) : loading || downloading ? (
        <LoadingComponent text={t(loading ? 'claimLetters.loading' : 'claimLetters.downloading')} />
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
