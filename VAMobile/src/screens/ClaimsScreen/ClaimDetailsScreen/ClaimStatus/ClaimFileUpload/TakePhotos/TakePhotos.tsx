import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { AlertBox, BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type TakePhotosProps = StackScreenProps<ClaimsStackParamList, 'TakePhotos'>

const TakePhotos: FC<TakePhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request } = route.params
  const [fileSizeError, setFileSizeError] = useState(false)

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const updateFileSizeError = (fileSize: number | undefined): void => {
    if (fileSize && fileSize > theme.dimensions.maxFileSizeInBytes) {
      setFileSizeError(true)
    } else {
      setFileSizeError(false)
    }
  }

  const onTakePhotos = (): void => {
    const options = [t('fileUpload.camera'), t('fileUpload.cameraRoll'), t('fileUpload.cancel')]

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            launchCamera({ mediaType: 'photo' }, (response: ImagePickerResponse): void => {
              updateFileSizeError(response.fileSize)
            })
            break
          case 1:
            launchImageLibrary({ mediaType: 'photo' }, (response: ImagePickerResponse): void => {
              updateFileSizeError(response.fileSize)
            })
        }
      },
    )
  }

  return (
    <ScrollView {...testIdProps("File upload: Upload your request to V-A using your phone's camera")}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.uploadRequestUsingCamera', { requestTitle: request.displayName || t('fileUpload.request') })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
          {t('fileUpload.youMayAddUpTo10Photos')}
        </TextView>
        {/* TODO: Update error message for when the file size is too big */}
        {fileSizeError && (
          <Box mt={theme.dimensions.marginBetween}>
            <AlertBox title="Error: file size is over 50 MB" border="error" background="noCardBackground" />
          </Box>
        )}
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={onTakePhotos}
            label={t('fileUpload.takePhotos')}
            testID={t('fileUpload.takePhotos')}
            textColor="primaryContrast"
            backgroundColor="button"
            a11yHint={t('fileUpload.takePhotosWithCameraA11yHint')}
          />
        </Box>
      </Box>
    </ScrollView>
  )
}

export default TakePhotos
