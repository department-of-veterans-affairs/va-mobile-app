import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypes, ButtonTypesConstants, VAButton } from './index'
import { AlertBoxProps } from './AlertBox'
import { useTheme } from 'utils/hooks'

export type ConfirmationAlertProps = {
  /**sets the confirm label */
  confirmLabel: string
  /** sets the cancel label */
  cancelLabel: string
  /**sets the listener function for the confirm action*/
  confirmOnPress: () => void
  /**sets the listener function for the cancel action*/
  cancelOnPress: () => void
  /**sets the a11ly tesxt for the confirm action*/
  confirmA11y?: string
  /**sets the a11ly tesxt for the cancel action*/
  cancelA11y?: string
  /**sets the button type for the confirm button*/
  button1type?: ButtonTypes
  /**sets the button type for the cancel button*/
  button2type?: ButtonTypes
} & AlertBoxProps

/**Show a confirmation alert that the user can confirm or cancel the action */
const ConfirmationAlert: FC<ConfirmationAlertProps> = ({
  title,
  text,
  border,
  confirmLabel,
  cancelLabel,
  confirmOnPress,
  cancelOnPress,
  confirmA11y,
  cancelA11y,
  button1type = ButtonTypesConstants.buttonPrimary,
  button2type = ButtonTypesConstants.buttonSecondary,
}) => {
  const theme = useTheme()

  return (
    <AlertBox title={title} text={text} border={border}>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton onPress={confirmOnPress} label={confirmLabel} a11yHint={confirmA11y} buttonType={button1type} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton onPress={cancelOnPress} label={cancelLabel} a11yHint={cancelA11y} buttonType={button2type} />
        </Box>
      </Box>
    </AlertBox>
  )
}
export default ConfirmationAlert
