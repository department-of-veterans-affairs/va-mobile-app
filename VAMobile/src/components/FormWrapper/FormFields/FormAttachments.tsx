import React, { FC, ReactNode } from 'react'

import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import _ from 'underscore'

import { Box, ButtonTypesConstants, TextView, VAButton, VAIcon } from 'components/index'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme, useTranslation } from 'utils/hooks'

export type FormAttachmentsProps = {
  /** callback called on click of remove link for an attachment */
  removeOnPress?: (attachment: ImagePickerResponse | DocumentPickerResponse) => void
  /** text for optional large button */
  largeButtonText?: string
  /** callback for optional large button */
  largeButtonOnClick?: () => void
  /** list of current attachments */
  attachmentsList?: Array<ImagePickerResponse | DocumentPickerResponse>
}

const FormAttachments: FC<FormAttachmentsProps> = ({ removeOnPress, largeButtonText, largeButtonOnClick, attachmentsList }) => {
  const theme = useTheme()
  const t = useTranslation(NAMESPACE.COMMON)

  const renderFileNames = (): ReactNode => {
    return _.map(attachmentsList || [], (attachment, index) => {
      const fileName = (attachment as ImagePickerResponse).fileName || (attachment as DocumentPickerResponse).name

      return (
        <Box display="flex" flexDirection="row" justifyContent="space-between" flexWrap="wrap" key={index}>
          <Box display="flex" flexDirection="row" alignItems="center">
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
        <Box display="flex" flexDirection="row" alignItems="center">
          <VAIcon name="QuestionMark" {...iconProps} />
          <TextView variant="HelperText" ml={theme.dimensions.textIconMargin} color="link" textDecoration="underline">
            {t('howToAttachAFile')}
          </TextView>
        </Box>
      </Box>
      <Box mt={theme.dimensions.standardMarginBetween} mb={attachmentsDoNotExist ? 0 : theme.dimensions.standardMarginBetween}>
        {renderFileNames()}
      </Box>
      {largeButtonText && largeButtonOnClick && (
        <VAButton
          buttonType={ButtonTypesConstants.buttonSecondary}
          label={largeButtonText}
          onPress={largeButtonOnClick}
          iconProps={{ ...iconProps, fill: 'active', name: 'PaperClip' }}
        />
      )}
    </Box>
  )
}

export default FormAttachments
