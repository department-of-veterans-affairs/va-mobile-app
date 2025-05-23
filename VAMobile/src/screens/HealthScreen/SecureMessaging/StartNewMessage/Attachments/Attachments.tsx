import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Image } from 'react-native'
import { ScrollView } from 'react-native'
import { Asset, ImagePickerResponse } from 'react-native-image-picker'

import { StackScreenProps } from '@react-navigation/stack'

import styled from 'styled-components'
import _ from 'underscore'

import { AlertWithHaptics, Box, FullScreenSubtask, TextView, VABulletList } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { FormHeaderTypeConstants } from 'constants/secureMessaging'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { HealthStackParamList } from 'screens/HealthScreen/HealthStackScreens'
import { logAnalyticsEvent } from 'utils/analytics'
import {
  ImageMaxWidthAndHeight,
  bytesToFinalSizeDisplay,
  bytesToFinalSizeDisplayA11y,
  getMaxWidthAndHeightOfImage,
} from 'utils/common'
import { useBeforeNavBackListener, useRouteNavigation, useShowActionSheet, useTheme } from 'utils/hooks'
import { onAddFileAttachments } from 'utils/secureMessaging'
import { themeFn } from 'utils/theme'

const StyledImage = styled(Image)<ImageMaxWidthAndHeight>`
  max-width: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.maxWidth)};
  height: ${themeFn<ImageMaxWidthAndHeight>((theme, props) => props.height)}px;
`

type AttachmentsProps = StackScreenProps<HealthStackParamList, 'Attachments'>

function Attachments({ navigation, route }: AttachmentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const showActionSheetWithOptions = useShowActionSheet()
  const [isActionSheetVisible, setIsActionSheetVisible] = useState(false)
  const [error, setError] = useState('')
  const [errorA11y, setErrorA11y] = useState('')
  const [image, setImage] = useState({} as ImagePickerResponse)
  const [file, setFile] = useState({} as DocumentPickerResponse)
  const scrollViewRef = useRef<ScrollView>(null)
  const { origin, attachmentsList, messageID } = route.params

  useBeforeNavBackListener(navigation, (e) => {
    if (isActionSheetVisible) {
      e.preventDefault()
    }
  })

  useEffect(() => {
    if (error !== '') {
      logAnalyticsEvent(Events.vama_sm_attach_outcome('false'))
    }
  }, [error])

  const callbackOnSuccessfulFileSelection = (
    response: ImagePickerResponse | DocumentPickerResponse,
    isImage: boolean,
  ): void => {
    logAnalyticsEvent(Events.vama_sm_attach_outcome('true'))
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
        fileSize = attachment.assets ? attachment.assets[0]?.fileSize || 0 : 0
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
    logAnalyticsEvent(Events.vama_sm_attach('Select a file'))
    onAddFileAttachments(
      t,
      showActionSheetWithOptions,
      setError,
      setErrorA11y,
      callbackOnSuccessfulFileSelection,
      getTotalBytesUsedByFiles(),
      getFileUris(),
      getImageBase64s(),
      setIsActionSheetVisible,
    )
  }

  const onAttach = (): void => {
    const attachmentFileToAdd = _.isEmpty(file) ? image : file
    if (origin === FormHeaderTypeConstants.compose) {
      navigateTo('StartNewMessage', { attachmentFileToAdd, attachmentFileToRemove: {} })
    } else if (origin === FormHeaderTypeConstants.reply) {
      navigateTo('ReplyMessage', { messageID, attachmentFileToAdd, attachmentFileToRemove: {} })
    } else {
      navigateTo('EditDraft', { messageID, attachmentFileToAdd, attachmentFileToRemove: {} })
    }
  }

  function renderFileDisplay(fileName: string, fileSize: number) {
    const formattedFileSize = fileSize ? bytesToFinalSizeDisplay(fileSize, tFunction) : ''
    const formattedFileSizeA11y = fileSize ? bytesToFinalSizeDisplayA11y(fileSize, tFunction) : ''
    const text = [fileName, formattedFileSize].join(' ').trim()
    const textA11y = [fileName, formattedFileSizeA11y].join(' ').trim()
    return (
      // eslint-disable-next-line react-native-a11y/has-accessibility-hint
      <TextView variant="MobileBodyBold" mb={theme.dimensions.standardMarginBetween} accessibilityLabel={textA11y}>
        {text}
      </TextView>
    )
  }

  const displaySelectFile = _.isEmpty(image) && _.isEmpty(file)
  const imageMaxWidthAndHeight = getMaxWidthAndHeightOfImage(image, 300)
  const { uri } = image.assets ? image.assets[0] : ({} as Asset)

  const bullets = [
    { text: t('attachments.bulletOne') },
    { text: t('attachments.bulletTwo') },
    { text: t('attachments.bulletThree'), a11yLabel: t('attachments.bulletThree.a11yLabel') },
    { text: t('attachments.bulletFour'), a11yLabel: t('attachments.bulletFour.a11yLabel') },
    { text: t('attachments.bulletFive') },
  ]

  return (
    <FullScreenSubtask
      scrollViewRef={scrollViewRef}
      title={t('secureMessaging.startNewMessage.attachments.title')}
      leftButtonText={t('cancel')}
      leftButtonTestID="attachmentsCancelID"
      onLeftButtonPress={navigation.goBack}
      primaryContentButtonText={
        displaySelectFile ? t('secureMessaging.attachments.selectAFile') : t('secureMessaging.startNewMessage.attach')
      }
      primaryButtonTestID="messagesSelectAFileID"
      onPrimaryContentButtonPress={displaySelectFile ? onSelectAFile : onAttach}>
      <Box mb={theme.dimensions.contentMarginBottom} mx={theme.dimensions.gutter}>
        {!!error && (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <AlertWithHaptics
              variant="error"
              description={error}
              descriptionA11yLabel={errorA11y}
              scrollViewRef={scrollViewRef}
            />
          </Box>
        )}
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('secureMessaging.attachments.whatToKnow')}
        </TextView>
        <VABulletList listOfText={bullets} />
        {image && uri && (
          // need to set label has \ufeff so that samsung just says image and not unlabeled image
          // eslint-disable-next-line react-native-a11y/has-accessibility-hint
          <Box
            mb={theme.dimensions.standardMarginBetween}
            accessibilityRole="image"
            accessible={true}
            accessibilityLabel={'\ufeff'}>
            <StyledImage
              source={{ uri }}
              height={imageMaxWidthAndHeight.height}
              maxWidth={imageMaxWidthAndHeight.maxWidth}
            />
          </Box>
        )}
        {file?.name && file?.size && renderFileDisplay(file.name, file.size)}
      </Box>
    </FullScreenSubtask>
  )
}

export default Attachments
