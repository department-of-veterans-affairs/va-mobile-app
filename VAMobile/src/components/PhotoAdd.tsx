import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, PressableProps } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'

import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'

import TextView, { TextViewProps } from './TextView'
import { Box, BoxProps } from './index'

type PhotoAddProps = {
  /** width of the component */
  width: number
  /** height of the component */
  height: number
  /** error if no images present */
  imagesEmptyError: boolean
  /** Add Photo on press with error and success callback */
  onPress: () => void
}

const PhotoAdd: FC<PhotoAddProps> = ({ width, height, imagesEmptyError, onPress }) => {
  const { colors: themeColor, dimensions } = useTheme()
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
    color: 'link',
    textAlign: 'center',
    width: width,
    maxFontSizeMultiplier: 2.5,
  }

  const a11yErrorLabel = t('error', { error: t('fileUpload.requiredPhoto') })

  return (
    <Pressable {...pressableProps}>
      {imagesEmptyError && (
        // eslint-disable-next-line react-native-a11y/has-accessibility-hint
        <TextView accessibilityLabel={a11yErrorLabel} variant="MobileBodyBold" color="error" mb={dimensions.gutter}>
          {t('fileUpload.requiredPhoto')}
        </TextView>
      )}
      <Box {...boxProps}>
        <Icon name={'AddCircle'} width={40} height={40} fill={themeColor.icon.photoAdd} maxWidth={70} />
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{t('fileUpload.addPhoto')}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoAdd
