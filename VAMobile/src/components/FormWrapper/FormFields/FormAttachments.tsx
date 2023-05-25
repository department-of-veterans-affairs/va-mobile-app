import { Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import _ from 'underscore'

import { Box, ButtonTypesConstants, TextView, VAButton, VAButtonProps, VAIcon } from 'components/index'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { VATheme } from 'styles/theme'
import { getFileDisplay } from 'utils/common'
import { useRouteNavigation } from 'utils/hooks'
import { useTheme } from 'styled-components'

export type FormAttachmentsProps = {
  /** header for page title display */
  originHeader: string
  /** callback called on click of remove link for an attachment */
  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void
  /** optional props for large button */
  largeButtonProps?: Omit<VAButtonProps, 'iconProps' | 'buttonType'>
  /** list of current attachments */
  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>
  /** optional a11y Hint */
  a11yHint?: string
}

/**A common component for form attachments, displays Attachments heading with helper link, already attached items with remove option, and an optional large button. */
const FormAttachments: FC<FormAttachmentsProps> = ({ originHeader, removeOnPress, largeButtonProps, attachmentsList, a11yHint }) => {
  const theme = useTheme() as VATheme
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()
  const navigateTo = useRouteNavigation()

  const renderFileNames = (): ReactNode => {
    return _.map(attachmentsList || [], (attachment, index) => {
      const { fileName, fileSize: formattedFileSize, fileSizeA11y } = getFileDisplay(attachment, tFunction, true)
      const text = [fileName, formattedFileSize].join(' ').trim()

      return (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          mt={index !== 0 ? theme.dimensions.condensedMarginBetween : 0}
          key={index}>
          <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap" justifyContent="space-between">
            <VAIcon name="PaperClip" width={16} height={16} fill="spinner" />
            <TextView variant="MobileBodyBold" ml={theme.dimensions.textIconMargin} accessibilityLabel={fileSizeA11y ? [fileName, fileSizeA11y].join(' ').trim() : undefined}>
              {text}
            </TextView>
          </Box>

          <Pressable
            onPress={() => (removeOnPress ? removeOnPress(attachment) : {})}
            accessible={true}
            accessibilityRole="link"
            accessibilityHint={t('remove.a11yHint', { content: fileName })}
            accessibilityLabel={t('remove')}>
            <Box display="flex" flexDirection="row" alignItems="center" minHeight={theme.dimensions.touchableMinHeight}>
              <VAIcon name="Remove" {...iconProps} />
              <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline" textDecorationColor="link">
                {t('remove')}
              </TextView>
            </Box>
          </Pressable>
        </Box>
      )
    })
  }

  const iconProps = {
    width: 16,
    height: 16,
    fill: 'link',
  }

  const attachmentsDoNotExist = !attachmentsList || attachmentsList.length === 0

  const goToFaq = navigateTo('AttachmentsFAQ', { originHeader: originHeader })

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="center" flexWrap="wrap">
        <TextView>{t('attachments')}</TextView>
        <Pressable onPress={goToFaq} accessible={true} accessibilityRole="link" accessibilityHint={a11yHint ? a11yHint : undefined} accessibilityLabel={t('howToAttachAFile')}>
          <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" minHeight={theme.dimensions.touchableMinHeight}>
            <VAIcon name="QuestionMark" {...iconProps} />
            <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline" textDecorationColor="link">
              {t('howToAttachAFile')}
            </TextView>
          </Box>
        </Pressable>
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween} mb={attachmentsDoNotExist || !largeButtonProps ? 0 : theme.dimensions.standardMarginBetween}>
        {renderFileNames()}
      </Box>
      {!!largeButtonProps && <VAButton {...largeButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} iconProps={{ ...iconProps, fill: 'active', name: 'PaperClip' }} />}
    </Box>
  )
}

export default FormAttachments
