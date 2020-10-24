import { themeFn } from '../utils/theme'
import Box from './Box'
import React, { FC, useEffect, useState } from 'react'
import TextView from './TextView'
import styled from 'styled-components/native'

/**
 * Signifies the props to send into the {@link SegmentedControl}
 */
export type ToggleButtonProps = {
  /** function to call when the selected value has changed */
  onChange: (selection: string) => void
  /** The values to signify selection options */
  values: string[]
  /** the text to display in the selection option UI */
  titles: string[]
  /** the index of the currently selected item. used to set initail state */
  selected?: number
}

type ButtonContainerProps = {
  /** lets the component know if it is selected */
  isSelected: boolean
  /** width percent of parent for the component */
  widthPct: string
}

const ButtonContainer = styled.TouchableOpacity`
  elevation: 0;
  border-radius: 10px;
  padding-vertical: 4px;
  width: ${themeFn<ButtonContainerProps>((theme, props) => props.widthPct)};
  shadow-opacity: ${themeFn<ButtonContainerProps>((theme, props) => (props.isSelected ? 0.4 : 0))};
  shadow-radius: 1px;
  shadow-offset: 0px 2px;
  shadow-color: ${themeFn<ButtonContainerProps>((theme) => theme.colors.background.shadow)};
  elevation: ${themeFn<ButtonContainerProps>((theme, props) => (props.isSelected ? 4 : 0))};
  background-color: ${themeFn<ButtonContainerProps>((theme, props) =>
    props.isSelected ? theme.colors.segmentedControl.buttonActive : theme.colors.segmentedControl.buttonInactive,
  )};
`

const SegmentedControl: FC<ToggleButtonProps> = ({ values, titles, onChange, selected }) => {
  const [selection, setSelection] = useState(selected === undefined ? 0 : selected)

  useEffect(() => {
    onChange(values[selection])
  })

  return (
    <Box flexDirection={'row'} justifyContent={'space-between'} backgroundColor={'segmentedController'} mx={20} p={2} borderRadius={10} alignSelf={'baseline'} flexWrap={'wrap'}>
      {values.map((value, index) => {
        return (
          <ButtonContainer onPress={(): void => setSelection(index)} isSelected={selection === index} key={index} widthPct={`${100 / values.length}%`}>
            <TextView variant={selection === index ? 'MobileBodyBold' : 'MobileBody'} textAlign="center">
              {titles[index]}
            </TextView>
          </ButtonContainer>
        )
      })}
    </Box>
  )
}

export default SegmentedControl
