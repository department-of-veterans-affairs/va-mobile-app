import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import TextView, { TextViewProps } from './TextView'
import { Box, BoxProps, VAIcon } from './index'

type PhotoAddProps = {
  /** width of the component */
  width: number
  /** height of the component */
  height: number
  /** Add Photo on press with error and success callback */
  onPress: () => void
}

const PhotoAdd: FC<PhotoAddProps> = ({ width, height, onPress }) => {
  const { colors: themeColor } = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessibilityHint: t('fileUpload.addPhoto.a11y'),
  }

  const boxProps: BoxProps = {
    borderColor: 'photoAdd',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 5,
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
  }

  const textProps: TextViewProps = {
    variant: 'HelperTextBold',
    color: 'footerButton',
    textAlign: 'center',
    width: width,
    maxFontSizeMultiplier: 2.5,
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <VAIcon
          name={'Add'}
          width={32}
          height={32}
          fill={themeColor.icon.photoAdd}
          fill2={themeColor.icon.transparent}
          maxWidth={70}
        />
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{t('fileUpload.addPhoto')}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoAdd
