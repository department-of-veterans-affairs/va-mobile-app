import { Asset, ImagePickerResponse } from 'react-native-image-picker/src/types'
import { Image, Pressable, PressableProps } from 'react-native'
import { NAMESPACE } from 'constants/namespaces'
import { VAIcon } from './index'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import React, { FC, ReactNode, useState } from 'react'
import TextView, { TextViewProps } from './TextView'
import styled from 'styled-components'

type PhotoPreviewProps = {
  /** width of the photo */
  width: number
  /** height of the photo */
  height: number
  /** imagePickerResponse with asset to style for component and fileSize */
  image: ImagePickerResponse
  /** function callback for if deletion is selected */
  onDeleteCallback: () => void
  /** flag for whether this is the last photo available for deletion */
  lastPhoto?: boolean
  /** TestID String */
  testID?: string
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
  width: ${themeFn<StyledImageProps>((theme, props) => props.width)}px;
  height: ${themeFn<StyledImageProps>((theme, props) => props.height)}px;
  border-radius: ${themeFn<StyledImageProps>((theme, props) => props.borderRadius)}px;
`

const PhotoPreview: FC<PhotoPreviewProps> = ({ width, height, image, onDeleteCallback, lastPhoto, testID }) => {
  const { colors: themeColor } = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const { showActionSheetWithOptions } = useActionSheet()
  const [selected, setSelected] = useState(false)
  const { fileSize, uri } = image.assets ? image.assets[0] : ({} as Asset)

  const photo = (): ReactNode => {
    return <StyledImage source={{ uri }} width={width} height={height} borderRadius={5} />
  }

  const onPress = (): void => {
    setSelected(true)
    const title = t('fileUpload.deletePopup')
    const message = lastPhoto ? t('fileUpload.deletePopupNavWarning') : undefined
    const options = [t('fileUpload.delete'), t('common:cancel')]
    showActionSheetWithOptions(
      {
        title,
        message,
        options,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            onDeleteCallback()
            setSelected(false)
            break
          case 1:
            setSelected(false)
            break
        }
      },
    )
  }

  const pressableProps: PressableProps = { onPress }

  const boxProps: BoxProps = {
    borderRadius: 5,
    width: width,
    height: height,
  }

  const blueOpacity: BoxProps = {
    borderRadius: 5,
    width: width,
    height: height,
    opacity: 0.4,
    backgroundColor: 'profileBanner',
    position: 'absolute',
  }

  const textProps: TextViewProps = {
    variant: 'HelperText',
    color: 'brandedPrimaryText',
  }

  return (
    <Pressable {...pressableProps} {...testIdProps(testID || '')}>
      <Box {...boxProps}>
        <Box>{photo()}</Box>
        {selected && <Box {...blueOpacity} />}
        <Box pt={5} pr={5} position="absolute" alignSelf="flex-end">
          {selected && <VAIcon name={'Minus'} width={24} height={24} fill={themeColor.icon.photoAdd} />}
          {!selected && <VAIcon name={'Delete'} width={24} height={24} fill={themeColor.icon.deleteFill} />}
        </Box>
      </Box>
      <TextView {...textProps}>{fileSize ? bytesToFinalSizeDisplay(fileSize, t) : undefined}</TextView>
    </Pressable>
  )
}

export default PhotoPreview
