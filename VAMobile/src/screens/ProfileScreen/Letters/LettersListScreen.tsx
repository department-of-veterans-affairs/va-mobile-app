import { StackScreenProps } from '@react-navigation/stack'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { AuthorizedServicesState, LettersState, StoreState } from 'store/reducers'
import { Box, ErrorComponent, LoadingComponent, SimpleList, SimpleListItemObj, VAScrollView } from 'components'
import { LetterData, LetterTypeConstants } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { NAMESPACE } from 'constants/namespaces'
import { OnPressHandler, useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import { ProfileStackParamList } from '../ProfileStackScreens'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { getLetters } from 'store/actions/letters'
import { testIdProps } from 'utils/accessibility'
import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = StackScreenProps<ProfileStackParamList, 'LettersList'>

const LettersListScreen: FC<LettersListScreenProps> = () => {
  const dispatch = useDispatch()
  const { lettersAndDocuments } = useSelector<StoreState, AuthorizedServicesState>((state) => state.authorizedServices)
  const { letters, loading } = useSelector<StoreState, LettersState>((state) => state.letters)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const t = useTranslation(NAMESPACE.PROFILE)
  const tCommon = useTranslation(NAMESPACE.COMMON)

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
          descriptionA11yLabel: t('letters.benefitVerificationA11yLabel.description'),
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
      text: tCommon('text.raw', { text: letterName }),
      a11yHintText: t('letters.list.a11y', { letter: letterName }),
      onPress: letterPressFn(letter.letterType, letterName),
    }

    return letterButton
  })

  useEffect(() => {
    if (lettersAndDocuments) {
      dispatch(getLetters(ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID))
    }
  }, [dispatch, lettersAndDocuments])

  if (useError(ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID)) {
    return <ErrorComponent screenID={ScreenIDTypesConstants.LETTERS_LIST_SCREEN_ID} />
  }

  if (loading) {
    return <LoadingComponent text={t('letters.list.loading')} />
  }

  if (!lettersAndDocuments || !letters || letters.length === 0) {
    return <NoLettersScreen />
  }

  return (
    <VAScrollView {...testIdProps('Letters-list-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <SimpleList items={letterButtons} />
      </Box>
    </VAScrollView>
  )
}

export default LettersListScreen
