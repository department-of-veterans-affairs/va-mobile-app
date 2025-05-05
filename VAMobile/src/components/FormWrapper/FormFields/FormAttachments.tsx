import React, { FC, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { Button, ButtonVariants, Icon } from '@department-of-veterans-affairs/mobile-component-library'
import _ from 'underscore'

import { Box, TextView } from 'components/index'
import { NAMESPACE } from 'constants/namespaces'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'
import { getFileDisplay } from 'utils/common'
import { useTheme } from 'utils/hooks'

export type FormAttachmentsProps = {
  /** callback called on click of remove link for an attachment */
  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void
  /**button label */
  buttonLabel?: string
  /**button onPress */
  buttonPress?: () => void
  /** optional TestID */
  testID?: string
  /** list of current attachments */
  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>
}

/** A common component for form attachments, displays Attachments heading with helper link,
 * already attached items with remove option, and an optional large button. */
const FormAttachments: FC<FormAttachmentsProps> = ({
  removeOnPress,
  buttonLabel,
  buttonPress,
  testID,
  attachmentsList,
}) => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { t: tFunction } = useTranslation()

  const renderFileNames = (): ReactNode => {
    return _.map(attachmentsList || [], (attachment, index) => {
      const { fileName, fileSize: formattedFileSize, fileSizeA11y } = getFileDisplay(attachment, tFunction, true)
      const text = [fileName, formattedFileSize].join(' ').trim()

      return (
        <Box key={index}>
          <Box
            flexDirection={'row'}
            mr={theme.dimensions.gutter}
            mt={index !== 0 ? theme.dimensions.condensedMarginBetween : 0}
            mb={theme.dimensions.condensedMarginBetween}>
            <Box mt={theme.dimensions.attachmentIconTopMargin} mr={theme.dimensions.textIconMargin}>
              <Icon name="AttachFile" width={20} height={20} fill={theme.colors.icon.spinner} />
            </Box>
            {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
            <TextView
              variant="MobileBodyBold"
              ml={theme.dimensions.textIconMargin}
              accessibilityLabel={fileSizeA11y ? [fileName, fileSizeA11y].join(' ').trim() : undefined}>
              {text}
            </TextView>
          </Box>
          <Button
            onPress={() => removeOnPress?.(attachment)}
            label={t('remove')}
            a11yHint={t('remove.a11yHint', { content: fileName })}
            buttonType={ButtonVariants.Destructive}
            testID={testID}
          />
        </Box>
      )
    })
  }

  const attachmentsDoNotExist = !attachmentsList || attachmentsList.length === 0

  return (
    <Box>
      <TextView>{t('attachments')}</TextView>
      <Box
        mt={theme.dimensions.standardMarginBetween}
        mb={attachmentsDoNotExist ? 0 : theme.dimensions.standardMarginBetween}>
        {renderFileNames()}
      </Box>
      {buttonLabel && buttonPress && (
        <Button
          label={buttonLabel}
          onPress={buttonPress}
          buttonType={ButtonVariants.Secondary}
          a11yLabel={buttonLabel}
          testID={testID}
        />
      )}
    </Box>
  )
}

export default FormAttachments
