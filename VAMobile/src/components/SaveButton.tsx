import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import React, { FC } from 'react'

import { Box } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { isIOS } from '../utils/platform'
import { useTranslation } from 'utils/hooks'
import TextView from './TextView'

type SaveButtonProps = {
  onSave: () => void
  disabled: boolean
}

const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled }) => {
  const t = useTranslation(NAMESPACE.COMMON)

  const color = disabled ? 'primaryContrastDisabled' : 'primaryContrast'

  const props: TouchableWithoutFeedbackProps = {
    onPress: onSave,
    disabled,
    accessibilityRole: 'button',
    accessible: true,
    accessibilityState: disabled ? { disabled: true } : { disabled: false },
  }

  return (
    <TouchableWithoutFeedback {...props} {...testIdProps('save')} {...a11yHintProp(t('save.a11yHint'))}>
      <Box mr={12} height={isIOS() ? 92 : 50} py={14} pl={14}>
        <TextView variant="MobileBody" color={color}>
          {t('save')}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default SaveButton
