import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { StyleProp, ViewStyle } from 'react-native'
import { map } from 'underscore'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { Box, BoxProps, ButtonTypesConstants, TextArea, TextView, VAButton, VAScrollView } from 'components'
import { ClaimsStackParamList } from '../../../../ClaimsStackScreens'
import { NAMESPACE } from 'constants/namespaces'
import { formatDateMMMMDDYYYY } from 'utils/formattingUtils'
import { testIdProps } from 'utils/accessibility'
import { useRouteNavigation, useTheme } from 'utils/hooks'

type FileRequestDetailsProps = StackScreenProps<ClaimsStackParamList, 'FileRequestDetails'>

const FileRequestDetails: FC<FileRequestDetailsProps> = ({ route }) => {
  const { t } = useTranslation(NAMESPACE.CLAIMS)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const { request } = route.params
  const { standardMarginBetween, contentMarginBottom, contentMarginTop, gutter } = theme.dimensions
  const { displayName, description, uploaded, uploadDate, documents } = request

  const boxProps: BoxProps = {
    borderStyle: 'solid',
    borderTopWidth: 'default',
    borderTopColor: 'primary',
    mt: contentMarginTop,
  }

  const mainViewStyle: StyleProp<ViewStyle> = {
    flexGrow: 1,
  }

  const getUploadedFileNames = (): JSX.Element[] => {
    return map(documents || [], (item, index) => {
      return (
        <TextView variant="MobileBody" key={index}>
          {item.filename}
        </TextView>
      )
    })
  }

  const getUploadedDate = (): string => {
    return uploadDate ? formatDateMMMMDDYYYY(uploadDate) : ''
  }

  const getUploadedFileType = (): string | undefined => {
    return documents && documents.length > 0 ? documents[0].fileType : ''
  }

  return (
    <VAScrollView {...testIdProps('file-request-details-page')} contentContainerStyle={mainViewStyle}>
      <Box mt={contentMarginTop} mb={contentMarginBottom} flex={1}>
        {uploaded && (
          <Box mb={standardMarginBetween}>
            <TextArea>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.submittedTitle')}
              </TextView>
              <TextView mb={standardMarginBetween} variant="MobileBody">
                {getUploadedDate()}
              </TextView>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.fileTitle')}
              </TextView>
              <Box mb={standardMarginBetween}>{getUploadedFileNames()}</Box>
              <TextView variant="MobileBodyBold" accessibilityRole="header">
                {t('fileRequestDetails.typeTitle')}
              </TextView>
              <TextView variant="MobileBody">{getUploadedFileType()}</TextView>
            </TextArea>
          </Box>
        )}
        <TextArea>
          <TextView mb={standardMarginBetween} variant="MobileBodyBold" accessibilityRole="header">
            {displayName}
          </TextView>
          <TextView variant="MobileBody">{description}</TextView>
        </TextArea>
      </Box>
      {!uploaded && (
        <Box {...boxProps}>
          <Box mt={standardMarginBetween} mx={gutter} mb={contentMarginBottom}>
            <VAButton
              onPress={navigateTo('SelectFile', { request })}
              label={t('fileUpload.selectAFile')}
              testID={t('fileUpload.selectAFile')}
              buttonType={ButtonTypesConstants.buttonSecondary}
              a11yHint={t('fileUpload.selectAFileA11yHint')}
            />
            <Box mt={theme.dimensions.condensedMarginBetween}>
              <VAButton
                onPress={navigateTo('TakePhotos', { request })}
                label={t('fileUpload.takePhotos')}
                testID={t('fileUpload.takePhotos')}
                buttonType={ButtonTypesConstants.buttonSecondary}
                a11yHint={t('fileUpload.takePhotosA11yHint')}
              />
            </Box>
          </Box>
        </Box>
      )}
    </VAScrollView>
  )
}

export default FileRequestDetails
