import React, { FC, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'
import styled from 'styled-components'

import { BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { Image } from 'react-native'
import { ImageMaxWidthAndHeight, getMaxWidthAndHeightOfImage } from 'utils/common'
import { ImagePickerResponse } from 'react-native-image-picker'
import { NAMESPACE } from 'constants/namespaces'
import { onAddFileAttachments } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme, useTranslation } from 'utils/hooks'

const StyledImage = styled(Image)<ImageMaxWidthAndHeight>`
  max-width: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.maxWidth)};
  height: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.height)}px;
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

  const displaySelectFile = _.isEmpty(image) && _.isEmpty(file)
  const imageMaxWidthAndHeight = getMaxWidthAndHeightOfImage(image, messagePhotoAttachmentMaxHeight)

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
            <StyledImage source={{ uri: image.uri }} height={imageMaxWidthAndHeight.height} maxWidth={imageMaxWidthAndHeight.maxWidth} />
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
