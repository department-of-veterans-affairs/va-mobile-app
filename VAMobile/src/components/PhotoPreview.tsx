import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Image, Pressable, PressableProps } from 'react-native'
import { Asset } from 'react-native-image-picker/src/types'

import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { themeFn } from 'utils/theme'

import Box, { BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'

type PhotoPreviewProps = {
  /** width of the photo */
  width: number
  /** height of the photo */
  height: number
  /** imagePickerResponse with asset to style for component and fileSize */
  image: Asset
  /** function callback for if it is pressed */
  onPress?: () => void
  /** Photo Position in array */
  photoPosition?: string
}

type StyledImageProps = {
  /** prop to set image width */
  width: number
  /** prop to set image height */
  height: number
  /** Hardcoded radius of 5 due to design plan */
  borderRadius: number
}

const StyledImage = styled(Image)<StyledImageProps>`
  width: ${themeFn<StyledImageProps>((_theme, props) => props.width)}px;
  height: ${themeFn<StyledImageProps>((_theme, props) => props.height)}px;
  border-radius: ${themeFn<StyledImageProps>((_theme, props) => props.borderRadius)}px;
`

const PhotoPreview: FC<PhotoPreviewProps> = ({ width, height, image, onPress, photoPosition }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const uri = image.uri
  const photoPreviewBorderRadius = 5

  const photo = (): ReactNode => {
    return <StyledImage source={{ uri }} width={width} height={height} borderRadius={photoPreviewBorderRadius} />
  }

  const imageSize = image.fileSize ? bytesToFinalSizeDisplay(image.fileSize, t, false) : undefined
  const imageSizeA11y = image.fileSize ? bytesToFinalSizeDisplayA11y(image.fileSize, t, false) : undefined

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessibilityHint: t('fileUpload.deletePhoto.a11yHint'),
    accessibilityLabel: imageSizeA11y ? photoPosition?.concat(imageSizeA11y) : photoPosition,
  }

  const boxProps: BoxProps = {
    borderRadius: photoPreviewBorderRadius,
    width: width,
    height: height,
  }

  const textProps: TextViewProps = {
    variant: 'HelperText',
    maxFontSizeMultiplier: 2.5,
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <Box>{photo()}</Box>
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{imageSize}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoPreview
