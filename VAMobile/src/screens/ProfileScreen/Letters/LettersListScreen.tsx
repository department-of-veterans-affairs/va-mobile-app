import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonList, ButtonListItemObj } from 'components'
import { LetterData, LetterTypeConstants } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { getLetters } from 'store/actions/letters'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = {}

const LettersListScreen: FC<LettersListScreenProps> = ({}) => {
  const dispatch = useDispatch()
  const { letters } = useSelector<StoreState, LettersState>((state) => state.letters)
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

  const letterButtons: Array<ButtonListItemObj> = map(letters || [], (letter: LetterData) => {
    const letterButton: ButtonListItemObj = {
      textLines: tCommon('text.raw', { text: letter.name }),
      a11yHintText: t('letters.list.a11y', { letter: letter.name }),
      onPress: letterPressFn(letter.letterType),
    }

    return letterButton
  })

  useEffect(() => {
    dispatch(getLetters())
  }, [dispatch])

  if (!letters || letters.length === 0) {
    return <NoLettersScreen />
  }

  return (
    <ScrollView {...testIdProps('Letters-list-screen')}>
      <Box my={theme.dimensions.marginBetween}>
        <ButtonList items={letterButtons} />
      </Box>
    </ScrollView>
  )
}

export default LettersListScreen
