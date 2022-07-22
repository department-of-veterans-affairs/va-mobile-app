import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import {
  AlertBox,
  BackButton,
  Box,
  ButtonTypesConstants,
  ClickForActionLink,
  LinkButtonProps,
  LinkTypeOptionsConstants,
  LinkUrlIconType,
  TextArea,
  TextView,
  VAButton,
  VAScrollView,
} from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { MAX_NUM_PHOTOS } from 'constants/claims'
import { NAMESPACE } from 'constants/namespaces'
import { onAddPhotos } from 'utils/claims'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import CollapsibleAlert from 'components/CollapsibleAlert'
import getEnv from 'utils/env'

const { LINK_URL_GO_TO_VA_GOV } = getEnv()

type TakePhotosProps = StackScreenProps<ClaimsStackParamList, 'TakePhotos'>

const TakePhotos: FC<TakePhotosProps> = ({ navigation, route }) => {
  const { t } = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheetWithOptions = useShowActionSheet()
  const { request, focusOnSnackbar } = route.params
  const { displayName } = request
  const [error, setError] = useState('')

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props): ReactNode => (
        <BackButton onPress={onBack} focusOnButton={focusOnSnackbar ? false : true} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const onBack = () => {
    navigation.goBack()
  }

  const callbackIfUri = (response: ImagePickerResponse): void => {
    if (response.assets && response.assets.length > MAX_NUM_PHOTOS) {
      setError(t('fileUpload.tooManyPhotosError'))
    } else {
      navigateTo('UploadOrAddPhotos', { request, firstImageResponse: response })()
    }
  }

  const collapsibleContent = (): ReactNode => {
    const linkToCallProps: LinkButtonProps = {
      testID: t('fileUpload.goToVaGov'),
      displayedText: t('fileUpload.goToVaGov'),
      linkType: LinkTypeOptionsConstants.url,
      linkUrlIconType: LinkUrlIconType.Arrow,
      numberOrUrlLink: LINK_URL_GO_TO_VA_GOV,
    }

    return (
      <Box mt={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBody" accessibilityLabel={t('fileUpload.accessibilityAlert.body.a11y')}>
          {t('fileUpload.accessibilityAlert.body')}
        </TextView>
        <ClickForActionLink {...linkToCallProps} />
      </Box>
    )
  }

  return (
    <VAScrollView {...testIdProps("File-upload: Upload-your-request-to-V-A-using-your-phone's-camera-page")}>
      {!!error && (
        <Box mt={theme.dimensions.contentMarginTop} mx={theme.dimensions.gutter}>
          <AlertBox text={error} border="error" />
        </Box>
      )}
      <Box mt={theme.dimensions.standardMarginBetween} mb={theme.dimensions.standardMarginBetween}>
        <CollapsibleAlert
          border="informational"
          headerText={t('fileUpload.accessibilityAlert.title')}
          body={collapsibleContent()}
          a11yLabel={t('fileUpload.accessibilityAlert.title')}
        />
      </Box>
      <TextArea>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
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
        <TextView variant="MobileBody" accessibilityLabel={t('fileUpload.50MB.a11y')}>
          {t('fileUpload.50MB')}
        </TextView>
        <TextView variant="MobileBodyBold" mt={theme.dimensions.standardMarginBetween}>
          {t('fileUpload.acceptedFileTypes')}
        </TextView>
        <TextView variant="MobileBody">{t('fileUpload.acceptedFileTypeOptions')}</TextView>
      </TextArea>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
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
