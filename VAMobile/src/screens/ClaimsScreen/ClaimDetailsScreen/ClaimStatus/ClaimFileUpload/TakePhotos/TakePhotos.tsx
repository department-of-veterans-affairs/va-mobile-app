import { ScrollView } from 'react-native'
import { StackHeaderLeftButtonProps } from '@react-navigation/stack'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { AlertBox, BackButton, Box, TextView, VAButton } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsScreen'
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
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const callbackIfUri = (response: ImagePickerResponse): void => {
    navigateTo('UploadOrAddPhotos', { request, firstImageResponse: response })()
  }

  return (
    <ScrollView {...testIdProps("File upload: Upload your request to V-A using your phone's camera")}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.marginBetween}>
            <AlertBox text={error} border="error" background="noCardBackground" />
          </Box>
        )}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('fileUpload.uploadRequestUsingCamera', { requestTitle: request.displayName || t('fileUpload.request') })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.marginBetween}>
          {t('fileUpload.youMayAddUpTo10Photos')}
        </TextView>
        <Box mt={theme.dimensions.textAndButtonLargeMargin}>
          <VAButton
            onPress={(): void => onAddPhotos(t, showActionSheetWithOptions, setError, callbackIfUri, 0)}
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
