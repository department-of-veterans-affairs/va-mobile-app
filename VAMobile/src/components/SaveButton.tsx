import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import React, { FC } from 'react'

import { Box } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import TextView from './TextView'

type SaveButtonProps = {
  onSave: () => void
  disabled: boolean
  a11yHint?: string
}

const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled, a11yHint }) => {
  const t = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const color = disabled ? 'primaryContrastDisabled' : 'primaryContrast'

  const props: TouchableWithoutFeedbackProps = {
    onPress: onSave,
    disabled,
    accessibilityRole: 'button',
    accessible: true,
    accessibilityState: disabled ? { disabled: true } : { disabled: false },
  }

  return (
    <TouchableWithoutFeedback {...props} {...testIdProps('save')} {...a11yHintProp(a11yHint || t('save.a11yHint'))}>
      <Box pr={theme.dimensions.headerButtonMargin} height={theme.dimensions.headerHeight} justifyContent={'center'} pl={theme.dimensions.headerButtonPadding}>
        <TextView variant="ActionBar" color={color} allowFontScaling={false} accessible={false}>
          {t('save')}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default SaveButton
