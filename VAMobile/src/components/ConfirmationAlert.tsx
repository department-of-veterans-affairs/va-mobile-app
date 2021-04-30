import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton } from './index'
import { AlertBoxProps } from './AlertBox'
import { useTheme } from 'utils/hooks'

export type ConfirmationAlertProps = {
  button1Label: string
  button2Label: string
  button1OnPress: () => void
  button2OnPress: () => void
  button1A11y?: string
  button2A11y?: string
} & AlertBoxProps

const ConfirmationAlert: FC<ConfirmationAlertProps> = ({
  title,
  text,
  background,
  border,
  button1Label,
  button2Label,
  button1OnPress,
  button2OnPress,
  button1A11y,
  button2A11y,
}) => {
  const theme = useTheme()

  return (
    <AlertBox title={title} text={text} background={background} border={border}>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton onPress={button1OnPress} label={button1Label} a11yHint={button1A11y} buttonType={ButtonTypesConstants.buttonPrimary} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton onPress={button2OnPress} label={button2Label} a11yHint={button2A11y} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    </AlertBox>
  )
}
export default ConfirmationAlert
