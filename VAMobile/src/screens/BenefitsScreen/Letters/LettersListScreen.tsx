import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { Box, ErrorComponent, FeatureLandingTemplate, LoadingComponent, SimpleList, SimpleListItemObj } from 'components'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { LetterData, LetterTypeConstants } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { LettersState, getLetters } from 'store/slices/lettersSlice'
import { NAMESPACE } from 'constants/namespaces'
import { OnPressHandler, useAppDispatch, useDowntime, useError, useRouteNavigation, useTheme } from 'utils/hooks'
import { RootState } from 'store'
import { a11yLabelVA } from 'utils/a11yLabel'
import { testIdProps } from 'utils/accessibility'
import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useSelector } from 'react-redux'
import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = StackScreenProps<BenefitsStackParamList, 'LettersList'>

const LettersListScreen: FC<LettersListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch()
  const { data: userAuthorizedServices, isLoading: loadingUserAuthorizedServices, isError: getUserAuthorizedServicesError } = useAuthorizedServices()
  const { letters, loading } = useSelector<RootState, LettersState>((state) => state.letters)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const lettersNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.letters)

  const letterPressFn = (letterType: LetterTypes, letterName: string): OnPressHandler | undefined => {
    switch (letterType) {
      case LetterTypeConstants.benefitSummary:
        return navigateTo('BenefitSummaryServiceVerificationLetter')
      case LetterTypeConstants.serviceVerification:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.serviceVerificationLetter.description'),
          letterType,
          screenID: ScreenIDTypesConstants.SERVICE_VERIFICATION_LETTER_SCREEN_ID,
        })
      case LetterTypeConstants.commissary:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.commissary.description'),
          letterType,
          screenID: ScreenIDTypesConstants.COMMISSARY_LETTER_SCREEN_ID,
        })
      case LetterTypeConstants.civilService:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.civilService.description'),
          letterType,
          screenID: ScreenIDTypesConstants.CIVIL_SERVICE_LETTER_SCREEN_ID,
        })
      case LetterTypeConstants.benefitVerification:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.benefitVerification.description'),
          letterType,
          screenID: ScreenIDTypesConstants.BENEFIT_VERIFICATION_LETTER_SCREEN_ID,
          descriptionA11yLabel: a11yLabelVA(t('letters.benefitVerification.description')),
        })
      case LetterTypeConstants.proofOfService:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.proofOfService.description'),
          letterType,
          screenID: ScreenIDTypesConstants.PROOF_OF_SERVICE_LETTER_SCREEN_ID,
        })
      case LetterTypeConstants.medicarePartd:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.proofOfCrediblePrescription.description'),
          letterType,
          screenID: ScreenIDTypesConstants.PROOF_OF_CREDIBLE_PRESCRIPTION_LETTER_SCREEN_ID,
        })
      case LetterTypeConstants.minimumEssentialCoverage:
        return navigateTo('GenericLetter', {
          header: letterName,
          description: t('letters.minimumEssentialCoverage.description'),
          letterType,
          screenID: ScreenIDTypesConstants.PROOF_OF_MINIMUM_ESSENTIAL_COVERAGE_LETTER_SCREEN_ID,
          descriptionA11yLabel: t('letters.minimumEssentialCoverageA11yLabel.description'),
        })
      default:
        return undefined
    }
  }

  const letterButtons: Array<SimpleListItemObj> = map(letters || [], (letter: LetterData) => {
    let letterName = letter.letterType === LetterTypeConstants.proofOfService ? t('letters.proofOfServiceCard') : letter.name
    letterName = letterName.charAt(0).toUpperCase() + letterName.slice(1).toLowerCase()

    const letterButton: SimpleListItemObj = {
      text: t('text.raw', { text: letterName }),
      a11yHintText: t('letters.list.a11y', { letter: letterName }),
      onPress: letterPressFn(letter.letterType, letterName),
    }

    return letterButton
  })

  useEffect(() => {
    if (userAuthorizedServices?.lettersAndDocuments && lettersNotInDowntime) {
      dispatch(getLetters(ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID))
    }
  }, [dispatch, userAuthorizedServices?.lettersAndDocuments, lettersNotInDowntime])

  if (useError(ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID) || getUserAuthorizedServicesError) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.viewLetters')}>
        <ErrorComponent screenID={ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID} />
      </FeatureLandingTemplate>
    )
  }

  if (loading || loadingUserAuthorizedServices) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.viewLetters')}>
        <LoadingComponent text={t('letters.list.loading')} />
      </FeatureLandingTemplate>
    )
  }

  if (!userAuthorizedServices?.lettersAndDocuments || !letters || letters.length === 0) {
    return (
      <FeatureLandingTemplate backLabel={t('letters.overview.title')} backLabelOnPress={navigation.goBack} title={t('letters.overview.viewLetters')}>
        <NoLettersScreen />
      </FeatureLandingTemplate>
    )
  }

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.title')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.overview.viewLetters')}
      {...testIdProps('Letters-list-page')}>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <SimpleList items={letterButtons} />
      </Box>
    </FeatureLandingTemplate>
  )
}

export default LettersListScreen
