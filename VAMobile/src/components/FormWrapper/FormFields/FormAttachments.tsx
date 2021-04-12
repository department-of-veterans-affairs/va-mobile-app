import React, { FC, ReactNode } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import _ from 'underscore'

import { Box, ButtonTypesConstants, TextView, VAButton, VAButtonProps, VAIcon } from 'components/index'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'

export type FormAttachmentsProps = {
  /** callback called on click of remove link for an attachment */
  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void
  /** optional props for large button */
  largeButtonProps?: Omit<VAButtonProps, 'iconProps' | 'buttonType'>
  /** list of current attachments */
  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>
}

const FormAttachments: FC<FormAttachmentsProps> = ({ removeOnPress, largeButtonProps, attachmentsList }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.COMMON)

  const renderFileNames = (): ReactNode => {
    return _.map(attachmentsList || [], (attachment, index) => {
      const fileName = (attachment as ImagePickerResponse).fileName || (attachment as DocumentPickerResponse).name

      return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" flexWrap="wrap" mt={index !== 0 ? theme.dimensions.condensedMarginBetween : 0} key={index}>
          <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
            <VAIcon name="PaperClip" width={20} height={20} fill="spinner" />
            <TextView variant="MobileBodyBold" ml={theme.dimensions.textIconMargin}>
              {fileName}
            </TextView>
          </Box>

          <Box display="flex" flexDirection="row" alignItems="center">
            <VAIcon name="Remove" {...iconProps} />
            <TextView
              variant="HelperText"
              ml={theme.dimensions.textIconMargin}
              color="link"
              textDecoration="underline"
              textDecorationColor="link"
              accessibilityRole="link"
              {...testIdProps(t('remove'))}
              {...a11yHintProp(t('remove.a11yHint', { content: fileName }))}
              onPress={() => (removeOnPress ? removeOnPress(attachment) : {})}>
              {t('remove')}
            </TextView>
          </Box>
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

  return (
    <Box>
      <Box display="flex" flexDirection="row" justifyContent="space-between" flexWrap="wrap">
        <TextView>{t('attachments')}</TextView>
        <Box display="flex" flexDirection="row" alignItems="center" flexWrap="wrap">
          <VAIcon name="QuestionMark" {...iconProps} />
          <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline" textDecorationColor="link" accessibilityRole="link">
            {t('howToAttachAFile')}
          </TextView>
        </Box>
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween} mb={attachmentsDoNotExist ? 0 : theme.dimensions.standardMarginBetween}>
        {renderFileNames()}
      </Box>
      {!!largeButtonProps && <VAButton {...largeButtonProps} buttonType={ButtonTypesConstants.buttonSecondary} iconProps={{ ...iconProps, fill: 'active', name: 'PaperClip' }} />}
    </Box>
  )
}

export default FormAttachments
