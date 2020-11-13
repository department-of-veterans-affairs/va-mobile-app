import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonList, ButtonListItemObj, textIDObj } from 'components'
import { LetterData } from 'store/api/types'
import { LetterTypes } from 'store/api/types'
import { LettersState, StoreState } from 'store/reducers'
import { getLetters } from 'store/actions/letters'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

type LettersListScreenProps = {}

const LettersListScreen: FC<LettersListScreenProps> = ({}) => {
  const dispatch = useDispatch()
  const { letters } = useSelector<StoreState, LettersState>((state) => state.letters)
  const theme = useTheme()

  const letterPressFn = (letterType: LetterTypes): (() => void) => {
    return (): void => {
      console.log(letterType + ' pressed')
    }
  }

  const letterButtons: Array<ButtonListItemObj> = map(letters || [], (letter: LetterData) => {
    const textIDs: Array<textIDObj> = [{ textID: 'text.raw', fieldObj: { text: letter.name } }]

    const letterButton: ButtonListItemObj = {
      textIDs: textIDs,
      a11yHintID: '',
      onPress: letterPressFn(letter.letterType),
    }

    return letterButton
  })

  useEffect(() => {
    dispatch(getLetters())
  }, [dispatch])

  return (
    <ScrollView {...testIdProps('Letters-list-screen')}>
      <Box my={theme.dimensions.marginBetween}>
        <ButtonList items={letterButtons} />
      </Box>
    </ScrollView>
  )
}

export default LettersListScreen
