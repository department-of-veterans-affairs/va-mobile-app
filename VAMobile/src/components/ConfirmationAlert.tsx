import React, { FC } from 'react'

import { AlertBox, Box, ButtonTypesConstants, VAButton } from './index'
import { AlertBoxProps } from './AlertBox'
import { useTheme } from 'utils/hooks'

export type ConfirmationAlertProps = {
  confirmLabel: string
  cancelLabel: string
  confirmOnPress: () => void
  cancelOnPress: () => void
  confirmA11y?: string
  cancelA11y?: string
} & AlertBoxProps

const ConfirmationAlert: FC<ConfirmationAlertProps> = ({ title, text, background, border, confirmLabel, cancelLabel, confirmOnPress, cancelOnPress, confirmA11y, cancelA11y }) => {
  const theme = useTheme()

  return (
    <AlertBox title={title} text={text} background={background} border={border}>
      <Box mt={theme.dimensions.standardMarginBetween}>
        <VAButton onPress={confirmOnPress} label={confirmLabel} a11yHint={confirmA11y} buttonType={ButtonTypesConstants.buttonPrimary} />
        <Box mt={theme.dimensions.standardMarginBetween}>
          <VAButton onPress={cancelOnPress} label={cancelLabel} a11yHint={cancelA11y} buttonType={ButtonTypesConstants.buttonSecondary} />
        </Box>
      </Box>
    </AlertBox>
  )
}
export default ConfirmationAlert
