import { NAMESPACE } from 'constants/namespaces'
import { Pressable, PressableProps } from 'react-native'
import { VAIcon } from './index'
import { bytesToFinalSizeDisplay } from 'utils/common'
import { testIdProps } from 'utils/accessibility'
import { useActionSheet } from '@expo/react-native-action-sheet'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import React, { FC, ReactNode, useState } from 'react'
import TextView, { TextViewProps } from './TextView'

type PhotoPreviewProps = {
  width: number
  height: number
  styledImage: ReactNode
  fileSize?: number
  onDeleteCallback: () => void
  lastPhoto?: boolean
  testID?: string
}

const PhotoPreview: FC<PhotoPreviewProps> = ({ width, height, styledImage, fileSize, onDeleteCallback, lastPhoto, testID }) => {
  const { colors: themeColor } = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)
  const { showActionSheetWithOptions } = useActionSheet()
  const [selected, setSelected] = useState(false)

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
    variant: 'SnackBarBtnText',
    color: 'primary',
  }

  return (
    <Pressable {...pressableProps} {...testIdProps(testID || '')}>
      <Box {...boxProps}>
        <Box>{styledImage}</Box>
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
