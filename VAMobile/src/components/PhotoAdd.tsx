import { Box, BoxProps, VAIcon } from './index'
import { NAMESPACE } from 'constants/namespaces'
import { Pressable, PressableProps } from 'react-native'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import React, { FC } from 'react'
import TextView, { TextViewProps } from './TextView'

type PhotoAddProps = {
  /** width of the component */
  width: number
  /** height of the component */
  height: number
  /** Add Photo on press with error and success callback */
  onPress: () => void
  /** TestID for the pressable */
  testID?: string
}

const PhotoAdd: FC<PhotoAddProps> = ({ width, height, onPress, testID }) => {
  const { colors: themeColor } = useTheme()
  const t = useTranslation(NAMESPACE.CLAIMS)

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
    variant: 'HelperTextBold',
    color: 'footerButton',
    textAlign: 'center',
    width: width,
  }

  return (
    <Pressable {...pressableProps} {...testIdProps(testID || '')}>
      <Box {...boxProps}>
        <VAIcon name={'Add'} width={32} height={32} fill={themeColor.icon.photoAdd} />
      </Box>
      <Box width={width} flexDirection="row">
        <TextView {...textProps}>{t('fileUpload.addPhoto')}</TextView>
      </Box>
    </Pressable>
  )
}

export default PhotoAdd
