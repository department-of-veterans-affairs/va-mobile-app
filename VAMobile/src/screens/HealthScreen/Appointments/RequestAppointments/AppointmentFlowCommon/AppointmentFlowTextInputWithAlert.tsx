import React, { FC } from 'react'

import { Box, BoxProps, TextView, VATextInput, VATextInputTypes } from 'components'
import { useTheme } from 'utils/hooks/useTheme'
import AppointmentFlowErrorAlert from './AppointmentFlowErrorAlert'

type AppointmentFlowTextInputWithAlertProps = BoxProps & {
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

// Common component for text input with an error alert for appointment request flow
const AppointmentFlowTextInputWithAlert: FC<AppointmentFlowTextInputWithAlertProps> = ({
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

  const onEndEditing = () => {
    if (validationFunc) {
      validationFunc()
    }
  }

  return (
    <Box {...boxProps}>
      <TextView mb={errorMessage ? 0 : theme.dimensions.condensedMarginBetween} variant="MobileBodyBold">
        {inputLabel}
      </TextView>
      <AppointmentFlowErrorAlert errorMessage={errorMessage} mb={theme.dimensions.standardMarginBetween} mt={theme.dimensions.standardMarginBetween} />
      <VATextInput isTextArea={isTextArea} inputType={inputType} onChange={onChange} onEndEditing={onEndEditing} value={value} maxLength={maxLength} />
    </Box>
  )
}

export default AppointmentFlowTextInputWithAlert
