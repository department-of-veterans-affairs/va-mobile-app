import React, { FC } from 'react'

import { Box, BoxProps, TextView, VATextInput, VATextInputTypes } from 'components'
import { useTheme } from 'utils/hooks'
import AppointmentFlowErrorAlert from './AppointmentFlowErrorAlert'

type AppointmenFlowTextInputWithAlertProps = BoxProps & {
  /** Type of the input. Will determine the keyboard used */
  inputType: VATextInputTypes
  /** The error message */
  errorMessage?: string
  /** value for input*/
  value?: string
  /** label for input*/
  inputLabel: string
  /** optional boolean that when true displays a text area rather than a single line text input */
  isTextArea?: boolean
  /** Handle the change in input value */
  onChange: (val: string) => void
  /** optional max length for the input */
  maxLength?: number
  /** optional validation function to run after editing is done */
  validationFunc?: () => void
}

// Coomon component for text input with an error alert for appointment request flow
const AppointmenFlowTextInputWithAlert: FC<AppointmenFlowTextInputWithAlertProps> = ({
  inputType,
  errorMessage,
  value,
  inputLabel,
  maxLength,
  isTextArea,
  onChange,
  validationFunc,
  ...boxProps
}) => {
  const theme = useTheme()
  const { condensedMarginBetween, standardMarginBetween } = theme.dimensions

  const onEndEditing = () => {
    if (validationFunc) {
      validationFunc()
    }
  }

  return (
    <Box {...boxProps}>
      <TextView mb={errorMessage ? 0 : condensedMarginBetween} variant="MobileBodyBold">
        {inputLabel}
      </TextView>
      <AppointmentFlowErrorAlert errorMessage={errorMessage} mb={standardMarginBetween} mt={standardMarginBetween} />
      <VATextInput isTextArea={isTextArea} inputType={inputType} onChange={onChange} onEndEditing={onEndEditing} value={value} maxLength={maxLength} />
    </Box>
  )
}

export default AppointmenFlowTextInputWithAlert
