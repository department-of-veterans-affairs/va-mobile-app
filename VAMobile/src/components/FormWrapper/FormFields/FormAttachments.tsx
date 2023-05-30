import { Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, ReactNode } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import _ from 'underscore'

import { Box, ButtonTypesConstants, TextView, VAButton, VAButtonProps, VAIcon } from 'components/index'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { getFileDisplay } from 'utils/common'
import { useTheme } from 'utils/hooks'

export type FormAttachmentsProps = {
  /** callback called on click of remove link for an attachment */
  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void
  /** optional props for large button */
  largeButtonProps?: Omit<VAButtonProps, 'iconProps' | 'buttonType'>
  /** list of current attachments */
  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>
}

/**A common component for form attachments, displays Attachments heading with helper link, already attached items with remove option, and an optional large button. */
const FormAttachments: FC<FormAttachmentsProps> = ({ removeOnPress, largeButtonProps, attachmentsList }) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()

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
    fill2: theme.colors.icon.transparent,
  }

  const attachmentsDoNotExist = !attachmentsList || attachmentsList.length === 0

  return (
    <Box>
      <TextView>{t('attachments')}</TextView>
      <Box mt={theme.dimensions.standardMarginBetween} mb={attachmentsDoNotExist || !largeButtonProps ? 0 : theme.dimensions.standardMarginBetween}>
        {renderFileNames()}
      </Box>
      {!!largeButtonProps && <VAButton {...largeButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} iconProps={{ ...iconProps, fill: 'active', name: 'PaperClip' }} />}
    </Box>
  )
}

export default FormAttachments
