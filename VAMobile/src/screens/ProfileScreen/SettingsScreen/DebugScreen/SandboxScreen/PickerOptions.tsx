import React from 'react'

import { Box, ButtonTypesConstants, PickerItem, TextView, VAButton } from 'components'
import { getTheme } from 'styles/themes/standardTheme'
import VAColors from 'styles/themes/VAColors'

const standardTheme = getTheme()

// Converts basic object(ex. { key: value }) -> [ { label: '', value: '' }]
export const objectToPickerOptions = (options: Record<string, string>, appendValueToLabel = false, useLabelAsValue = false): Array<PickerItem> => {
  return Object.entries(options).map((value) => {
    return {
      label: appendValueToLabel ? `${value[0]} (${value[1]})` : value[0],
      value: useLabelAsValue ? (value[0] as string) : (value[1] as string),
    }
  })
}

// Children under a component or nested in
// <ExampleCommonComponent> <Children/> </ExampleCommonComponent>
export const generateChildrenPickerOptions = () => {
  return [
    {
      label: 'no children',
      value: undefined,
    },
    {
      label: 'one button',
      value: (
        <Box my={standardTheme.dimensions.standardMarginBetween}>
          <VAButton onPress={() => {}} label={'Button'} buttonType={ButtonTypesConstants.buttonPrimary} />
        </Box>
      ),
    },
    {
      label: 'text',
      value: (
        <Box my={standardTheme.dimensions.standardMarginBetween}>
          <TextView>
            Et sint culpa est facere doloribus id quidem omnis aut recusandae voluptas ut similique molestias et dolorem dolores id laboriosam repellendus. Qui culpa maxime et
            fugiat eius qui expedita voluptatem et exercitationem reprehenderit quod quia 33 consequatur optio.
          </TextView>
        </Box>
      ),
    },
    {
      label: 'text with button',
      value: (
        <Box my={standardTheme.dimensions.standardMarginBetween}>
          <TextView>
            Et sint culpa est facere doloribus id quidem omnis aut recusandae voluptas ut similique molestias et dolorem dolores id laboriosam repellendus. Qui culpa maxime et
            fugiat eius qui expedita voluptatem et exercitationem reprehenderit quod quia 33 consequatur optio.
          </TextView>
          <Box my={standardTheme.dimensions.condensedMarginBetween}>
            <VAButton onPress={() => {}} label={'Button'} buttonType={ButtonTypesConstants.buttonPrimary} />
          </Box>
        </Box>
      ),
    },
  ]
}

// Booleans true or false
export const generateBooleanPickerOptions = () => {
  return [
    {
      label: 'False',
      value: false,
    },
    {
      label: 'True',
      value: true,
    },
  ]
}

//  for properties that do not have a color type
// ex.
// /** Hex string to set the spinner color*/
// spinnerColor?: string
export const VAColorsOptions = objectToPickerOptions(VAColors, true)

// to 'keyof VABorderColors' in props
export const VABorderColorOptions = objectToPickerOptions(standardTheme.colors.border, true)

// 'ColorVariant' or 'keyof VATextColors | keyof VAButtonTextColors' in props
export const VATextAndButtonColorOptions = objectToPickerOptions({ ...standardTheme.colors.text, ...standardTheme.colors.buttonText }, true, true)

// Booleans true or false
export const BooleanOptions = generateBooleanPickerOptions()

// Child options
export const ChildrenOptions = generateChildrenPickerOptions()

// OnPress Options
// DEFAULT gets converted into a () => {} in SandboxScreen.tsx
export const OnPressOptions = {
  DEFAULT: 'DEFAULT',
  NONE: undefined,
}
