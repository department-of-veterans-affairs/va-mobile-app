import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonList, ButtonListItemObj, textIDObj } from 'components'
import { LetterData } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { NAMESPACE } from 'constants/namespaces'
import { getLetters } from 'store/actions/letters'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import NoLettersScreen from './NoLettersScreen'

type LettersListScreenProps = {}

const LettersListScreen: FC<LettersListScreenProps> = ({}) => {
  const dispatch = useDispatch()
  const { letters } = useSelector<StoreState, LettersState>((state) => state.letters)
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.PROFILE)

  const letterPressFn = (letterType: LetterTypes): (() => void) => {
    return (): void => {
      console.log(letterType + ' pressed')
    }
  }

  const letterButtons: Array<ButtonListItemObj> = map(letters || [], (letter: LetterData) => {
    const textIDs: Array<textIDObj> = [{ textID: 'text.raw', fieldObj: { text: letter.name } }]

    const letterButton: ButtonListItemObj = {
      textIDs: textIDs,
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
