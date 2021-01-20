import { ScrollView } from 'react-native'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
import { NAMESPACE } from 'constants/namespaces'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

type TakePhotosProps = StackScreenProps<ClaimsStackParamList, 'TakePhotos'>

const TakePhotos: FC<TakePhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request } = route.params

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onTakePhotos = (): void => {
    const options = [t('fileUpload.camera'), t('fileUpload.gallery'), t('fileUpload.cancel')]

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            launchCamera({ mediaType: 'photo', quality: 0.9 }, (response: ImagePickerResponse): void => {
              console.log('DONE ', response.fileSize, response.errorMessage)
            })
            break
          case 1:
            launchImageLibrary({ mediaType: 'photo', quality: 0.9 }, (response: ImagePickerResponse): void => {
              console.log('DONE ', response.fileSize)
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
