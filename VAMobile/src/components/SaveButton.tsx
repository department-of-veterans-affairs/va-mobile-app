import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import TextView from './TextView'

type SaveButtonProps = {
  /**function to run on save pressed*/
  onSave: () => void
  /**disables this component */
  disabled: boolean
  /**a11y hint for this component */
  a11yHint?: string
}

/**A common component for the save button located at the header. */
const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled, a11yHint }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme() as VATheme

  const color = disabled ? 'actionBarDisabled' : 'actionBar'

  const props: TouchableWithoutFeedbackProps = {
    onPress: onSave,
    disabled,
    accessibilityRole: 'button',
    accessible: true,
    accessibilityState: disabled ? { disabled: true } : { disabled: false },
  }

  return (
    <TouchableWithoutFeedback {...props} {...testIdProps('save')} {...a11yHintProp(a11yHint || t('save.a11yHint'))}>
      <Box pr={theme.dimensions.headerButtonSpacing} height={theme.dimensions.headerHeight} justifyContent={'center'} pl={theme.dimensions.headerLeftButtonFromTextPadding}>
        <TextView variant="ActionBar" color={color} allowFontScaling={false} accessible={false}>
          {t('save')}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default SaveButton
