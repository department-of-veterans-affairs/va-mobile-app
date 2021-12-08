import React, { FC, ReactNode, useEffect, useState } from 'react'

import { StackScreenProps } from '@react-navigation/stack'
import { useActionSheet } from '@expo/react-native-action-sheet'
import _ from 'underscore'
import styled from 'styled-components'

import { AlertBox, BackButton, Box, ButtonTypesConstants, TextView, VAButton, VAScrollView } from 'components'
import { Asset, ImagePickerResponse } from 'react-native-image-picker'
import { BackButtonLabelConstants } from 'constants/backButtonLabels'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { Image } from 'react-native'
import { ImageMaxWidthAndHeight, bytesToFinalSizeDisplay, getMaxWidthAndHeightOfImage } from 'utils/common'
import { NAMESPACE } from 'constants/namespaces'
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
  const tFunction = useTranslation()
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
      headerLeft: (props): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} label={BackButtonLabelConstants.cancel} showCarat={false} />,
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
      let fileSize = 0
      if ('assets' in attachment) {
        fileSize = attachment.assets ? attachment.assets[0].fileSize || 0 : 0
      } else if ('size' in attachment) {
        fileSize = attachment.size
      }
      return fileSize
    })

    return listOfFileSizes.reduce((a, b) => a + b, 0)
  }

  const getFileUris = (): Array<string> => {
    return _.map(attachmentsList, (attachment) => {
      // if the attachment is a file from DocumentPicker, get its uri
      if (_.has(attachment, 'name')) {
        return (attachment as DocumentPickerResponse).uri || ''
      }

      return ''
    }).filter(Boolean)
  }

  const getImageBase64s = (): Array<string> => {
    return _.map(attachmentsList, (attachment) => {
      // if the attachment is a file from ImagePicker, get its base64 value
      if ('assets' in attachment) {
        const { base64 } = attachment.assets ? attachment.assets[0] : ({} as Asset)
        return base64 || ''
      }

      return ''
    }).filter(Boolean)
  }

  const onSelectAFile = (): void => {
    // For integration tests, bypass the file picking process
    if (IS_TEST) {
      const img = { fileName: 'file.txt' } as Asset
      const assets = [img]
      return callbackOnSuccessfulFileSelection({ assets }, true)
    }

    onAddFileAttachments(t, showActionSheetWithOptions, setError, callbackOnSuccessfulFileSelection, getTotalBytesUsedByFiles(), getFileUris(), getImageBase64s())
  }

  const onAttach = (): void => {
    const attachmentFileToAdd = _.isEmpty(file) ? image : file
    if (origin === FormHeaderTypeConstants.compose) {
      navigateTo('ComposeMessage', { attachmentFileToAdd, attachmentFileToRemove: {} })()
    } else if (origin === FormHeaderTypeConstants.reply) {
      navigateTo('ReplyMessage', { messageID, attachmentFileToAdd, attachmentFileToRemove: {} })()
    } else {
      navigateTo('EditDraft', { messageID, attachmentFileToAdd, attachmentFileToRemove: {} })()
    }
  }

  const renderFileDisplay = (fileName: string, fileSize: number): ReactNode => {
    const formattedFileSize = fileSize ? bytesToFinalSizeDisplay(fileSize, tFunction) : ''
    const text = [fileName, formattedFileSize].join(' ').trim()
    return (
      <TextView variant="MobileBodyBold" mb={theme.dimensions.standardMarginBetween}>
        {text}
      </TextView>
    )
  }

  const displaySelectFile = _.isEmpty(image) && _.isEmpty(file)
  const imageMaxWidthAndHeight = getMaxWidthAndHeightOfImage(image, messagePhotoAttachmentMaxHeight)
  const { uri } = image.assets ? image.assets[0] : ({} as Asset)

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
          {t('secureMessaging.attachments.youMayAttach')} {t('secureMessaging.attachments.acceptedFileTypes')}
        </TextView>
        <TextView variant="MobileBody" my={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.sizeRequirements')}
        </TextView>
        <TextView variant="MobileBody" mb={theme.dimensions.standardMarginBetween}>
          {t('secureMessaging.attachments.attachmentsAreNotDrafts')}
        </TextView>
        {image && uri && (
          // need to set label has \ufeff so that samsung just says image and not unliable image
          <Box mb={theme.dimensions.standardMarginBetween} accessibilityRole="image" accessible={true} accessibilityLabel={'\ufeff'}>
            <StyledImage source={{ uri }} height={imageMaxWidthAndHeight.height} maxWidth={imageMaxWidthAndHeight.maxWidth} />
          </Box>
        )}
        {file?.name && file?.size && renderFileDisplay(file.name, file.size)}
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
