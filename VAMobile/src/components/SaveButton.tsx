import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { Box } from './index'
import { isIOS } from '../utils/platform'
import { testIdProps } from 'utils/accessibility'
import { useTranslation } from 'utils/hooks'
import TextView from './TextView'

type SaveButtonProps = {
  onSave: () => void
  disabled: boolean
}

const SaveButton: FC<SaveButtonProps> = ({ onSave, disabled }) => {
  const t = useTranslation('common')

  const color = disabled ? 'primaryContrastDisabled' : 'primaryContrast'

  return (
    <TouchableWithoutFeedback onPress={onSave} disabled={disabled} {...testIdProps('save')} accessibilityRole="button" accessible={true}>
      <Box mr={12} height={isIOS() ? 64 : 45}>
        <TextView variant="MobileBody" color={color}>
          {t('save')}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default SaveButton
