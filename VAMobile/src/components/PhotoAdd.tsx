import { Box, BoxProps, VAIcon } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { Pressable, PressableProps } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC } from 'react'
import TextView, { TextViewProps } from './TextView'

type PhotoAddProps = {
  width: number
  height: number
  onPressFunc: () => void
  testID?: string
}

const PhotoAdd: FC<PhotoAddProps> = ({ width, height, onPressFunc, testID }) => {
  const { colors: themeColor } = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

  const onPress = (): void => {
    onPressFunc()
  }

  const pressableProps: PressableProps = {
    onPress,
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
    variant: 'SnackBarBtnText',
    color: 'footerButton',
    textAlign: 'center',
  }

  return (
    <Pressable {...pressableProps} {...testIdProps(testID || '')}>
      <Box {...boxProps}>
        <VAIcon name={'Add'} width={32} height={32} fill={themeColor.icon.photoAdd} />
      </Box>
      <TextView {...textProps}>{t('fileUpload.addPhoto')}</TextView>
    </Pressable>
  )
}

export default PhotoAdd
