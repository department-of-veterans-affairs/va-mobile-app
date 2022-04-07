import { Asset } from 'react-native-image-picker/src/types'
import { Image, Pressable, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useState } from 'react'
import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { VAIcon } from './index'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { themeFn } from 'utils/theme'
import { useDestructiveAlert, useTheme } from 'utils/hooks'
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
  /** flag for whether this is the last photo available for deletion */
  lastPhoto?: boolean
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

const PhotoPreview: FC<PhotoPreviewProps> = ({ width, height, image, onDeleteCallback, lastPhoto, photoPosition }) => {
  const { colors: themeColor, dimensions: themeDim } = useTheme()
  const { t } = useTranslation(NAMESPACE.CLAIMS)
  const { t: tc } = useTranslation(NAMESPACE.COMMON)
  const [selected, setSelected] = useState(false)
  const uri = image.uri
  const confirmAlert = useDestructiveAlert()

  const photo = (): ReactNode => {
    return <StyledImage source={{ uri }} width={width} height={height} borderRadius={themeDim.photoPreviewBorderRadius} />
  }

  const onPress = (): void => {
    setSelected(true)
    const message = lastPhoto ? t('fileUpload.deletePopupNavWarning') : undefined

    confirmAlert({
      title: t('fileUpload.deletePopup'),
      message,
      cancelButtonIndex: 0,
      destructiveButtonIndex: 1,
      buttons: [
        {
          text: tc('cancel'),
          onPress: () => {
            setSelected(false)
          },
        },
        {
          text: t('fileUpload.delete'),
          onPress: () => {
            setSelected(false)
            onDeleteCallback()
          },
        },
      ],
    })
  }

  const imageSize = image.fileSize ? bytesToFinalSizeDisplay(image.fileSize, t, false) : undefined

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessibilityHint: t('fileUpload.deletePhoto.a11yHint'),
    accessibilityLabel: imageSize ? photoPosition?.concat(imageSize) : photoPosition,
  }

  const boxProps: BoxProps = {
    borderRadius: themeDim.photoPreviewBorderRadius,
    width: width,
    height: height,
  }

  const blueOpacity: BoxProps = {
    borderRadius: themeDim.photoPreviewBorderRadius,
    width: width,
    height: height,
    opacity: 0.4,
    backgroundColor: 'profileBanner',
    position: 'absolute',
  }

  const textProps: TextViewProps = {
    variant: 'HelperText',
    color: 'bodyText',
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <Box>{photo()}</Box>
        {selected && <Box {...blueOpacity} />}
        <Box pt={themeDim.photoPreviewIconPadding} pr={themeDim.photoPreviewIconPadding} position="absolute" alignSelf="flex-end">
          {selected && <VAIcon name={'Minus'} width={themeDim.photoPreviewIconSize} height={themeDim.photoPreviewIconSize} fill={themeColor.icon.photoAdd} />}
          {!selected && <VAIcon name={'Delete'} width={themeDim.photoPreviewIconSize} height={themeDim.photoPreviewIconSize} fill={themeColor.icon.deleteFill} />}
        </Box>
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{imageSize}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoPreview
