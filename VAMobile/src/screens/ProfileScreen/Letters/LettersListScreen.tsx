import { ScrollView } from 'react-native'
import { map } from 'underscore'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect } from 'react'

import { Box, ButtonListItemObj } from '/components'
import { LetterData } from '/store/api/types'
import { LettersState, StoreState } from '/store/reducers'
import { getLetters } from '/store/actions/letters'
import { testIdProps } from 'utils/accessibility'

type LettersListScreenProps = {}

const LettersListScreen: FC<LettersListScreenProps> = ({}) => {
  const dispatch = useDispatch()
  const { letters } = useSelector<StoreState, LettersState>((state) => state.letters)

  const letterButtons: Array<ButtonListItemObj> = map(letters, (letter: LetterData) => {
    // return { textIDs: 'findLocation.title', a11yHintID: 'findLocation.a11yHint', onPress: onFacilityLocator }
  })

  useEffect(() => {
    dispatch(getLetters())
  }, [dispatch])

  return (
    <ScrollView {...testIdProps('Letters-list-screen')}>
      <Box />
    </ScrollView>
  )
}

export default LettersListScreen
