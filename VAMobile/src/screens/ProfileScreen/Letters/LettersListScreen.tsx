import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ErrorComponent, List, ListItemObj, LoadingComponent } from 'components'
import { LetterData, LetterTypeConstants } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { ScreenIDs } from 'constants/screens'
import { getLetters } from 'store/actions/letters'
import { testIdProps } from 'utils/accessibility'
import { useError, useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = {}

const LettersListScreen: FC<LettersListScreenProps> = ({}) => {
  const dispatch = useDispatch()
  const { letters, loading } = useSelector<StoreState, LettersState>((state) => state.letters)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const t = useTranslation(NAMESPACE.PROFILE)
  const tCommon = useTranslation(NAMESPACE.COMMON)

  const letterPressFn = (letterType: LetterTypes): (() => void) => {
    return (): void => {
      switch (letterType) {
        case LetterTypeConstants.benefitSummary:
          navigateTo('BenefitSummaryServiceVerificationLetter')()
          break
        case LetterTypeConstants.serviceVerification:
          navigateTo('ServiceVerificationLetter')()
          break
      }
    }
  }

  const letterButtons: Array<ListItemObj> = map(letters || [], (letter: LetterData) => {
    const letterButton: ListItemObj = {
      textLines: tCommon('text.raw', { text: letter.name }),
      a11yHintText: t('letters.list.a11y', { letter: letter.name }),
      onPress: letterPressFn(letter.letterType),
    }

    return letterButton
  })

  useEffect(() => {
    dispatch(getLetters(ScreenIDs.LETTERS_LIST_SCREEN_ID))
  }, [dispatch])

  if (useError(ScreenIDs.LETTERS_LIST_SCREEN_ID)) {
    return <ErrorComponent />
  }

  if (loading) {
    return <LoadingComponent />
  }

  if (!letters || letters.length === 0) {
    return <NoLettersScreen />
  }

  return (
    <ScrollView {...testIdProps('Letters-list-screen')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom}>
        <List items={letterButtons} />
      </Box>
    </ScrollView>
  )
}

export default LettersListScreen
