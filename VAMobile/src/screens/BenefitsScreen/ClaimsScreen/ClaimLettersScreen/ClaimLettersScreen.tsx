import { StackScreenProps } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import React, { useEffect } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, DefaultList, ErrorComponent, FeatureLandingTemplate, LoadingComponent, TextView } from 'components'
import { DecisionLettersState, getDecisionLetters } from 'store/slices/decisionLettersSlice'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { RootState } from 'store'
import { VATypographyThemeVariants } from 'styles/theme'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { useAppDispatch, useDowntime, useError, useTheme } from 'utils/hooks'
import { useSelector } from 'react-redux'
import NoClaimLettersScreen from 'screens/BenefitsScreen/ClaimsScreen/ClaimLettersScreen/NoClaimLettersScreen'

type ClaimLettersScreenProps = StackScreenProps<BenefitsStackParamList, 'ClaimLettersScreen'>

const ClaimLettersScreen = ({ navigation }: ClaimLettersScreenProps) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { loading, decisionLetters } = useSelector<RootState, DecisionLettersState>((state) => state.decisionLetters)
  const claimsInDowntime = useDowntime(DowntimeFeatureTypeConstants.claims)

  useEffect(() => {
    if (!claimsInDowntime) {
      dispatch(getDecisionLetters(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID))
    }
  }, [dispatch, claimsInDowntime])

  const fetchInfoAgain = () => {
    dispatch(getDecisionLetters(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID))
  }

  if (useError(ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID)) {
    return (
      <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('claimLetters.title')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.DECISION_LETTERS_LIST_SCREEN_ID} onTryAgain={fetchInfoAgain} />
      </FeatureLandingTemplate>
    )
  }

  if (loading) {
    return (
      <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('claimLetters.title')}>
        <LoadingComponent text={t('claimLetters.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (decisionLetters.length === 0) {
    return (
      <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('claimLetters.title')}>
        <NoClaimLettersScreen />
      </FeatureLandingTemplate>
    )
  }

  const letterButtons = decisionLetters.map((letter, index) => {
    const { typeDescription, receivedAt } = letter.attributes
    const variant = 'MobileBodyBold' as keyof VATypographyThemeVariants
    const date = formatDateMMMMDDYYYY(receivedAt || '')

    const letterButton = {
      textLines: [{ text: t('claimLetters.letterDate', { date }), variant }, { text: typeDescription }],
      // TODO: Link to Letter View screen (ticket #5045)
      onPress: () => {},
      a11yValue: t('listPosition', { position: index + 1, total: decisionLetters.length }),
    }

    return letterButton
  })

  return (
    <FeatureLandingTemplate backLabel={t('claims.title')} backLabelOnPress={navigation.goBack} title={t('claimLetters.title')}>
      <TextView variant="MobileBody" mx={theme.dimensions.gutter} mb={theme.dimensions.standardMarginBetween}>
        {t('claimLetters.overview')}
      </TextView>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <DefaultList items={letterButtons} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default ClaimLettersScreen
