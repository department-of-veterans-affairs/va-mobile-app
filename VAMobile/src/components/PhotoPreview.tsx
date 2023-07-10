import { Asset } from 'react-native-image-picker/src/types'
import { Image, Pressable, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { VAIcon } from './index'
import { bytesToFinalSizeDisplay, bytesToFinalSizeDisplayA11y } from 'utils/common'
import { themeFn } from 'utils/theme'
import { useDestructiveActionSheet, useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView, { TextViewProps } from './TextView'

type PhotoPreviewProps = {
  /** width of the photo */
  width: number
  /** height of the photo */
  height: number
  /** imagePickerResponse with asset to style for component and fileSize */
  image: Asset
  /** function callback for if deletion is selected */
  onDeleteCallback: () => void
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

const PhotoPreview: FC<PhotoPreviewProps> = ({ width, height, image, onDeleteCallback, photoPosition }) => {
  const { colors: themeColor } = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [selected, setSelected] = useState(false)
  const uri = image.uri
  const confirmAlert = useDestructiveActionSheet()
  const photoPreviewIconSize = 24
  const photoPreviewBorderRadius = 5
  const photoPreviewIconPadding = 5

  const photo = (): ReactNode => {
    return <StyledImage source={{ uri }} width={width} height={height} borderRadius={photoPreviewBorderRadius} />
  }

  const onPress = (): void => {
    setSelected(true)

    confirmAlert({
      title: t('removePhoto'),
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: t('keep'),
          onPress: () => {
            setSelected(false)
          },
        },
        {
          text: t('remove'),
          onPress: () => {
            setSelected(false)
            onDeleteCallback()
          },
        },
      ],
    })
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

  const blueOpacity: BoxProps = {
    borderRadius: photoPreviewBorderRadius,
    width: width,
    height: height,
    opacity: 0.4,
    backgroundColor: 'profileBanner',
    position: 'absolute',
  }

  const textProps: TextViewProps = {
    variant: 'HelperText',
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <Box>{photo()}</Box>
        {selected && <Box {...blueOpacity} />}
        <Box pt={photoPreviewIconPadding} pr={photoPreviewIconPadding} position="absolute" alignSelf="flex-end">
          {selected && <VAIcon name={'Minus'} width={photoPreviewIconSize} height={photoPreviewIconSize} fill={themeColor.icon.photoAdd} />}
          {!selected && <VAIcon name={'Remove'} width={photoPreviewIconSize} height={photoPreviewIconSize} fill={themeColor.icon.deleteFill} />}
        </Box>
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{imageSize}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoPreview
