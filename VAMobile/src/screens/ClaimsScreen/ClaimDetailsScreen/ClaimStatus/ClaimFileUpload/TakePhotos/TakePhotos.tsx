import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { useActionSheet } from '@expo/react-native-action-sheet'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { onAddPhotos } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import CollapsibleAlert from 'components/CollapsibleAlert'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_VA_GOV } = getEnv()

type TakePhotosProps = StackScreenProps<ClaimsStackParamList, 'TakePhotos'>

const TakePhotos: FC<TakePhotosProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const { request } = route.params
  const { displayName } = request
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
      {!!error && (
        <Box mb={theme.dimensions.standardMarginBetween}>
          <AlertBox text={error} border="error" />
        </Box>
      )}
      <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
        <CollapsibleAlert
          border="informational"
          headerText={t('fileUpload.accessibilityAlert.title')}
          bodyText={t('fileUpload.accessibilityAlert.body')}
          hasLink={true}
          linkText={t('fileUpload.goToVaGov')}
          linkUrl={LINK_URL_GO_TO_VA_GOV}
        />
      </Box>
      <TextArea>
        <TextView variant="MobileBodyBold" color={'primaryTitle'} accessibilityRole="header">
          {t('fileUpload.uploadFileUsingCamera', { displayName })}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.takePhotoEachPage')}
        </TextView>
        <TextView variant="MobileBody" mt={theme.dimensions.standardMarginBetween} {...testIdProps(t('fileUpload.ifMoreThan10.a11y'))}>
          {t('fileUpload.ifMoreThan10.1')}
          <TextView variant="MobileBodyBold">
            {t('fileUpload.ifMoreThan10.2')}
            <TextView variant="MobileBody">{t('fileUpload.ifMoreThan10.3')}</TextView>
          </TextView>
        </TextView>
        <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.maxFileSize')}
        </TextView>
        <TextView variant="MobileBody">{t('fileUpload.50MB')}</TextView>
        <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.acceptedFileTypes')}
        </TextView>
        <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
      </TextArea>
      <Box mt={theme.dimensions.textAndButtonLargeMargin}>
        <VAButton
          onPress={(): void => onAddPhotos(t, showActionSheetWithOptions, setError, callbackIfUri, 0)}
          label={t('fileUpload.takeOrSelectPhotos')}
          testID={t('fileUpload.takePhotos')}
          buttonType={ButtonTypesConstants.buttonPrimary}
          a11yHint={t('fileUpload.takePhotosWithCameraA11yHint')}
        />
      </Box>
    </VAScrollView>
  )
}

export default TakePhotos
