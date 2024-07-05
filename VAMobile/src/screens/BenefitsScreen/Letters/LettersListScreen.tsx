import React from 'react'
import { useTranslation } from 'react-i18next'

import { StackScreenProps } from '@react-navigation/stack'

import { map } from 'underscore'

import { useAuthorizedServices } from 'api/authorizedServices/getAuthorizedServices'
import { useLetters } from 'api/letters'
import { LetterData, LetterTypeConstants, LetterTypes } from 'api/types'
import {
  Box,
  ErrorComponent,
  FeatureLandingTemplate,
  LoadingComponent,
  SimpleList,
  SimpleListItemObj,
} from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { BenefitsStackParamList } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { DowntimeFeatureTypeConstants, ScreenIDTypesConstants } from 'store/api/types'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { useDowntime, useRouteNavigation, useTheme } from 'utils/hooks'
import { screenContentAllowed } from 'utils/waygateConfig'

import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = StackScreenProps<BenefitsStackParamList, 'LettersList'>

function LettersListScreen({ navigation }: LettersListScreenProps) {
  const {
    data: userAuthorizedServices,
    isLoading: loadingUserAuthorizedServices,
    error: getUserAuthorizedServicesError,
    refetch: refetchAuthServices,
  } = useAuthorizedServices()
  const lettersNotInDowntime = !useDowntime(DowntimeFeatureTypeConstants.letters)
  const {
    data: letters,
    isFetching: loading,
    error: getLettersError,
    refetch: refetchLetters,
  } = useLetters({
    enabled:
      screenContentAllowed('WG_LettersList') && userAuthorizedServices?.lettersAndDocuments && lettersNotInDowntime,
  })
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const letterPressFn = (letterType: LetterTypes, letterName: string): void | undefined => {
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
    let letterName =
      letter.letterType === LetterTypeConstants.proofOfService ? t('letters.proofOfServiceCard') : letter.name
    letterName = letterName.charAt(0).toUpperCase() + letterName.slice(1).toLowerCase()

    const letterButton: SimpleListItemObj = {
      text: t('text.raw', { text: letterName }),
      a11yHintText: t('letters.list.a11y', { letter: letterName }),
      onPress: () => {
        logAnalyticsEvent(Events.vama_click(letterName, t('letters.overview.viewLetters')))
        letterPressFn(letter.letterType, letterName)
      },
    }

    return letterButton
  })

  return (
    <FeatureLandingTemplate
      backLabel={t('letters.overview.title')}
      backLabelOnPress={navigation.goBack}
      title={t('letters.overview.viewLetters')}>
      {!lettersNotInDowntime ? (
        <ErrorComponent screenID={ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID} />
      ) : loading || loadingUserAuthorizedServices ? (
        <LoadingComponent text={t('letters.list.loading')} />
      ) : getUserAuthorizedServicesError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID}
          error={getUserAuthorizedServicesError}
          onTryAgain={refetchAuthServices}
        />
      ) : !userAuthorizedServices?.lettersAndDocuments ? (
        <NoLettersScreen />
      ) : getLettersError ? (
        <ErrorComponent
          screenID={ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID}
          error={getLettersError}
          onTryAgain={refetchLetters}
        />
      ) : !letters || letters.length === 0 ? (
        <NoLettersScreen />
      ) : (
        <Box mb={theme.dimensions.contentMarginBottom}>
          <SimpleList items={letterButtons} />
        </Box>
      )}
    </FeatureLandingTemplate>
  )
}

export default LettersListScreen
