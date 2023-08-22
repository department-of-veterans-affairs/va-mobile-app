import { Image, Pressable, PressableProps } from 'react-native'
import { ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useTranslation } from 'react-i18next'
import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'

import { NAMESPACE } from 'constants/namespaces'
import { VAIcon } from './index'
import { themeFn } from 'utils/theme'
import { useDestructiveActionSheet, useShowActionSheet } from 'utils/hooks'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import theme from 'styles/themes/standardTheme'

type PhotoUploadProps = {
  /** width of the photo */
  width: number
  /** height of the photo */
  height: number
}

type StyledImageProps = {
  /** prop to set image width */
  width: number
  /** prop to set image height */
  height: number
  /** Hardcoded radius of 50 due to circular design plan */
  borderRadius: number
  /** Hardcoded radius of 2 due to design plan */
  borderWidth: number
  /** Hardcoded border color of white */
  borderColor: string
}

const StyledImage = styled(Image)<StyledImageProps>`
  width: ${themeFn<StyledImageProps>((_theme, props) => props.width)}px;
  height: ${themeFn<StyledImageProps>((_theme, props) => props.height)}px;
  border-radius: ${themeFn<StyledImageProps>((_theme, props) => props.borderRadius)}px;
  border-width: ${themeFn<StyledImageProps>((_theme, props) => props.borderWidth)}px;
  border-color: ${themeFn<StyledImageProps>((_theme, props) => props.borderColor)};
`
//TODO: Add this back to the VeteranStatusScreen when decided upon
const PhotoUpload: FC<PhotoUploadProps> = ({ width, height }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const confirmAlert = useDestructiveActionSheet()
  const photoUploadBorderRadius = 50
  const photoUploadBorderWidth = 2
  const showActionSheetWithOptions = useShowActionSheet()
  const VETERAN_STATUS_PHOTO_KEY = '@store_veteran_status_photo'
  const [uri, setUri] = useState('')
  const options = [t('fileUpload.camera'), t('fileUpload.photoGallery'), t('cancel')]
  const uploadBorderColor = theme.colors.border.photoUpload

  const getPhotoFromStorage = async (): Promise<void> => {
    const storedUri = await AsyncStorage.getItem(VETERAN_STATUS_PHOTO_KEY)
    if (storedUri) {
      setUri(storedUri)
    }
  }

  useEffect(() => {
    if (uri === '') {
      getPhotoFromStorage()
    }
  }, [uri])

  const photo = (
    <StyledImage source={{ uri }} width={width} height={height} borderRadius={photoUploadBorderRadius} borderWidth={photoUploadBorderWidth} borderColor={uploadBorderColor} />
  )

  const uploadCallback = (response: ImagePickerResponse): void => {
    const { assets, errorMessage, didCancel } = response
    const picture = assets?.[0]?.uri
    if (didCancel) {
      return
    } else if (errorMessage) {
      //TODO Snackbar in this case? Discuss error cases
      return
    } else if (picture) {
      setUri(picture)
      AsyncStorage.setItem(VETERAN_STATUS_PHOTO_KEY, picture)
    } else {
      return
    }
  }

  const onPress = (): void => {
    if (uri) {
      confirmAlert({
        title: t('removePhoto'),
        cancelButtonIndex: 0,
        destructiveButtonIndex: 1,
        buttons: [
          {
            text: t('keep'),
            onPress: () => {},
          },
          {
            text: t('remove'),
            onPress: () => {
              setUri('')
              AsyncStorage.setItem(VETERAN_STATUS_PHOTO_KEY, '')
            },
          },
        ],
      })
    } else {
      showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 2,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              launchCamera({ mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
                uploadCallback(response)
              })
              break
            case 1:
              launchImageLibrary({ selectionLimit: 1, mediaType: 'photo', quality: 0.9, includeBase64: true }, (response: ImagePickerResponse): void => {
                uploadCallback(response)
              })
              break
          }
        },
      )
    }
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessibilityLabel: uri ? t('veteranStatus.editPhoto') : t('veteranStatus.uploadPhoto'),
  }

  const boxProps: BoxProps = {
    borderRadius: photoUploadBorderRadius,
    width: width,
    height: height,
    alignItems: 'center',
  }

  return (
    <Pressable {...pressableProps}>
      {uri ? (
        <Box {...boxProps} mb={20}>
          {photo}
          <TextView color="primaryContrast" variant="HelperText">
            {t('veteranStatus.editPhoto')}
          </TextView>
        </Box>
      ) : (
        <Box {...boxProps} mb={20}>
          <VAIcon name="UploadPhoto" />
          <TextView color="primaryContrast" variant="HelperText">
            {t('veteranStatus.uploadPhoto')}
          </TextView>
        </Box>
      )}
    </Pressable>
  )
}

export default PhotoUpload
