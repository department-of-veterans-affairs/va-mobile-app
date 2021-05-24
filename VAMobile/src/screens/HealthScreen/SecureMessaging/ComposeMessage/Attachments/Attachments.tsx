import React, { FC, ReactNode, useEffect, useState } from 'react'

import { StackHeaderLeftButtonProps, StackScreenProps } from '@react-navigation/stack'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'
import styled from 'styled-components'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { Image } from 'react-native'
import { ImageMaxWidthAndHeight, bytesToMegabytes, getMaxWidthAndHeightOfImage } from 'utils/common'
import { ImagePickerResponse } from 'react-native-image-picker'
import { NAMESPACE } from 'constants/namespaces'
import { formHeaders } from 'constants/secureMessaging'
import { onAddFileAttachments } from 'utils/secureMessaging'
import { testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useRouteNavigation, useTheme, useTranslation } from 'utils/hooks'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()

const StyledImage = styled(Image)<ImageMaxWidthAndHeight>`
  max-width: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.maxWidth)};
  height: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.height)}px;
`

type AttachmentsProps = StackScreenProps<HealthStackParamList, 'Attachments'>

const Attachments: FC<AttachmentsProps> = ({ navigation, route }) => {
  const t = useTranslation(NAMESPACE.HEALTH)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { showActionSheetWithOptions } = useActionSheet()
  const [error, setError] = useState('')
  const [image, setImage] = useState({} as ImagePickerResponse)
  const [file, setFile] = useState({} as DocumentPickerResponse)
  const { origin, attachmentsList, messageID } = route.params
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

  const getTotalBytesUsedByFiles = (): number => {
    const listOfFileSizes = _.map(attachmentsList, (attachment) => {
      return (attachment as ImagePickerResponse).fileSize || (attachment as DocumentPickerResponse).size || 0
    })

    return listOfFileSizes.reduce((a, b) => a + b, 0)
  }

  const getFileUris = (): Array<string> => {
    return _.map(attachmentsList, (attachment) => {
      // if the attachment is a file from DocumentPicker, get its uri
      if (_.has(attachment, 'name')) {
        return attachment.uri || ''
      }

      return ''
    }).filter(Boolean)
  }

  const onSelectAFile = (): void => {
    // For integration tests, bypass the file picking process
    if (IS_TEST) {
      return callbackOnSuccessfulFileSelection({ fileName: 'file.txt' }, true)
    }

    onAddFileAttachments(t, showActionSheetWithOptions, setError, callbackOnSuccessfulFileSelection, getTotalBytesUsedByFiles(), getFileUris())
  }

  const onAttach = (): void => {
    const attachmentFileToAdd = _.isEmpty(file) ? image : file
    if (origin === formHeaders.compose) {
      navigateTo('ComposeMessage', { attachmentFileToAdd, attachmentFileToRemove: {} })()
    } else {
      navigateTo('ReplyMessage', { messageId: messageID, attachmentFileToAdd, attachmentFileToRemove: {} })()
    }
  }

  const renderFileDisplay = (fileName: string, fileSize: number): ReactNode => {
    const formattedFileSize = fileSize ? `(${bytesToMegabytes(fileSize)} ${t('health:secureMessaging.viewMessage.attachments.MB')})` : ''
    const text = [fileName, formattedFileSize].join(' ').trim()
    return (
      <TextView variant="MobileBodyBold" mb={theme.dimensions.standardMarginBetween}>
        {text}
      </TextView>
    )
  }

  const displaySelectFile = _.isEmpty(image) && _.isEmpty(file)
  const imageMaxWidthAndHeight = getMaxWidthAndHeightOfImage(image, messagePhotoAttachmentMaxHeight)

  return (
    <VAScrollView {...testIdProps('Attachments-page')}>
      <Box mt={theme.dimensions.contentMarginTop} mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertBox text={error} background="noCardBackground" border="error" />
          </Box>
        )}
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
        {file && file.name && file.size && renderFileDisplay(file.name, file.size)}
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
              onPress={onAttach}
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
