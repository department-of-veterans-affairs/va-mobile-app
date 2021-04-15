import React, { FC, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'
import styled from 'styled-components'

import { BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { Dimensions, Image } from 'react-native'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { ImagePickerResponse } from 'react-native-image-picker'
import { NAMESPACE } from 'constants/namespaces'
import { onAddFileAttachments } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme, useTranslation } from 'utils/hooks'

type StyledImageProps = {
  maxWidth: string
  height: number
}

const StyledImage = styled(Image)<StyledImageProps>`
  max-width: ${themeFn<StyledImageProps>((theme, props) => props.maxWidth)};
  height: ${themeFn<StyledImageProps>((theme, props) => props.height)}px;
`

type AttachmentsProps = StackScreenProps<HealthStackParamList, 'Attachments'>

const Attachments: FC<AttachmentsProps> = ({ navigation }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const { showActionSheetWithOptions } = useActionSheet()
  const [error, setError] = useState('')
  const [image, setImage] = useState({} as ImagePickerResponse)
  const [file, setFile] = useState({} as DocumentPickerResponse)
  const { messagePhotoAttachmentMaxHeight } = theme.dimensions

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => (
        <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />
      ),
    })
  })

  const callbackOnSuccessfulFileSelection = (response: ImagePickerResponse | DocumentPickerResponse, isImage: boolean): void => {
    // display image preview
    if (isImage) {
      setImage(response as ImagePickerResponse)
      return
    }

    // display file name
    setFile(response as DocumentPickerResponse)
  }

  const onSelectAFile = (): void => {
    onAddFileAttachments(t, showActionSheetWithOptions, setError, callbackOnSuccessfulFileSelection, 0)
  }

  // if the image width exists and is less than the screen width, set the max width to the images width. otherwise, set the
  // max width to 100%
  const imageMaxWidth = image && image.width && image.width < Dimensions.get('window').width ? `${image.width}px` : '100%'

  // if the image height exists and is less than the max image height, set the height to the images height. otherwise, set
  // the height to the max height
  const imageHeight = image && image.height && image.height < messagePhotoAttachmentMaxHeight ? image.height : messagePhotoAttachmentMaxHeight

  const displaySelectFile = _.isEmpty(image) && _.isEmpty(file)

  return (
    <VAScrollView {...testIdProps('Attachments-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {/*TODO: Replace error with mobile alert with error*/}
        {!!error && <TextView>{error}</TextView>}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.attachments.fileAttachment')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.youMayAttach')}
        </TextView>
        <TextView variant="MobileBody">{t('secureMessaging.attachments.acceptedFileTypes')}</TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.sizeRequirements')}
        </TextView>
        {image && image.uri && (
          <Box mb={theme.dimensions.standardMarginBetween} accessibilityRole="image">
            <StyledImage source={{ uri: image.uri }} height={imageHeight} maxWidth={imageMaxWidth} />
          </Box>
        )}
        {file && file.name && (
          <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
            {file.name}
          </TextView>
        )}
        {displaySelectFile && (
          <VAButton
            label={t('secureMessaging.attachments.selectAFile')}
            onPress={onSelectAFile}
            buttonType={ButtonTypesConstants.buttonPrimary}
            a11yHint={t('secureMessaging.attachments.selectAFile.a11yHint')}
          />
        )}
        {!displaySelectFile && (
          <Box>
            <VAButton
              label={t('secureMessaging.composeMessage.attach')}
              onPress={() => {}}
              buttonType={ButtonTypesConstants.buttonPrimary}
              a11yHint={t('secureMessaging.composeMessage.attach.a11yHint')}
            />
            <Box mt={theme.dimensions.standardMarginBetween}>
              <VAButton
                label={t('common:cancel')}
                onPress={() => navigation.goBack()}
                buttonType={ButtonTypesConstants.buttonSecondary}
                a11yHint={t('secureMessaging.composeMessage.attach.cancel.a11yHint')}
              />
            </Box>
          </Box>
        )}
      </Box>
    </VAScrollView>
  )
}

export default Attachments
