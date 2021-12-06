import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { NAMESPACE } from '../constants/namespaces'
import { TouchableOpacity } from 'react-native'
import { a11yHintProp, a11yValueProp, testIdProps } from 'utils/accessibility'
import { themeFn } from '../utils/theme'
import { useTranslation } from '../utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'

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
  /** the index of the currently selected item. used to set initial state  */
  selected: number
  /** optional list of accessibility hints, ordering dependent on values/titles ordering */
  accessibilityHints?: string[]
}

type ButtonContainerProps = {
  /** lets the component know if it is selected */
  isSelected: boolean
  /** width percent of parent for the component */
  widthPct: string
}

const ButtonContainer = styled(TouchableOpacity)<ButtonContainerProps>`
  border-radius: 8px;
  padding-vertical: 7px;
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
/**A common component for filtering UI views by segments or lanes. Used for things like toggling between Active/Completed claims and Future/Past Appointments */
const SegmentedControl: FC<ToggleButtonProps> = ({ values, titles, onChange, selected, accessibilityHints }) => {
  const t = useTranslation(NAMESPACE.COMMON)

  useEffect(() => {
    onChange(values[selected])
  }, [selected, onChange, values])

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'segmentedController',
    p: 2,
    borderRadius: 8,
    alignSelf: 'baseline',
    flexWrap: 'wrap',
    accessibilityRole: 'tablist',
  }

  return (
    <Box {...boxProps}>
      {values.map((value, index) => {
        const isSelected = selected === index

        return (
          <ButtonContainer
            onPress={(): void => onChange(values[index])}
            isSelected={isSelected}
            key={index}
            widthPct={`${100 / values.length}%`}
            {...testIdProps(value)}
            {...a11yHintProp(accessibilityHints ? accessibilityHints[index] : '')}
            {...a11yValueProp({ text: t('listPosition', { position: index + 1, total: values.length }) })}
            accessibilityRole={'tab'}
            accessibilityState={{ selected: selected === index }}>
            <TextView
              variant={selected === index ? 'MobileBodyBold' : 'MobileBody'}
              textAlign="center"
              color={isSelected ? 'segmentControllerActive' : 'secondary'}
              allowFontScaling={false}>
              {titles[index]}
            </TextView>
          </ButtonContainer>
        )
      })}
    </Box>
  )
}

export default SegmentedControl
