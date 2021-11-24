import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { onAddPhotos } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'

type TakePhotosProps = StackScreenProps<ClaimsStackParamList, 'TakePhotos'>

const TakePhotos: FC<TakePhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request } = route.params
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
    })
  })

  const callbackIfUri = (response: ImagePickerResponse): void => {
    navigateTo('UploadOrAddPhotos', { request, firstImageResponse: response })()
  }

  return (
    <VAScrollView {...testIdProps("File-upload: Upload-your-request-to-V-A-using-your-phone's-camera-page")}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox text={error} border="error" background="noCardBackground" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {t('fileUpload.uploadFileUsingCamera')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.takePhotoEachPage')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} {...testIdProps(t('fileUpload.ifMoreThan10.a11y'))}>
          {t('fileUpload.ifMoreThan10')}
        </TextView>
        <Box mt={theme.dimensions.standardMarginBetween}>
          <AlertBox
            title={t('fileUpload.accessibilityAlert.title')}
            text={t('fileUpload.accessibilityAlert.body')}
            border="informational"
            background="noCardBackground"
            textA11yLabel={t('fileUpload.accessibilityAlert.body.a11y')}
          />
        </Box>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={(): void => onAddPhotos(t, showActionSheetWithOptions, setError, callbackIfUri, 0)}
            label={t('fileUpload.takePhotos')}
            testID={t('fileUpload.takePhotos')}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('fileUpload.takePhotosWithCameraA11yHint')}
          />
        </Box>
      </Box>
    </VAScrollView>
  )
}

export default TakePhotos
